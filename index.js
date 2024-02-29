const fetch = require("node-fetch")
const path = require("node:path")
const fs = require("fs")
const oldFingerprint = require("./fingerprint.json")
const { BASE_URI, currentHash, downloadOnlyNewFiles } = require("./config.json")

async function main () {
    const fingerprint = await fetch(`${BASE_URI}${currentHash}/fingerprint.json`)

    const fingerprintJson = await fingerprint.json()

    const version = fingerprintJson.version

    await writeFile(`./${version}/fingerprint.json`, JSON.stringify(fingerprintJson, null, 4))

    console.log("Fingerprint downloaded. Fingerprint version: " + version)
    const files = downloadOnlyNewFiles ? fingerprintJson.files.filter((e, i) => e.sha != oldFingerprint.files[i].sha) : fingerprintJson.files

    for (const file of files) {
        const response = await fetch(`${BASE_URI}${currentHash}/${file.file}`)
        
        console.log(`Downloading ${file.file} (${files.indexOf(file) + 1}/${files.length})...`)

        const buffer = await response.buffer()

        await writeFile(`./${version}/${file.file}`, buffer)
    }
}

async function isExists(path) {
    try {
      await fs.access(path);
      return true;
    } catch {
      return false;
    }
  };
  
async function writeFile(filePath, data) {
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

main()