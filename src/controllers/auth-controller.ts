import { validate, ValidationError } from 'class-validator';
import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { getRepository } from 'typeorm';

import { jwtSecret } from '../config';
import { User } from '../entity/user';
import { JwtPayload } from '../model';

export class AuthController {
  public constructor(protected userRepository = getRepository(User)) {}

  public async login(req: Request, res: Response): Promise<void> {
    const { username, password } = req.body;
    let user: User;

    if (!(username && password)) {
      res.status(400).send();
    }

    try {
      user = await this.userRepository.findOneOrFail({ where: { username } });
    } catch (error) {
      res.status(401).send();
    }

    if (!user.checkIfUnencryptedPasswordIsValid(password)) {
      res.status(401).send();
      return;
    }

    res.send(jwt.sign({ userId: user.id, username: user.username }, jwtSecret, { expiresIn: '1h' }));
  }

  public async changePassword(req: Request, res: Response): Promise<void> {
    const jwtPayload: JwtPayload = res.locals.jwtPayload;
    const { oldPassword, newPassword } = req.body;
    let errors: ValidationError[];
    let user: User;

    if (!(oldPassword && newPassword)) {
      res.status(400).send();
    }

    try {
      user = await this.userRepository.findOneOrFail(jwtPayload.userId);
    } catch (id) {
      res.status(401).send();
    }

    if (!user.checkIfUnencryptedPasswordIsValid(oldPassword)) {
      res.status(401).send();
      return;
    }

    user.password = newPassword;

    errors = await validate(user);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }

    user.hashPassword();
    await this.userRepository.save(user);

    res.status(204).send();
  }
}
