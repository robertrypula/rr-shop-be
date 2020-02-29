import * as md5 from 'md5';

import { OPEN_PAY_U_SIGNATURE_HEADER } from './constants';
import { Headers, SignatureBag } from './models';

export const isSignatureValid = (headers: Headers, responseBody: string, secondKey: string): boolean => {
  const signatureBag: SignatureBag = getSignatureBag(headers);
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

  return hash && hash === signatureBag.signature;
};

export const getSignatureBag = (headers: Headers): SignatureBag => {
  const unpacked: Headers = (headers[OPEN_PAY_U_SIGNATURE_HEADER] || '')
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
