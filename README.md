# Brawl Stars Assets Downloader
The greatest assets downloader.

## Setting up
1. Install [NodeJS](https://nodejs.org/)
2. Download/clone repository.
3. Type in terminal `npm install`
4. Change `config.json` if you feel so.
5. `node index`

## `config.json`
```json
{
    "IP": "game.brawlstarsgame.com",
    "PORT": 9339,
    "downloadOnlyNewFiles": true,
    "clientHelloData": {
        "keyVersion": 43,
        "major": 54,
        "minor": 277,
        "build": 1,
        "hash": "abc428e9f4f14fcf7c82bd69b4e56bd1c4a0b951"
    }
}
```
* `IP` - Game IP
* `PORT` - Game port
* `downloadOnlyNewFiles` - Download only files, that have newer version, or doesn't exist in old fingerprint
* `clientHelloData` - Some data for 10100 packet.
* `clientHelloData.keyVersion` - Current Brawl Stars Pepper Crypto Key
* `clientHelloData.major` - Game major
* `clientHelloData.minor` - Game minor
* `clientHelloData.build` - Game build (not necessary to change)
* `clientHelloData.hash` - Old fingerprint hash

## TODO
* Multithreading

## Supercell Fan Content Policy
Sounds, CSVs, images and all other assets from the Brawl Stars app. Created for content creators and other fan content in line with Supercell's fan content policy (http://supercell.com/en/fan-content-policy/)