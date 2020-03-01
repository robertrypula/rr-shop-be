import * as md5 from 'md5';

import { toSignatureBag } from './mappers';
import { Headers, SignatureBag } from './models';

export const isSignatureValid = (headers: Headers, responseBody: string, secondKey: string): boolean => {
  const signatureBag: SignatureBag = toSignatureBag(headers);
  const algorithm: string = signatureBag.algorithm.toLowerCase();
  let hash: string;

  // https://github.com/PayU-EMEA/openpayu_php/blob/3bda67328f95caf8f7b7a3fd2e8c2dd11ab463be/lib/OpenPayU/Util.php#L99
  if (algorithm === 'md5') {
    hash = md5(responseBody + secondKey);
  } else if (['sha', 'sha1', 'sha-1'].includes(algorithm)) {
    // hash = sha1(responseBody + secondKey); // TODO find good sha1 npm library
  } else {
    throw `Unsupported hashing algorithm '${algorithm}'`;
  }

  console.log(responseBody + secondKey);
  console.log(hash);
  console.log(signatureBag.signature);

  return hash && hash === signatureBag.signature;
};
