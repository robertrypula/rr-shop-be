import * as md5 from 'md5';

import { Headers, SignatureBag } from './models';

export const isSignatureValid = (headers: Headers, body: string, secondKey: string): boolean => {
  const signatureBag: SignatureBag = getSignatureBag(headers);
  const algorithm: string = signatureBag.algorithm.toLowerCase();

  // https://github.com/PayU-EMEA/openpayu_php/blob/3bda67328f95caf8f7b7a3fd2e8c2dd11ab463be/lib/OpenPayU/Util.php#L99
  if (algorithm === 'md5') {
    return signatureBag.signature === md5(body + secondKey);
  } else if (['sha', 'sha1', 'sha-1'].includes(algorithm)) {
    // return signatureBag.signature === sha1(body + secondKey);
  }

  throw `Unsupported hashing algorithm: ${algorithm}`;
};

export const getSignatureBag = (headers: Headers): SignatureBag => {
  const unpacked: Headers = (headers['openpayu-signature'] || '')
    .split(';')
    .reduce((a: Headers, part: string): Headers => {
      const split: string[] = part.split('=');

      a[split[0]] = split[1];

      return a;
    }, {});

  return {
    algorithm: unpacked.algrithm ? unpacked.algrithm : '',
    sender: unpacked.sender ? unpacked.sender : '',
    signature: unpacked.signature ? unpacked.signature : ''
  };
};
