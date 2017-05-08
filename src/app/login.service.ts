import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from "@angular/http";

import { environment } from '../environments/environment';

namespace Const{
  export const API_LOGIN = "login";
  export const LS_KEY_TOKEN = "LoginService.token";
}

@Injectable()
export class LoginService {
  //フィールド
  //--------------------------------------
  token:string = "";

  constructor(
    private http:Http
  ) { }

  private getApiUrl(apiName:string):string {
    return environment.apiBaseUrl + apiName;
  }

  /**
   * ログイントークンを取得する
   */
  sendLogin(userName:string, password:string, callback:(token: string, error: any ) => void) {
    let postData = "username=" + userName + "&password=" + password;
    let headers = new Headers({ "Content-Type": "application/x-www-form-urlencoded" });
    let options = new RequestOptions({headers: headers});
    let httpPostObservable = this.http.post(
      this.getApiUrl(Const.API_LOGIN), postData, options);
    httpPostObservable.subscribe(
      res => {
        console.log(res.text());
        let login = res.json();
        this.setToken(login.token);
        callback(login.token, null);
      },
      error => {
        console.error(error.status + ":" + error.statusText);
        callback("", error);
      }
    );
  }

  /**
   * ログイン処理で取得済みのトークンを取得する
   */
  getToken(): string {
    if (this.token == "") {
      if (localStorage.getItem(Const.LS_KEY_TOKEN)) {
        this.token = localStorage.getItem(Const.LS_KEY_TOKEN);
      }
      else {
        this.token = "";
      }
    }
    return this.token;
  }

  /**
   * ストレージに保存する
   */
  setToken(token:string) {
    this.token = token;
    localStorage.setItem(Const.LS_KEY_TOKEN, this.token);
  }
}
