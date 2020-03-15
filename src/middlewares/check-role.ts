import { NextFunction, Request, Response } from 'express';
import { getRepository, Repository } from 'typeorm';

import { User } from '../entity/user';

export const checkRole = (roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userRepository: Repository<User> = getRepository(User);
    let user: User;

    try {
      user = await userRepository.findOneOrFail(res.locals.jwtPayload.userId);
    } catch (id) {
      res.status(401).send({ errorMessage: 'Could not find user in order to check the role' });
    }

    if (roles.indexOf(user.role) > -1) {
      next();
    } else {
      res.status(401).send({ errorMessage: 'Wrong user role' });
    }
  };
};
