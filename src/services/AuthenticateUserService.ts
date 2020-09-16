import User from '../models/User'
import { getRepository } from 'typeorm'
import { sign } from 'jsonwebtoken'
import { compare } from 'bcryptjs'
import AppError from '../erros/AppError'
//import authConfig from '../config/auth'

interface Request {
  email: string,
  password: string
}
interface Response {
  user: User,
  token: string
}
export default class AuthenticateUserService {
  public async execute({ email, password }: Request): Promise<Response> {
    const usersRepository = getRepository(User);
    const user = await usersRepository.findOne({
      where: { email }
    })
    if (!user) {
      throw new AppError('Incorrect email/password combination.', 401)
    }
    const passwordMatched = await compare(password, user.password)
    if (!passwordMatched) {
      throw new AppError('Incorrect email/password combination.', 401)
    }
    //const { secret, expiresIn } = authConfig.jwt;
    const token = sign({}, 'aa2481f29d92155e8ffdb63a9f8ff9fa', {
      subject: user.id,
      expiresIn: '2d'
    });
    return {
      user,
      token
    }
  }
}
