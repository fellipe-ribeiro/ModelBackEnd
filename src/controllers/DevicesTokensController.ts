import { Request, Response } from 'express';

import RegisterDeviceTokenService from '../services/RegisterDeviceTokenService';

export default class DevicesTokensController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { user_id, device_token } = request.body;

    const registerDeviceToken = new RegisterDeviceTokenService();

    await registerDeviceToken.execute({ user_id, device_token });

    return response.json({ user_id, device_token });
  }
}
