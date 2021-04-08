import { Request, Response } from 'express';

import { classToClass } from 'class-transformer';

import CreateUserService from '../services/CreateUserService';
import ListUserByIDService from '../services/ListUserByIDService';

export default class UsersController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { name, email, password } = request.body;

    const createUser = new CreateUserService();

    const user = await createUser.execute({
      name,
      email,
      password,
    });

    return response.json(classToClass(user));
  }

  public async getUserByID(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { id } = request.query;

    const getUserByID = new ListUserByIDService();

    const user = await getUserByID.execute(id as string);

    return response.json(classToClass(user));
  }
}
