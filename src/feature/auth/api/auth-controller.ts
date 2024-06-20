import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginInputModel } from './pipes/login-input-model';
import { AuthService } from '../services/auth-service';
import { RegistrationInputModel } from './pipes/registration-input-model';
import { RegistrationConfirmationInputModel } from './pipes/registration-comfirmation-input-model';
import { RegistrationEmailResendingInputModel } from './pipes/registration-email-resending-input-model';
import { PasswordRecoveryInputModel } from './pipes/password-recovery-input-model';
import { NewPasswordInputModel } from './pipes/new-password-input-model';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(protected authService: AuthService) {}

  /*тут ЛОГИНИЗАЦИЯ  реализована с МУЛЬТИДЕВАЙСНОСТЬЮ*/
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async handleLogin(
    @Body() loginInputModel: LoginInputModel,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ accessToken: string } | null> {
    const result: { accessToken: string; refreshToken: string } | null =
      await this.authService.loginUser(loginInputModel);

    if (result) {
      /* { httpOnly: true, secure: true } - это опции для cookie:
         httpOnly: true означает, что cookie будет доступно только для
          HTTP-запросов, а не для JavaScript-скриптов на клиенте.
         secure: true означает, что cookie будет передаваться только по
          защищенному (HTTPS) соединению.*/
      response.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: true,
      });
      return { accessToken: result.accessToken };
    } else {
      /* (401 Unauthorized). Это означает, что клиент не авторизован для доступа к запрашиваемому ресурсу*/
      throw new UnauthorizedException(
        "user didn't login:andpoint-post,url-auth/login",
      );
    }
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('registration')
  async handleRegistration(
    @Body() registrationInputModel: RegistrationInputModel,
  ) {
    const result: { field: string; res: string } =
      await this.authService.registrationUser(registrationInputModel);
    debugger;
    if (result.res === 'false') {
      throw new BadRequestException([
        {
          message: `field ${result.field} must be unique`,
          field: `${result.field}`,
        },
      ]);
    } else {
      return;
    }
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('registration-confirmation')
  async handleRegistrationConfirmation(
    @Body()
    registrationConfirmationInputModel: RegistrationConfirmationInputModel,
  ) {
    const result: boolean = await this.authService.registrationConfirmation(
      registrationConfirmationInputModel,
    );

    if (result) {
      return;
    } else {
      throw new BadRequestException([
        { message: 'code already confirmed', field: 'code' },
      ]);
      /*    throw new NotFoundException(
        'confirmation failed :andpoint-auth,url-auth/registration-confirmation',
      );*/
    }
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('registration-email-resending')
  async handleRegistrationEmailResending(
    @Body()
    registrationEmailResendingInputModel: RegistrationEmailResendingInputModel,
  ) {
    debugger;
    const { email } = registrationEmailResendingInputModel;

    const result: boolean =
      await this.authService.registrationEmailResending(email);

    if (result) {
      return;
    } else {
      throw new BadRequestException([
        { message: 'email already confirmed', field: 'email' },
      ]);
      /*     throw new NotFoundException(
             'email resending failed :andpoint-auth,url-auth/registration-email-resending',
           );*/
    }
  }

  /*1003 конспект- дошанка*/
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('password-recovery')
  async handlePasswordRecovery(
    @Body()
    passwordRecoveryInputModel: PasswordRecoveryInputModel,
  ) {
    const { email } = passwordRecoveryInputModel;

    const result: boolean = await this.authService.passwordRecovery(email);

    if (result) {
      return;
    } else {
      throw new NotFoundException(
        'password recovery failed :andpoint-auth,url-auth/password-recovery',
      );
    }
  }

  /*новый пароль... и в базу данных помещаю
ХЭШНОВОГОПАРОЛЯ(passwordHash).  В теле запроса приходит КОД и новый пароль*/
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('new-password')
  async handleNewPassword(
    @Body()
    newPasswordInputModel: NewPasswordInputModel,
  ) {
    debugger;
    const result: boolean = await this.authService.newPassword(
      newPasswordInputModel,
    );

    if (result) {
      return;
    } else {
      throw new NotFoundException(
        'new-password failed :andpoint-auth,url-auth/new-password',
      );
    }
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh-token')
  async handleRefreshToken(@Req() req) {
    debugger;
    const refreshToken = req.cookies.refreshToken;

    return { token: refreshToken };
  }
}

//.set('Cookie', `refreshToken=${refreshTokenFIRST}`)
/*
response.cookie('refreshToken', result.refreshToken, {
  httpOnly: true,
  secure: true,
});*/
