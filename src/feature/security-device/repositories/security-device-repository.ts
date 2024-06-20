import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  SecurityDevice,
  SecurityDeviceDocument,
} from '../domains/domain-security-device';

@Injectable()
/*@Injectable()-декоратор что данный клас инжектируемый
 * ОБЯЗАТЕЛЬНО ДОБАВЛЯТЬ его В ФАЙЛ app.module
 * providers: []*/
export class SecurityDeviceRepository {
  constructor(
    @InjectModel(SecurityDevice.name)
    private securityDeviceModel: Model<SecurityDeviceDocument>,
  ) {}

  async save(newSecurityDevice: SecurityDeviceDocument) {
    return newSecurityDevice.save();
  }
}
