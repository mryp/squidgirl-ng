import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from "@angular/http";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { LoginService } from "./login.service"
import { environment } from '../environments/environment';

namespace Const{
  export const API_FILE_LIST = "api/filelist";
  export const API_PARENT_LIST = "api/parentlist";
  export const API_THUMBNAIL = "api/thumbnail";
  export const API_PAGE = "api/page";
  export const API_SAVE_BOOK = "api/savebook";
}

export interface FileListResponse {
  name: string;
  allcount: number;
  count: number;
  files: FileListFileResponse[];
}

export interface FileListFileResponse {
  hash: string;
  name: string;
  size: number;
  page: number;
  isdir: boolean;
  modtime: string;
  readtime: string;
  index: number;
  reaction: number;
  image: string;
}

export interface ParentListResponse {
  count: number;
  folders: ParentListFolderResponse[];
}

export interface ParentListFolderResponse {
  hash: string;
  name: string;
}

@Injectable()
export class FileService {
  //フィールド
  //--------------------------------------
  private folderHash = "";
  private folderOffset = 0;

  //プロパティ
  //--------------------------------------
  public getFolderHash():string {
    return this.folderHash;
  }

  public getFolderOffset():number {
    return this.folderOffset;
  }

  //メソッド
  //--------------------------------------
  constructor(
    private loginService:LoginService,
    private http:Http
  ) { }

  /**
   * ファイル一覧を取得する
   */
  public postFileList(hash:string, offset:number, limit:number): Observable<FileListResponse> {
    if (hash == "root") {
      hash = "";
    }
    this.folderHash = hash;
    this.folderOffset = offset;

    let postData = "hash=" + hash + "&offset=" + offset + "&limit=" + limit;
    let headers = this.loginService.createPostApiHeader();
    let options = new RequestOptions({headers: headers});
    return this.http.post(this.loginService.getApiUrl(Const.API_FILE_LIST), postData, options).map(
      res => {
        return res.json() as FileListResponse;
      }
    );
  }


  public postParentList(hash:string): Observable<ParentListResponse> {
    if (hash == "root") {
      hash = "";
    }
    let postData = "hash=" + hash;
    let headers = this.loginService.createPostApiHeader();
    let options = new RequestOptions({headers: headers});
    return this.http.post(this.loginService.getApiUrl(Const.API_PARENT_LIST), postData, options).map(
      res => {
        return res.json() as ParentListResponse;
      }
    );
  }


  /**
   * 指定したファイルのサムネイル画像を取得する
   */
  public getThumbnail(hash:string): Observable<string> {
    let url = this.loginService.getApiUrl(Const.API_THUMBNAIL) + "/" + hash + "?base64=true";
    let headers = this.loginService.createGetApiHeader();
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

  /**
   * 指定したファイル内のページ画像を取得する
   */
  public getPageImage(hash:string, index:number, maxHeight:number, maxWidth:number): Observable<string> {
    let url = this.loginService.getApiUrl(Const.API_PAGE) + "/" + hash
      + "?index="+index+"&maxheight="+maxHeight+"&maxwidth="+maxWidth+"&base64=true";
    let headers = this.loginService.createGetApiHeader();
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

  /**
   * 現在のページ情報を保存する
   */
  public postSaveBook(hash:string, index:number, reaction:number): Observable<Response> {
    let postData = "hash=" + hash + "&index=" + index + "&reaction=" + reaction;
    let headers = this.loginService.createPostApiHeader();
    let options = new RequestOptions({headers: headers});
    return this.http.post(this.loginService.getApiUrl(Const.API_SAVE_BOOK), postData, options).map(
      res => {
        return res;
      }
    );
  }
}
