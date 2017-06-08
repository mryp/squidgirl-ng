import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from "@angular/http";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { LoginService } from "./login.service"
import { environment } from '../environments/environment';

namespace Const{
  export const API_USER_LIST = "api/userlist";
  export const API_CREATE_USER = "api/createuser";
  export const API_DELETE_USER = "api/deleteuser";
}

export interface UserListResponse {
  count: number;
  users: UserListUserResponse[];
}

export interface UserListUserResponse {
  username: string;
  authlevel: number;
}

@Injectable()
export class UserService {
  //メソッド
  //--------------------------------------
  constructor(
    private loginService:LoginService,
    private http:Http
  ) { }

  public getUserList(): Observable<UserListResponse> {
    let url = this.loginService.getApiUrl(Const.API_USER_LIST);
    let headers = this.loginService.createGetApiHeader();
    let options = new RequestOptions({headers: headers});
    return this.http.get(url, options).map(
      res => {
        return res.json() as UserListResponse;
      }
    );
  }

  public postCreateUser(userName:string, password:string, isAdmin:boolean) {
    let authlevel = 1;
    if (isAdmin) {
      authlevel = 100;
    }
    let postData = "username=" + userName + "&password=" + password + "&authlevel=" + authlevel;
    let headers = this.loginService.createPostApiHeader();
    let options = new RequestOptions({headers: headers});
    return this.http.post(this.loginService.getApiUrl(Const.API_CREATE_USER), postData, options).map(
      res => {
        return res;
      }
    );
  }
}
