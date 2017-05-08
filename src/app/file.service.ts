import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from "@angular/http";

import { LoginService } from "./login.service"
import { environment } from '../environments/environment';

namespace Const{
  export const API_FILE_LIST = "api/filelist";
  export const API_THUMBNAIL = "api/thumbnail";
}

@Injectable()
export class FileService {
  //フィールド
  //--------------------------------------

  //メソッド
  //--------------------------------------
  constructor(
    private loginService:LoginService,
    private http:Http
  ) { }

  private getApiUrl(apiName:string):string {
    return environment.apiBaseUrl + apiName;
  }

  private getApiHeader():Headers {
    return new Headers({
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": "Bearer " + this.loginService.getToken()
    });
  }

  /**
   * ログイントークンを取得する
   */
  sendFileList(hash:string, callback:(response: Response, error: any ) => void) {
    let postData = "hash=" + hash;
    let headers = this.getApiHeader();
    let options = new RequestOptions({headers: headers});
    let httpPostObservable = this.http.post(
      this.getApiUrl(Const.API_FILE_LIST), postData, options);
    httpPostObservable.subscribe(
      res => {
        console.log(res.text());
        callback(res, null);
      },
      error => {
        console.error(error.status + ":" + error.statusText);
        callback(null, error);
      }
    );
  }
}
