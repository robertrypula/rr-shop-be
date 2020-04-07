import { validate, ValidationError } from 'class-validator';
import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { getRepository } from 'typeorm';

import { getSecretConfig } from '../config';
import { User } from '../entity/user';
import { JwtPayload, SecretConfig } from '../models/models';

export class AuthController {
  public constructor(protected repository = getRepository(User)) {}

  public async login(req: Request, res: Response): Promise<void> {
    const { username, password } = req.body;
    let user: User;
    let secretConfig: SecretConfig;

    if (!(username && password)) {
      res.status(400).send({ errorMessage: 'Missing username and/or password field' });
      return;
    }

    try {
      user = await this.repository.findOneOrFail({ where: { username } });
    } catch (error) {
      res.status(401).send({ errorMessage: 'User or password wrong' });
      return;
    }

    if (!user.checkIfUnencryptedPasswordIsValid(password)) {
      res.status(401).send({ errorMessage: 'User or password wrong' });
      return;
    }

    try {
      secretConfig = getSecretConfig();
    } catch (error) {
      res.status(500).send({ errorMessage: 'Internal server error: JWT token verification failed' });
      return;
    }

    res.send({
      token: jwt.sign({ userId: user.id, username: user.username }, secretConfig.jwt.secret, {
        expiresIn: secretConfig.jwt.expiresIn
      })
    });
  }

  public async changePassword(req: Request, res: Response): Promise<void> {
    const jwtPayload: JwtPayload = res.locals.jwtPayload;
    const { oldPassword, newPassword } = req.body;
    let errors: ValidationError[];
    let user: User;

    if (!(oldPassword && newPassword)) {
      res.status(400).send({ errorMessage: 'Missing oldPassword and/or newPassword field' });
    }

    try {
      user = await this.repository.findOneOrFail(jwtPayload.userId);
    } catch (id) {
      res.status(401).send({ errorMessage: 'Could not find user in order to change the password' });
    }

    if (!user.checkIfUnencryptedPasswordIsValid(oldPassword)) {
      res.status(401).send({ errorMessage: 'Old password is not valid' });
      return;
    }

    user.password = newPassword;

    errors = await validate(user);
    if (errors.length > 0) {
      res.status(400).send({ errorMessage: 'User cannot be saved in DB as it is not valid', errorDetails: errors });
      return;
    }

    user.hashPassword();
    await this.repository.save(user);

    res.status(204).send({ successMessage: 'Password changed successfully' });
  }
}
