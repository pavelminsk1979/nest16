import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Req,
  UseGuards,
} from '@nestjs/common';
import { RefreshTokenGuard } from '../../../common/guard/refresh-token-guard';
import { Request } from 'express';
import { SecurityDeviceService } from '../services/security-device-service';

@UseGuards(RefreshTokenGuard)
@Controller('security/devices')
export class SecurityDeviceController {
  constructor(protected securityDeviceService: SecurityDeviceService) {}

  @Get()
  async getAllDevicesCorrectUser(@Req() request: Request) {
    const deviceId = request['deviceId'];

    const issuedAtRefreshToken = request['issuedAtRefreshToken'];

    const result = await this.securityDeviceService.getAllDevicesCorrectUser(
      deviceId,
      issuedAtRefreshToken,
    );

    if (result) {
      return result;
    } else {
      throw new NotFoundException(
        'security device not found:andpoint-security/devices,method-get',
      );
    }
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete()
  async deleteDevicesExeptCurrentDevice(@Req() request: Request) {
    const deviceId = request['deviceId'];

    const issuedAtRefreshToken = request['issuedAtRefreshToken'];

    await this.securityDeviceService.deleteDevicesExeptCurrentDevice(
      deviceId,
      issuedAtRefreshToken,
    );

    return;
  }
}
