import { HttpErrorResponse, HttpRequest } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

import { USER_REGISTRATION_LOGIN_TYPE } from 'ish-core/configurations/injection-keys';
import { SpecialHttpErrorHandler } from 'ish-core/interceptors/icm-error-mapper.interceptor';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { ApiService } from 'ish-core/services/api/api.service';

/* eslint-disable @typescript-eslint/ban-types */

@Injectable()
export class LoginUserErrorHandler implements SpecialHttpErrorHandler {
  constructor(@Inject(USER_REGISTRATION_LOGIN_TYPE) public loginType: string) {}

  test(error: HttpErrorResponse, request: HttpRequest<unknown>): boolean {
    return (
      request.headers.has(ApiService.AUTHORIZATION_HEADER_KEY) &&
      (error.status === 401 || error.status === 403) &&
      error.url.includes('customers/-')
    );
  }
  map(error: HttpErrorResponse): Partial<HttpError> {
    if (error.status === 403) {
      return { code: 'account.login.customer_approval.error.invalid' };
    }
    if (this.loginType === 'email') {
      return { code: 'account.login.email_password.error.invalid' };
    } else {
      return { code: 'account.login.username_password.error.invalid' };
    }
  }
}
