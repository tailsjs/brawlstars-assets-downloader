const fetch = require("node-fetch")
const path = require("node:path")
const fs = require("fs")
const net = require('net');
const zlib = require('zlib')
const ByteStream = require("./ByteStream")
const oldFingerprint = require("./fingerprint.json")
const { IP, PORT, downloadOnlyNewFiles, clientHelloData } = require("./config.json")

const client = new net.Socket()

const zlibBytes = Buffer.from([0x78, 0x9C])
let fingerBuffer = Buffer.from([]);
let fingerprintJson = {}
let size = -1
let host = ""

client.connect(PORT, IP, function() { // Connecting to the game, sending ClientHello
    console.log("Downloading fingerprint...")
	console.log(`Connected to ${IP}:${PORT}`)

    SendClientHello()
});

client.on('data', async function(packet) { // Receiving data
    if (fingerBuffer.length !== 0) { // In case, if we already got 20103
        fingerBuffer = Buffer.concat([fingerBuffer, packet])

        console.log(`Gotcha section of bytes... (${fingerBuffer.length}/${size})`)

        if (size == fingerBuffer.length) {
            const buffer = zlib.inflateSync(fingerBuffer)

            fingerprintJson = JSON.parse(buffer.toString("utf8"))

            await downloadAssets();

            client.destroy();
        }

        return;
    }

    const message = { // Receiving first bytes
      id: packet.readUInt16BE(0),
      len: packet.readUIntBE(2, 3),
      version: packet.readUInt16BE(5),
      payload: packet.slice(7, this.len)
    }

    if (message.id === 20103) {
        console.log("Gotcha LoginFailed.")
        const stream = new ByteStream(message.payload)

        const code = stream.readInt()
        stream.readString()
        stream.readString()

        host = stream.readString()

        if (code === 7) { // Unzipping
            const zlibBufferIndex = message.payload.indexOf(zlibBytes)

            if (!zlibBufferIndex) {
                return console.log("No zlib")
            }

            fingerBuffer = message.payload.slice(zlibBufferIndex)
            size = message.len - zlibBufferIndex

            console.log(`Gotcha zlib. Waiting for next section of bytes... (${fingerBuffer.length}/${size})`)
        }
        
    }
})

async function downloadAssets () { // Downloading assets after fingerprint fetching
    const version = fingerprintJson.version
    const hash = fingerprintJson.sha

    await writeFile(`./${version}/fingerprint.json`, JSON.stringify(fingerprintJson, null, 4))

    console.log("Fingerprint downloaded. Fingerprint version: " + version)
    const files = downloadOnlyNewFiles ? fingerprintJson.files.filter((e, i) => e.sha != oldFingerprint.files[i].sha) : fingerprintJson.files

    for (const file of files) {
        const response = await fetch(`${host}/${hash}/${file.file}`)
        
        console.log(`Downloading ${file.file} (${files.indexOf(file) + 1}/${files.length})...`)

        const buffer = await response.buffer()

        await writeFile(`./${version}/${file.file}`, buffer)
    }
}

function SendClientHello () { // Sending ClientHello
    const stream = new ByteStream();

    stream.writeInt(2)
    stream.writeInt(clientHelloData.keyVersion)
    stream.writeInt(clientHelloData.major)
    stream.writeInt(clientHelloData.build)
    stream.writeInt(clientHelloData.minor)
    stream.writeString(clientHelloData.hash)
    stream.writeInt(0)
    stream.writeInt(0)

    client.write(generateResponse(10100, stream.buffer))

    console.log("ClientHello sent.")
}

function generateResponse (id, buffer) { // Generating response
    const header = Buffer.alloc(7)

    header.writeUInt16BE(id, 0)
    header.writeUIntBE(buffer.length, 2, 3)
    header.writeUInt16BE(0, 5)

    return Buffer.concat([header, buffer])
}

async function isExists (path) { // Checking if path exists
    try {
      await fs.access(path);
      return true;
    } catch {
      return false;
    }
  };
  
async function writeFile (filePath, data) { // Writing file
    try {
      const dirname = path.dirname(filePath);
      const exist = await isExists(dirname);
      if (!exist) {
        await fs.mkdirSync(dirname, {recursive: true});
      }
      
      await fs.writeFileSync(filePath, data, 'utf8');
    } catch (err) {
      console.log(err)
    }
}