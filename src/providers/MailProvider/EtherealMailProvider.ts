import nodemailer from 'nodemailer';

import HandlebarsMailTemplateProvider, {
  IParseMailTemplateDTO,
} from '../MailTemplateProvider/HandlebarsMailTemplateProvider';

interface IMailContact {
  name: string;
  email: string;
}

interface ISendMailDTO {
  to: IMailContact;
  from?: IMailContact;
  subject: string;
  templateData: IParseMailTemplateDTO;
}

export default class EtherealMailProvider {
  public async sendMail({
    to,
    from,
    subject,
    templateData,
  }: ISendMailDTO): Promise<void> {
    nodemailer.createTestAccount().then(async account => {
      const handlebarsMailTemplateProvider = new HandlebarsMailTemplateProvider();

      const transporter = nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
          user: account.user,
          pass: account.pass,
        },
      });

      const message = await transporter.sendMail({
        from: {
          name: from?.name || 'Model',
          address: from?.email || 'model@model.com.br',
        },
        to: {
          name: to.name,
          address: to.email,
        },
        subject,
        html: await handlebarsMailTemplateProvider.parse(templateData),
      });

      console.log('Message sent: %s', message.messageId);
      // Preview only available when sending through an Ethereal account
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(message));
    });
  }
}
