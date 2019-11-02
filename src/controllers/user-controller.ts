import { Request, Response } from 'express';
import { getRepository, Repository } from 'typeorm';
import { validate, ValidationError } from "class-validator";

import { User } from '../entity/user';

export class UserController {
  public constructor(protected userRepository: Repository<User> = getRepository(User)) {}

  public async listAll(req: Request, res: Response): Promise<void> {
    res.send(
      await this.userRepository.find({
        select: ['id', 'username', 'role']
      })
    );
  }

  public async getOneById(req: Request, res: Response): Promise<void> {
    try {
      res.send(
        await this.userRepository.findOneOrFail(req.params.id, {
          select: ['id', 'username', 'role']
        })
      );
    } catch (error) {
      res.status(404).send('User not found');
    }
  }

  public async newUser(req: Request, res: Response): Promise<void> {
    let errors: ValidationError[];
    let user = new User();
    let { username, password, role } = req.body;

    user.username = username;
    user.password = password;
    user.role = role;

    errors = await validate(user);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }

    user.hashPassword();

    try {
      await this.userRepository.save(user);
    } catch (e) {
      res.status(409).send('username already in use');
      return;
    }

    res.status(201).send('User created');
  }

  public async editUser(req: Request, res: Response): Promise<void> {
    const { username, role } = req.body;
    let errors: ValidationError[];
    let user: User;

    try {
      user = await this.userRepository.findOneOrFail(req.params.id);
    } catch (error) {
      res.status(404).send('User not found');
      return;
    }

    user.username = username;
    user.role = role;

    errors = await validate(user);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }

    try {
      await this.userRepository.save(user);
    } catch (e) {
      res.status(409).send('username already in use');
      return;
    }
    res.status(204).send();
  }

  public async deleteUser(req: Request, res: Response): Promise<void> {
    const id: number = parseInt(req.params.id, 10);

    try {
      await this.userRepository.findOneOrFail(id);
    } catch (error) {
      res.status(404).send('User not found');
      return;
    }
    await this.userRepository.delete(id);

    res.status(204).send();
  }
}
