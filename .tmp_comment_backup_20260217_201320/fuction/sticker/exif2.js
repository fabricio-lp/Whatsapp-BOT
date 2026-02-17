const fs = require('fs');

const {tmpdir: tmpdir} = require('os');

const Crypto = require('crypto');

const ff = require('fluent-ffmpeg');

const webp = require('node-webpmux');

const path = require('path');

async function imageToWebp2(media) {
    const tmpFileOut = path.join(tmpdir(), `${Crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`);
    const tmpFileIn = path.join(tmpdir(), `${Crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.jpg`);
    fs.writeFileSync(tmpFileIn, media);
    await new Promise((resolve, reject) => {
        ff(tmpFileIn).on('error', reject).on('end', () => resolve(true)).addOutputOptions([ '-vcodec', 'libwebp', '-vf', 'scale=\'min(9999999,iw)\':min\'(9999999,ih)\':force_original_aspect_ratio=decrease,fps=15, pad=0:0:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse' ]).toFormat('webp').save(tmpFileOut);
    });
    const buff = fs.readFileSync(tmpFileOut);
    fs.unlinkSync(tmpFileOut);
    fs.unlinkSync(tmpFileIn);
    return buff;
}

async function videoToWebp2(media) {
    const tmpFileOut = path.join(tmpdir(), `${Crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`);
    const tmpFileIn = path.join(tmpdir(), `${Crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.mp4`);
    fs.writeFileSync(tmpFileIn, media);
    await new Promise((resolve, reject) => {
        ff(tmpFileIn).on('error', reject).on('end', () => resolve(true)).addOutputOptions([ '-vcodec', 'libwebp', '-vf', 'scale=220:220,fps=12,pad=0:0:-1:-1:color=white@0.0,split[a][b];[a]palettegen=reserve_transparent=on:transparency_color=ffffff[p];[b][p]paletteuse' ]).toFormat('webp').save(tmpFileOut);
    });
    const buff = fs.readFileSync(tmpFileOut);
    fs.unlinkSync(tmpFileOut);
    fs.unlinkSync(tmpFileIn);
    return buff;
}

async function writeExifImg2(media, metadata) {
    let wMedia = await imageToWebp2(media);
    const tmpFileIn = path.join(tmpdir(), `${Crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`);
    const tmpFileOut = path.join(tmpdir(), `${Crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`);
    fs.writeFileSync(tmpFileIn, wMedia);
    if (metadata.packname || metadata.author) {
        const img = new webp.Image;
        const json = {
            'sticker-pack-id': `BOT GUGU MD`,
            'sticker-pack-name': metadata.packname,
            'sticker-pack-publisher': metadata.author,
            emojis: metadata.categories ? metadata.categories : [ '' ]
        };
        const exifAttr = Buffer.from([ 73, 73, 42, 0, 8, 0, 0, 0, 1, 0, 65, 87, 7, 0, 0, 0, 0, 0, 22, 0, 0, 0 ]);
        const jsonBuff = Buffer.from(JSON.stringify(json), 'utf-8');
        const exif = Buffer.concat([ exifAttr, jsonBuff ]);
        exif.writeUIntLE(jsonBuff.length, 14, 4);
        await img.load(tmpFileIn);
        fs.unlinkSync(tmpFileIn);
        img.exif = exif;
        await img.save(tmpFileOut);
        return tmpFileOut;
    }
}

async function writeExifVid2(media, metadata) {
    let wMedia = await videoToWebp2(media);
    const tmpFileIn = path.join(tmpdir(), `${Crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`);
    const tmpFileOut = path.join(tmpdir(), `${Crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`);
    fs.writeFileSync(tmpFileIn, wMedia);
    if (metadata.packname || metadata.author) {
        const img = new webp.Image;
        const json = {
            'sticker-pack-id': `BOT GUGU MD`,
            'sticker-pack-name': metadata.packname,
            'sticker-pack-publisher': metadata.author,
            emojis: metadata.categories ? metadata.categories : [ '' ]
        };
        const exifAttr = Buffer.from([ 73, 73, 42, 0, 8, 0, 0, 0, 1, 0, 65, 87, 7, 0, 0, 0, 0, 0, 22, 0, 0, 0 ]);
        const jsonBuff = Buffer.from(JSON.stringify(json), 'utf-8');
        const exif = Buffer.concat([ exifAttr, jsonBuff ]);
        exif.writeUIntLE(jsonBuff.length, 14, 4);
        await img.load(tmpFileIn);
        fs.unlinkSync(tmpFileIn);
        img.exif = exif;
        await img.save(tmpFileOut);
        return tmpFileOut;
    }
}

async function writeExif2(media, metadata) {
    let wMedia = /webp/.test(media.mimetype) ? media.data : /image/.test(media.mimetype) ? await imageToWebp2(media.data) : /video/.test(media.mimetype) ? await videoToWebp2(media.data) : '';
    const tmpFileIn = path.join(tmpdir(), `${Crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`);
    const tmpFileOut = path.join(tmpdir(), `${Crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`);
    fs.writeFileSync(tmpFileIn, wMedia);
    if (metadata.packname || metadata.author) {
        const img = new webp.Image;
        const json = {
            'sticker-pack-id': `BOT GUGU MD`,
            'sticker-pack-name': metadata.packname,
            'sticker-pack-publisher': metadata.author,
            emojis: metadata.categories ? metadata.categories : [ '' ]
        };
        const exifAttr = Buffer.from([ 73, 73, 42, 0, 8, 0, 0, 0, 1, 0, 65, 87, 7, 0, 0, 0, 0, 0, 22, 0, 0, 0 ]);
        const jsonBuff = Buffer.from(JSON.stringify(json), 'utf-8');
        const exif = Buffer.concat([ exifAttr, jsonBuff ]);
        exif.writeUIntLE(jsonBuff.length, 14, 4);
        await img.load(tmpFileIn);
        fs.unlinkSync(tmpFileIn);
        img.exif = exif;
        await img.save(tmpFileOut);
        return tmpFileOut;
    }
}

module.exports = {
    imageToWebp2: imageToWebp2,
    videoToWebp2: videoToWebp2,
    writeExifImg2: writeExifImg2,
    writeExifVid2: writeExifVid2,
    writeExif2: writeExif2
};