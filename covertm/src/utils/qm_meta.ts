import { IAudioMetadata, parseBlob as metaParseBlob } from 'music-metadata-browser';
import iconv from 'iconv-lite';
import {

GetCoverFromFile,
GetImageFromURL,
GetMetaFromFile,
WriteMetaToFlac,
WriteMetaToMp3,
AudioMimeType,
split_regex,
} from '@/decrypt/utils';

interface MetaResult {
title: string;
artist: string;
album: string;
imgUrl: string;
blob: Blob;
}

const fromGBK = (text?: string) => iconv.decode(new Buffer(text || ''), 'gbk');

/**
 *
 * @param musicBlob Music file (decrypted)
 * @param name File name
 * @param ext Original file extension
 * @param id Track ID (number or string consisting of digits)
 * @returns Promise
 */
export async function extractQQMusicMeta(
musicBlob: Blob,
name: string,
ext: string,
id?: number | string,
): Promise<MetaResult> {
const musicMeta = await metaParseBlob(musicBlob);
for (let metaIdx in musicMeta.native) {
  if (!musicMeta.native.hasOwnProperty(metaIdx)) continue;
  if (musicMeta.native[metaIdx].some((item) => item.id === 'TCON' && item.value === '(12)')) {
    console.warn('try using gbk encoding to decode meta');
    musicMeta.common.artist = '';
    if (!musicMeta.common.artists) {
      musicMeta.common.artist = fromGBK(musicMeta.common.artist);
    }
    else {
      musicMeta.common.artist = musicMeta.common.artists.map(fromGBK).join();
    }
    musicMeta.common.title = fromGBK(musicMeta.common.title);
    musicMeta.common.album = fromGBK(musicMeta.common.album);
  }
}

const info = GetMetaFromFile(name, musicMeta.common.title, musicMeta.common.artist);
info.artist = info.artist || '';

let imageURL = GetCoverFromFile(musicMeta);
return {
  title: info.title,
  artist: info.artist,
  album: musicMeta.common.album || '',
  imgUrl: imageURL,
  blob: await writeMetaToAudioFile({
    title: info.title,
    artists: info.artist.split(split_regex),
    ext,
    imageURL,
    musicMeta,
    blob: musicBlob,
  }),
};
}

interface NewAudioMeta {
title: string;
artists: string[];
ext: string;

musicMeta: IAudioMetadata;

blob: Blob;
imageURL: string;
}

async function writeMetaToAudioFile(info: NewAudioMeta): Promise<Blob> {
try {
  const imageInfo = await GetImageFromURL(info.imageURL);
  if (!imageInfo) {
    console.warn('获取图像失败');
  }
  const newMeta = { picture: imageInfo?.buffer, title: info.title, artists: info.artists };
  const buffer = Buffer.from(await info.blob.arrayBuffer());
  const mime = AudioMimeType[info.ext] || AudioMimeType.mp3;
  if (info.ext === 'mp3') {
    return new Blob([WriteMetaToMp3(buffer, newMeta, info.musicMeta)], { type: mime });
  } else if (info.ext === 'flac') {
    return new Blob([WriteMetaToFlac(buffer, newMeta, info.musicMeta)], { type: mime });
  } else {
    console.info('writing metadata for ' + info.ext + ' is not being supported for now');
  }
} catch (e) {
  console.warn('Error while appending cover image to file ' + e);
}
return info.blob;
}
