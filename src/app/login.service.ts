import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from "@angular/http";
import { Observable } from 'rxjs/Observable';

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
   * ユーザー情報をポストしてログインする
   */
  postLogin(userName:string, password:string): Observable<Response> {
    let postData = "username=" + userName + "&password=" + password;
    let headers = new Headers({ "Content-Type": "application/x-www-form-urlencoded" });
    let options = new RequestOptions({headers: headers});
    return this.http.post(this.getApiUrl(Const.API_LOGIN), postData, options).map(
      res => {
        let login = res.json();
        this.setToken(login.token);
        return res;
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
