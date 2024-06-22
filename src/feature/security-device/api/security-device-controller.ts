import {
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
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
      /*  throw new NotFoundException(
          'security device not found:andpoint-security/devices,method-get',
        );*/
      return [];
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

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':deviceId')
  async deleteDeviceByDeviceId(
    @Req() request: Request,
    @Param('deviceId') id: string,
  ) {
    const deviceId = request['deviceId'];

    if (id !== deviceId) {
      /*  403 статус код --АЙДИШКА ПРИШЛА В ПАРАМЕТРЕ 
        И НЕ СООТВЕТСТВУЕТ ТОЙ КОТОРУЮ ДОСТАЛ ИЗ 
        РЕФРЕШТОКЕНА*/
      throw new ForbiddenException(
        'id not belong to current device :andpoint-security/devices/deviceId,method-delete',
      );
    }

    /*const issuedAtRefreshToken = request['issuedAtRefreshToken'];*/

    const result =
      await this.securityDeviceService.deleteDeviceByDeviceId(deviceId);

    if (result) {
      return;
    } else {
      throw new NotFoundException(
        'security device not found:andpoint-security/devices/deviceId,method-delete',
      );
    }
  }
}
