import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from "@angular/http";
import { DomSanitizer } from '@angular/platform-browser';

import { LoginService } from "./login.service"
import { environment } from '../environments/environment';

namespace Const{
  export const API_FILE_LIST = "api/filelist";
  export const API_THUMBNAIL = "api/thumbnailbase64";
}

@Injectable()
export class FileService {
  //フィールド
  //--------------------------------------

  //メソッド
  //--------------------------------------
  constructor(
    private loginService:LoginService,
    private http:Http,
    private sanitizer:DomSanitizer
  ) { }

  private getApiUrl(apiName:string):string {
    return environment.apiBaseUrl + apiName;
  }

  private createPostApiHeader():Headers {
    return new Headers({
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": "Bearer " + this.loginService.getToken()
    });
  }

  private createGetApiHeader():Headers {
    return new Headers({
      "Authorization": "Bearer " + this.loginService.getToken(),
    });
  }

  /**
   * ログイントークンを取得する
   */
  postFileList(hash:string, callback:(response: Response, error: any ) => void) {
    let postData = "hash=" + hash;
    let headers = this.createPostApiHeader();
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

  getThumbnail(hash:string, callback:(imageUrl: any, error: any ) => void): string {
    let url = this.getApiUrl(Const.API_THUMBNAIL) + "/" + hash;
    let headers = this.createGetApiHeader();
    let options = new RequestOptions({headers: headers});
    let httpObservable = this.http.get(url, options);
    httpObservable.subscribe(
      res => {
        let imageUrl = "data:image/jpeg;base64," + res.text();
        //let secureUrl = this.sanitizer.bypassSecurityTrustUrl(imageUrl);
        //console.log(secureUrl);
        callback(imageUrl, null);
      },
      error => {
        console.error(error.status + ":" + error.statusText);
        callback(null, error);
      }
    );

    return "";
  }

}
