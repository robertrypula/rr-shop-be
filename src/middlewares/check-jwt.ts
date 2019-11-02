import { Request, Response, NextFunction } from 'express';
import { sign, verify } from 'jsonwebtoken';

import { JwtPayload } from '../model';
import { jwtSecret } from "../config/config";

export const checkJwt = (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const token = req.headers['auth'] as string;
  let jwtPayload: JwtPayload;

  try {
    jwtPayload = verify(token, jwtSecret) as JwtPayload;
    res.locals.jwtPayload = jwtPayload;
  } catch (error) {
    res.status(401).send();
    return;
  }

  res.setHeader('token', sign({ ...jwtPayload }, jwtSecret, { expiresIn: '1h' }));
  next();
}
