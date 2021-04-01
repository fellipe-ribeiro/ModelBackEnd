import path from 'path';
import UserTokensCustomRepository from '../repositories/UserTokensCustomRepository';
import UsersCustomRepository from '../repositories/UsersCustomRepository';

import mailConfig from '../config/mail';

import MailProviderEthereal from '../providers/MailProvider/EtherealMailProvider';
import MailProviderSES from '../providers/MailProvider/SESMailProvider';

import AppError from '../errors/AppError';

export default {
  key: 'RegistrationMail',
  async handle({ data }: any): Promise<void> {
    const { userData } = data;

    const usersCustomRepository = new UsersCustomRepository();
    const userTokensCustomRepository = new UserTokensCustomRepository();

    let mailProvider;

    if (mailConfig.driver === 'ses') {
      mailProvider = new MailProviderSES();
    } else {
      mailProvider = new MailProviderEthereal();
    }

    const user = await usersCustomRepository.getUserByEmail(userData.email);

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
  },
};
