import { NextFunction, Request, Response } from 'express';
import { sign, verify } from 'jsonwebtoken';

import { getSecretConfig, jwtConfig } from '../config';
import { JwtPayload, SecretConfig } from '../model';

export const checkJwt = (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const token = req.headers.auth as string;
  let jwtPayload: JwtPayload;
  let secretConfig: SecretConfig;

  try {
    secretConfig = getSecretConfig();
  } catch (error) {
    res.status(500).send();
    return;
  }

  try {
    jwtPayload = verify(token, secretConfig.jwt.secret) as JwtPayload;
    res.locals.jwtPayload = jwtPayload;
  } catch (error) {
    res.status(401).send();
    return;
  }

  res.setHeader(
    'token',
    sign({ userId: jwtPayload.userId, username: jwtPayload.username }, secretConfig.jwt.secret, {
      expiresIn: jwtConfig.expiresIn
    })
  );
  next();
};
