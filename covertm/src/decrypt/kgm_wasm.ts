import { KgmCrypto } from '@xhacker/kgmwasm/KgmWasmBundle';
import KgmCryptoModule from '@xhacker/kgmwasm/KgmWasmBundle';
import { MergeUint8Array } from '@/utils/MergeUint8Array';

// Can process 2M of data each time
const DECRYPTION_BUF_SIZE = 2 * 1024 * 1024;

export interface KGMDecryptionResult {
  success: boolean;
  data: Uint8Array;
  error: string;
}

/**
 * Decrypt a file encrypted with KGM.
 *
 * If detection and decryption are successful, return the decrypted Uint8Array data.
 * @param  {ArrayBuffer} kgmBlob The input file Blob
 */
export async function DecryptKgmWasm(kgmBlob: ArrayBuffer, ext: string): Promise<KGMDecryptionResult> {
  const result: KGMDecryptionResult = { success: false, data: new Uint8Array(), error: '' };

  // Initialize the module
  let KgmCryptoObj: KgmCrypto;

  try {
    KgmCryptoObj = await KgmCryptoModule();
  } catch (err: any) {
    result.error = err?.message || 'Failed to load wasm';
    return result;
  }
  if (!KgmCryptoObj) {
    result.error = 'Failed to load wasm';
    return result;
  }

  // Allocate memory block and write file data to the WASM memory heap
  let kgmBuf = new Uint8Array(kgmBlob);
  const pKgmBuf = KgmCryptoObj._malloc(DECRYPTION_BUF_SIZE);
  const preDecDataSize = Math.min(DECRYPTION_BUF_SIZE, kgmBlob.byteLength); // Initialize buffer size
  KgmCryptoObj.writeArrayToMemory(kgmBuf.slice(0, preDecDataSize), pKgmBuf);

  // Perform decryption initialization
  const headerSize = KgmCryptoObj.preDec(pKgmBuf, preDecDataSize, ext);
  kgmBuf = kgmBuf.slice(headerSize);

  const decryptedParts = [];
  let offset = 0;
  let bytesToDecrypt = kgmBuf.length;
  while (bytesToDecrypt > 0) {
    const blockSize = Math.min(bytesToDecrypt, DECRYPTION_BUF_SIZE);

    // Decrypt a portion
    const blockData = new Uint8Array(kgmBuf.slice(offset, offset + blockSize));
    KgmCryptoObj.writeArrayToMemory(blockData, pKgmBuf);
    KgmCryptoObj.decBlob(pKgmBuf, blockSize, offset);
    decryptedParts.push(KgmCryptoObj.HEAPU8.slice(pKgmBuf, pKgmBuf + blockSize));

    offset += blockSize;
    bytesToDecrypt -= blockSize;
  }
  KgmCryptoObj._free(pKgmBuf);

  result.data = MergeUint8Array(decryptedParts);
  result.success = true;

  return result;
}
