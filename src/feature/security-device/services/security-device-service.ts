import { Injectable } from '@nestjs/common';
import { SecurityDeviceRepository } from '../repositories/security-device-repository';
import { SecurityDeviceQueryRepository } from '../repositories/security-device-query-repository';

@Injectable()
export class SecurityDeviceService {
  constructor(
    protected securityDeviceRepository: SecurityDeviceRepository,
    protected securityDeviceQueryRepository: SecurityDeviceQueryRepository,
  ) {}

  async getAllDevicesCorrectUser(
    deviceId: string,
    issuedAtRefreshToken: string,
  ) {
    const oneDevice = await this.securityDeviceRepository.findDeviceByIdAndDate(
      deviceId,
      issuedAtRefreshToken,
    );

    if (!oneDevice) return null;

    const userId = oneDevice.userId;

    return this.securityDeviceQueryRepository.getAllDevicesCorrectUser(userId);
  }

  async deleteDevicesExeptCurrentDevice(
    deviceId: string,
    issuedAtRefreshToken: string,
  ) {
    const oneDevice = await this.securityDeviceRepository.findDeviceByIdAndDate(
      deviceId,
      issuedAtRefreshToken,
    );

    if (!oneDevice) return null;

    const userId = oneDevice.userId;

    await this.securityDeviceRepository.deleteDevicesExeptCurrentDevice(
      userId,
      deviceId,
    );

    return true;
  }
}
