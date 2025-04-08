import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';

import { JwtService } from '../../../shared/service/jwt.service';
import { ApiService } from '../../../shared/service/api.service';

import {
  SignInRequest,
  SignInResponse,
  SignUpRequest,
} from '../types/user.type';

import { signInMutation, signUpMutation } from '../graphql/auth.mutation';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private api: ApiService,
    private jwtService: JwtService,
  ) {}

  signIn(variables: SignInRequest) {
    this.api
      .post('http://localhost:4000', {
        query: signInMutation,
        variables,
      })
      .subscribe((res: HttpResponse<any>) => {
        const token = (res.body.data as SignInResponse).token;
        this.jwtService.setToken(token);
        this.jwtService.handleTokenNavigation();
      });
  }

  signUp(variables: SignUpRequest) {
    this.api
      .post('http://localhost:4000', {
        query: signUpMutation,
        variables,
      })
      .subscribe((res: HttpResponse<any>) => {
        console.log(res);
        
        const token = (res.body.data as SignInResponse).token;
        this.jwtService.setToken(token);
        this.jwtService.handleTokenNavigation();
      });
  }
}
