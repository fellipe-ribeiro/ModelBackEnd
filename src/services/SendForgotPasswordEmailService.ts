import path from 'path';
import UsersCustomRepository from '../repositories/UsersCustomRepository';
import UserTokensCustomRepository from '../repositories/UserTokensCustomRepository';
// import MailProvider from '../providers/MailProvider/EtherealMailProvider';
import MailProvider from '../providers/MailProvider/SESMailProvider';

import AppError from '../errors/AppError';

interface IRequest {
  email: string;
}

class SendForgotPasswordEmailService {
  public async execute({ email }: IRequest): Promise<void> {
    const usersCustomRepository = new UsersCustomRepository();
    const userTokensCustomRepository = new UserTokensCustomRepository();
    const mailProvider = new MailProvider();

    const user = await usersCustomRepository.getUserByEmail(email);

    if (!user) {
      throw new AppError('User does not exists');
    }

    const { token } = await userTokensCustomRepository.generate(user.id);

    const forgotPasswordTemplate = path.resolve(
      __dirname,
      '..',
      'views',
      'forgot_password.hbs',
    );

    await mailProvider.sendMail({
      to: {
        name: user.name,
        email: user.email,
      },
      subject: '[Model] Recuperação de senha',
      templateData: {
        file: forgotPasswordTemplate,
        variables: {
          name: user.name,
          link: `${process.env.APP_WEB_URL}/reset_password?token=${token}`,
          token,
        },
      },
    });
  }
}

export default SendForgotPasswordEmailService;
