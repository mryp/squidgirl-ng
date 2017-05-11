import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from "@angular/http";
import { DomSanitizer } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

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
   * ファイル一覧を取得する
   */
  postFileList(hash:string): Observable<Response> {
    let postData = "hash=" + hash;
    let headers = this.createPostApiHeader();
    let options = new RequestOptions({headers: headers});
    return this.http.post(this.getApiUrl(Const.API_FILE_LIST), postData, options).map(
      res => {
        return res;
      }
    );
  }

  /**
   * 指定したファイルのサムネイル画像を取得する
   */
  getThumbnail(hash:string): Observable<string> {
    let url = this.getApiUrl(Const.API_THUMBNAIL) + "/" + hash;
    let headers = this.createGetApiHeader();
    let options = new RequestOptions({headers: headers});
    return this.http.get(url, options).map(
      res => {
        if (res.text() == "") {
          return "";
        }

        let imageUrl = "data:image/jpeg;base64," + res.text();
        return imageUrl;
      },
    );
  }

}
