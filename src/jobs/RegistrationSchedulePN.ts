import schedule from 'node-schedule';
import {
  isAfter,
  isSameDay,
  isBefore,
  differenceInCalendarDays,
} from 'date-fns';

import OrdersCustomRepository from '../repositories/OrdersCustomRepository';
import UsersCustomRepository from '../repositories/UsersCustomRepository';
import NotificationsRepository from '../repositories/NotificationsRepository';
import DevicesTokensRepository from '../repositories/DevicesTokensRepository';

import admin from '../providers/PushNotificationProvider/Firebase';

export default {
  key: 'RegistrationSchedulePN',
  async handle(): Promise<void> {
    const ruleDelayedDeparture = new schedule.RecurrenceRule();
    ruleDelayedDeparture.hour = 9;
    ruleDelayedDeparture.minute = 0;
    ruleDelayedDeparture.tz = 'America/Sao_Paulo';

    const ruleCheckOutToday = new schedule.RecurrenceRule();
    ruleCheckOutToday.hour = 9;
    ruleCheckOutToday.minute = 30;
    ruleCheckOutToday.tz = 'America/Sao_Paulo';

    const ruleCheckOutTomorrow = new schedule.RecurrenceRule();
    ruleCheckOutTomorrow.hour = 10;
    ruleCheckOutTomorrow.minute = 0;
    ruleCheckOutTomorrow.tz = 'America/Sao_Paulo';

    const ruleDelayedDepartureSector = new schedule.RecurrenceRule();
    ruleDelayedDepartureSector.hour = 10;
    ruleDelayedDepartureSector.minute = 30;
    ruleDelayedDepartureSector.tz = 'America/Sao_Paulo';

    const ruleCheckOutTodaySector = new schedule.RecurrenceRule();
    ruleCheckOutTodaySector.hour = 11;
    ruleCheckOutTodaySector.minute = 0;
    ruleCheckOutTodaySector.tz = 'America/Sao_Paulo';

    const ruleCheckOutTomorrowSector = new schedule.RecurrenceRule();
    ruleCheckOutTomorrowSector.hour = 11;
    ruleCheckOutTomorrowSector.minute = 30;
    ruleCheckOutTomorrowSector.tz = 'America/Sao_Paulo';

    const ordersCustomRepository = new OrdersCustomRepository();
    const usersCustomRepository = new UsersCustomRepository();
    const notificationsRepository = new NotificationsRepository();
    const deviceTokensRepository = new DevicesTokensRepository();

    schedule.scheduleJob(ruleDelayedDeparture, async () => {
      console.log('Schedule Saída atrasada!!!!!');

      const orders = await ordersCustomRepository.getAllOrders();
      orders.forEach(async order => {
        const difference = differenceInCalendarDays(
          new Date(Date.now()),
          order.departureDate,
        );
        if (isAfter(Date.now(), order.departureDate) && difference >= 1) {
          const users = await usersCustomRepository.getAllUsers();
          users.map(async user => {
            await notificationsRepository.create({
              recipient_id: user.id,
              content: `O pedido ${order.modelName} do cliente: ${order.client} está com a saída atrasada`,
            });
          });
          const devicesTokens = await deviceTokensRepository.getAllTokens();

          const message: admin.messaging.MulticastMessage = {
            notification: {
              title: 'Pedido atrasado:',
              body: `O pedido ${order.modelName} do cliente: ${order.client} está com a saída atrasada`,
            },
            tokens: devicesTokens,
          };

          console.log(message);

          const result = await admin.messaging().sendMulticast(message);

          console.log(result.responses);
        }
      });
    });

    schedule.scheduleJob(ruleCheckOutToday, async () => {
      console.log('Schedule Saída hoje!!!!!');

      const orders = await ordersCustomRepository.getAllOrders();
      orders.forEach(async order => {
        if (isSameDay(Date.now(), order.departureDate)) {
          const users = await usersCustomRepository.getAllUsers();
          users.map(async user => {
            await notificationsRepository.create({
              recipient_id: user.id,
              content: `A data de sáida do pedido ${order.modelName} do cliente: ${order.client} é hoje`,
            });
          });
          const devicesTokens = await deviceTokensRepository.getAllTokens();

          const message: admin.messaging.MulticastMessage = {
            notification: {
              title: 'Pedido com saída para hoje:',
              body: `A data de sáida do pedido ${order.modelName} do cliente: ${order.client} é hoje`,
            },
            tokens: devicesTokens,
          };

          console.log(message);

          const result = await admin.messaging().sendMulticast(message);

          console.log(result.responses);
        }
      });
    });

    schedule.scheduleJob(ruleCheckOutTomorrow, async () => {
      console.log('Schedule Saída amanhã!!!!!');

      const orders = await ordersCustomRepository.getAllOrders();
      orders.forEach(async order => {
        const difference = differenceInCalendarDays(
          new Date(Date.now()),
          order.departureDate,
        );

        if (isBefore(Date.now(), order.departureDate) && difference === -1) {
          const users = await usersCustomRepository.getAllUsers();
          users.map(async user => {
            await notificationsRepository.create({
              recipient_id: user.id,
              content: `Lembrete: a data de sáida do pedido ${order.modelName} do cliente: ${order.client} é amanhã`,
            });
          });
          const devicesTokens = await deviceTokensRepository.getAllTokens();

          const message: admin.messaging.MulticastMessage = {
            notification: {
              title: 'Lembrete: pedido com saída para amanhã:',
              body: `A data de sáida do pedido ${order.modelName} do cliente: ${order.client} é amanhã`,
            },
            tokens: devicesTokens,
          };

          console.log(message);

          const result = await admin.messaging().sendMulticast(message);

          console.log(result.responses);
        }
      });
    });

    schedule.scheduleJob(ruleDelayedDepartureSector, async () => {
      console.log('Schedule Saída setor atrasada!!!!!');

      const orders = await ordersCustomRepository.getAllOrders();
      let dateSectorCompare: Date;

      orders.forEach(async order => {
        switch (order.sector) {
          case 'Modelagem':
            dateSectorCompare = order.modelingTime;
            break;
          case 'Corte':
            dateSectorCompare = order.cuttingTime;
            break;
          case 'Preparação':
            dateSectorCompare = order.setupTime;
            break;
          case 'Costura':
            dateSectorCompare = order.sewingTime;
            break;
          case 'Acabamento':
            dateSectorCompare = order.finishingTime;
            break;
          case 'Pronto':
            dateSectorCompare = order.readyDate;
            break;
          default:
            break;
        }
        const difference = differenceInCalendarDays(
          Date.now(),
          order.departureDate,
        );
        if (isAfter(Date.now(), dateSectorCompare) && difference >= 1) {
          const users = await usersCustomRepository.getAllUsers();
          users.map(async user => {
            await notificationsRepository.create({
              recipient_id: user.id,
              content: `O pedido ${order.modelName} do cliente: ${order.client} passou  da data limite do setor de: ${order.sector}`,
            });
          });
          const devicesTokens = await deviceTokensRepository.getAllTokens();

          const message: admin.messaging.MulticastMessage = {
            notification: {
              title: 'Data de sáida do setor foi ultrapassada:',
              body: `O pedido ${order.modelName} do cliente: ${order.client} passou  da data limite do setor de: ${order.sector}`,
            },
            tokens: devicesTokens,
          };

          console.log(message);

          const result = await admin.messaging().sendMulticast(message);

          console.log(result.responses);
        }
      });
    });

    schedule.scheduleJob(ruleCheckOutTodaySector, async () => {
      console.log('Schedule Saída setor hoje!!!!!');

      const orders = await ordersCustomRepository.getAllOrders();
      let dateSectorCompare: Date;

      orders.forEach(async order => {
        switch (order.sector) {
          case 'Modelagem':
            dateSectorCompare = order.modelingTime;
            break;
          case 'Corte':
            dateSectorCompare = order.cuttingTime;
            break;
          case 'Preparação':
            dateSectorCompare = order.setupTime;
            break;
          case 'Costura':
            dateSectorCompare = order.sewingTime;
            break;
          case 'Acabamento':
            dateSectorCompare = order.finishingTime;
            break;
          case 'Pronto':
            dateSectorCompare = order.readyDate;
            break;
          default:
            break;
        }
        if (isSameDay(Date.now(), dateSectorCompare)) {
          const users = await usersCustomRepository.getAllUsers();
          users.map(async user => {
            await notificationsRepository.create({
              recipient_id: user.id,
              content: `A data limite do pedido ${order.modelName} do cliente: ${order.client} do setor: ${order.sector} é hoje`,
            });
          });
          const devicesTokens = await deviceTokensRepository.getAllTokens();

          const message: admin.messaging.MulticastMessage = {
            notification: {
              title: 'Data limite de saída do setor foi atingida:',
              body: `A data limite do pedido ${order.modelName} do cliente: ${order.client} do setor: ${order.sector} é hoje`,
            },
            tokens: devicesTokens,
          };

          console.log(message);

          const result = await admin.messaging().sendMulticast(message);

          console.log(result.responses);
        }
      });
    });

    schedule.scheduleJob(ruleCheckOutTomorrowSector, async () => {
      console.log('Schedule Saída setor amanhã!!!!!');

      const orders = await ordersCustomRepository.getAllOrders();
      let dateSectorCompare: Date;

      orders.forEach(async order => {
        switch (order.sector) {
          case 'Modelagem':
            dateSectorCompare = order.modelingTime;
            break;
          case 'Corte':
            dateSectorCompare = order.cuttingTime;
            break;
          case 'Preparação':
            dateSectorCompare = order.setupTime;
            break;
          case 'Costura':
            dateSectorCompare = order.sewingTime;
            break;
          case 'Acabamento':
            dateSectorCompare = order.finishingTime;
            break;
          case 'Pronto':
            dateSectorCompare = order.readyDate;
            break;
          default:
            break;
        }
        const difference = differenceInCalendarDays(
          Date.now(),
          dateSectorCompare,
        );
        if (isBefore(Date.now(), dateSectorCompare) && difference === -1) {
          const users = await usersCustomRepository.getAllUsers();
          users.map(async user => {
            await notificationsRepository.create({
              recipient_id: user.id,
              content: `Lembrete: a data limite do pedido ${order.modelName} do cliente: ${order.client} do setor: ${order.sector} é amanhã`,
            });
          });
          const devicesTokens = await deviceTokensRepository.getAllTokens();

          const message: admin.messaging.MulticastMessage = {
            notification: {
              title: 'Lembrete: data limite de saída do setor é amanhã:',
              body: `Lembrete: a data limite do pedido ${order.modelName} do cliente: ${order.client} do setor: ${order.sector} é amanhã`,
            },
            tokens: devicesTokens,
          };

          console.log(message);

          const result = await admin.messaging().sendMulticast(message);

          console.log(result.responses);
        }
      });
    });
  },
};
