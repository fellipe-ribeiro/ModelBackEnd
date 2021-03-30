import mailQueue from '../providers/QueueProvider/Bull';

interface IRequest {
  email: string;
}

class SendForgotPasswordEmailService {
  public async execute({ email }: IRequest): Promise<void> {
    const userData = {
      email,
    };

    await mailQueue.add('RegistrationMail', { userData });
  }
}

export default SendForgotPasswordEmailService;
