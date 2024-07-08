import { QmcCrypto } from '@xhacker/qmcwasm/QmcWasmBundle';
import QmcCryptoModule from '@xhacker/qmcwasm/QmcWasmBundle';
import { MergeUint8Array } from '@/utils/MergeUint8Array';

// Can process 2M of data each time
const DECRYPTION_BUF_SIZE = 2 * 1024 * 1024;

export interface QMCDecryptionResult {
  success: boolean;
  data: Uint8Array;
  songId: string | number;
  error: string;
}

/**
 * Decrypt a QMC encrypted file.
 *
 * If detection and decryption are successful, return the decrypted Uint8Array data.
 * @param  {ArrayBuffer} qmcBlob The input file Blob
 */
export async function DecryptQmcWasm(qmcBlob: ArrayBuffer, ext: string): Promise<QMCDecryptionResult> {
  const result: QMCDecryptionResult = { success: false, data: new Uint8Array(), songId: 0, error: '' };

  // Initialize the module
  let QmcCryptoObj: QmcCrypto;

  try {
    QmcCryptoObj = await QmcCryptoModule();
  } catch (err: any) {
    result.error = err?.message || 'Failed to load wasm';
    return result;
  }
  if (!QmcCryptoObj) {
    result.error = 'Failed to load wasm';
    return result;
  }

  // Allocate memory block and write file data to the WASM memory heap
  const qmcBuf = new Uint8Array(qmcBlob);
  const pQmcBuf = QmcCryptoObj._malloc(DECRYPTION_BUF_SIZE);
  const preDecDataSize = Math.min(DECRYPTION_BUF_SIZE, qmcBlob.byteLength); // Initialize buffer size
  QmcCryptoObj.writeArrayToMemory(qmcBuf.slice(-preDecDataSize), pQmcBuf);

  // Perform decryption initialization
  ext = '.' + ext;
  const tailSize = QmcCryptoObj.preDec(pQmcBuf, preDecDataSize, ext);
  if (tailSize == -1) {
    result.error = QmcCryptoObj.getErr();
    return result;
  } else {
    result.songId = QmcCryptoObj.getSongId();
    result.songId = result.songId == "0" ? 0 : result.songId;
  }

  const decryptedParts = [];
  let offset = 0;
  let bytesToDecrypt = qmcBuf.length - tailSize;
  while (bytesToDecrypt > 0) {
    const blockSize = Math.min(bytesToDecrypt, DECRYPTION_BUF_SIZE);

    // Decrypt some segments
    const blockData = new Uint8Array(qmcBuf.slice(offset, offset + blockSize));
    QmcCryptoObj.writeArrayToMemory(blockData, pQmcBuf);
    decryptedParts.push(QmcCryptoObj.HEAPU8.slice(pQmcBuf, pQmcBuf + QmcCryptoObj.decBlob(pQmcBuf, blockSize, offset)));

    offset += blockSize;
    bytesToDecrypt -= blockSize;
  }
  QmcCryptoObj._free(pQmcBuf);

  result.data = MergeUint8Array(decryptedParts);
  result.success = true;

  return result;
}
