# Brawl Stars Assets Downloader
The greatest assets downloader.

## Setting up
1. Install [NodeJS](https://nodejs.org/)
2. Download/clone repository.
3. Type in terminal `npm install`
4. Fill `config.json` with your data.
5. `node index`

## `config.json`
```json
{
    "BASE_URI": "https://game-assets.brawlstarsgame.com/",
    "currentHash": "d1b6ae1d4b32011d65474410d41b91879d53e881",
    "downloadOnlyNewFiles": true
}
```
* `BASE_URI` - Patcher URI
* `currentHash` - Hash from `fingerprint.json`
* `downloadOnlyNewFiles` - Download only files, that have newer version (you need to put your own fingerprint)

## TODO
* Multithreading

## Supercell Fan Content Policy
Sounds, CSVs, images and all other assets from the Brawl Stars app. Created for content creators and other fan content in line with Supercell's fan content policy (http://supercell.com/en/fan-content-policy/)