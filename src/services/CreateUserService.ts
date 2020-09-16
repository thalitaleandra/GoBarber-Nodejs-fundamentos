import User from '../models/User'
import { getRepository } from 'typeorm'
import usersRouter from '../routes/users.routes';
import AppError from '../erros/AppError'
import { hash } from 'bcryptjs'


interface Request {
  name: string,
  email: string
  password: string
}


export default class CreateUserService {
  public async execute({ name, email, password }: Request): Promise<User> {
    const userRepository = getRepository(User);
    const checkUserExists = await userRepository.findOne({
      where: { email },
    })
    if (checkUserExists) {
      throw new AppError('Email Adress Already used.')
    }
    const hashedPassword = await hash(password, 8)
    const user = userRepository.create({
      name,
      email,
      password: hashedPassword
    })
    await userRepository.save(user); //salvar no banco
    return user; //retornar usuario criado
  }
}
