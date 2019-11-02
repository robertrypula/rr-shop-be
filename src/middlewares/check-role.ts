import { NextFunction, Request, Response } from 'express';
import { getRepository, Repository } from 'typeorm';

import { User } from '../entity/User';

export const checkRole = (roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userRepository: Repository<User> = getRepository(User);
    let user: User;

    try {
      user = await userRepository.findOneOrFail(res.locals.jwtPayload.userId);
    } catch (id) {
      res.status(401).send();
    }

    if (roles.indexOf(user.role) > -1) {
      next();
    } else {
      res.status(401).send();
    }
  };
};
