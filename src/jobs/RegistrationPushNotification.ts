import DevicesTokensRepository from '../repositories/DevicesTokensRepository';
import admin from '../providers/PushNotificationProvider/Firebase';

export default {
  key: 'RegistrationPushNotification',
  async handle({ data }: any): Promise<void> {
    const { orderData } = data;

    const deviceTokensRepository = new DevicesTokensRepository();

    const devicesTokens = await deviceTokensRepository.getAllTokensExceptUserAuth(
      orderData.user_id,
    );

    if (devicesTokens.length >= 1) {
      const message: admin.messaging.MulticastMessage = {
        notification: {
          title: 'Um novo pedido foi criado:',
          body: `Cliente: ${orderData.client}\nNome: ${orderData.modelName}\nData de sáida: ${orderData.departureDateFormatedLocally}`,
        },
        tokens: devicesTokens,
      };

      console.log(message);

      const result = await admin.messaging().sendMulticast(message);

      console.log(result.responses);
    }
  },
};
