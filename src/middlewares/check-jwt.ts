import { NextFunction, Request, Response } from 'express';
import { sign, verify } from 'jsonwebtoken';

import { getSecretConfig } from '../config';
import { JwtPayload, SecretConfig } from '../models/model';

export const checkJwt = (req: Request, res: Response, next: NextFunction): Promise<void> => {
  let token = req.headers.authorization as string;
  let jwtPayload: JwtPayload;
  let secretConfig: SecretConfig;

  token = token.replace('Bearer', '').trim();

  try {
    secretConfig = getSecretConfig();
  } catch (error) {
    res.status(500).send({ errorMessage: 'Internal server error: JWT token verification failed' });
    return;
  }

  try {
    jwtPayload = verify(token, secretConfig.jwt.secret) as JwtPayload;
    res.locals.jwtPayload = jwtPayload;
  } catch (error) {
    res.status(401).send({ errorMessage: 'Token is not valid' });
    return;
  }

  res.setHeader(
    'Authorization',
    sign({ userId: jwtPayload.userId, username: jwtPayload.username }, secretConfig.jwt.secret, {
      expiresIn: secretConfig.jwt.expiresIn
    })
  );
  next();
};
