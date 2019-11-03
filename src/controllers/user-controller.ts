import { validate, ValidationError } from 'class-validator';
import { Request, Response } from 'express';
import { getRepository, Repository } from 'typeorm';

import { User } from '../entity/user';

export class UserController {
  public constructor(protected repository: Repository<User> = getRepository(User)) {}

  public async listAll(req: Request, res: Response): Promise<void> {
    res.send(
      await this.repository.find({
        select: ['id', 'username', 'role']
      })
    );
  }

  public async getOneById(req: Request, res: Response): Promise<void> {
    try {
      res.send(
        await this.repository.findOneOrFail(req.params.id, {
          select: ['id', 'username', 'role']
        })
      );
    } catch (error) {
      res.status(404).send('User not found');
    }
  }

  public async newUser(req: Request, res: Response): Promise<void> {
    const user = new User();
    const { username, password, role } = req.body;
    let errors: ValidationError[];

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
      await this.repository.save(user);
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
      user = await this.repository.findOneOrFail(req.params.id);
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
      await this.repository.save(user);
    } catch (e) {
      res.status(409).send('username already in use');
      return;
    }
    res.status(204).send();
  }

  public async deleteUser(req: Request, res: Response): Promise<void> {
    const id: number = parseInt(req.params.id, 10);

    try {
      await this.repository.findOneOrFail(id);
    } catch (error) {
      res.status(404).send('User not found');
      return;
    }
    await this.repository.delete(id);

    res.status(204).send();
  }
}
