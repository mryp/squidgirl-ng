import { Injectable } from '@angular/core';

@Injectable()
export class LoginService {
  //フィールド
  //--------------------------------------
  token:string = "";

  constructor() { }

  /**
   * ログイントークンを取得する
   */
  createLoginToken(userName:string, password:string): string {
    console.log("userName=" + userName + " password=" + password);
    this.token = userName + ":" + password; //仮実装

    console.log("token=" + this.token);
    return this.token;
  }

  /**
   * ログイン処理で取得済みのトークンを取得する
   */
  getToken(): string {
    return this.token;
  }
}
