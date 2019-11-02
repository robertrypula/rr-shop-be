import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { getRepository } from 'typeorm';
import { validate } from 'class-validator';

import { User } from '../entity/user';
import config from '../config/config';

export class AuthController {
  static login = async (req: Request, res: Response) => {
    // check if username and password are set
    let { username, password } = req.body;

    if (!(username && password)) {
      res.status(400).send();
    }

    // get user from database
    const userRepository = getRepository(User);
    let user: User;
    try {
      user = await userRepository.findOneOrFail({ where: { username } });
    } catch (error) {
      res.status(401).send();
    }

    // check if encrypted password match
    if (!user.checkIfUnencryptedPasswordIsValid(password)) {
      res.status(401).send();
      return;
    }

    // sing JWT, valid for 1 hour
    const token = jwt.sign({ userId: user.id, username: user.username }, config.jwtSecret, { expiresIn: '1h' });

    // send the jwt in the response
    res.send(token);
  };

  static changePassword = async (req: Request, res: Response) => {
    // get ID from JWT
    const id = res.locals.jwtPayload.userId;

    // get parameters from the body
    const { oldPassword, newPassword } = req.body;
    if (!(oldPassword && newPassword)) {
      res.status(400).send();
    }

    // get user from the database
    const userRepository = getRepository(User);
    let user: User;
    try {
      user = await userRepository.findOneOrFail(id);
    } catch (id) {
      res.status(401).send();
    }

    // check if old password match
    if (!user.checkIfUnencryptedPasswordIsValid(oldPassword)) {
      res.status(401).send();
      return;
    }

    // validate de model (password length)
    user.password = newPassword;
    const errors = await validate(user);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }
    // hash the new password and save
    user.hashPassword();
    await userRepository.save(user);

    res.status(204).send();
  };
}
