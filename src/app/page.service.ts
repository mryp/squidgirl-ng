import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { FileService } from "./file.service"
import { environment } from '../environments/environment';

@Injectable()
export class PageService {
  //フィールド
  //--------------------------------------
  hash = ""
  index = 0;
  maxCount = 0;
  maxHeight = 0;
  maxWidth = 0

  //メソッド
  //--------------------------------------
  constructor(
    private fileService:FileService
  ) { }

  setBook(hash: string, maxCount: number) {
    this.hash = hash;
    this.maxCount = maxCount;
  }

  setImageSize(height:number, width:number) {
    this.maxHeight = height;
    this.maxWidth = width;
  }

  loadPage() {
    this.index = 0;
  }

  setNextPage(): boolean {
    if (this.index >= (this.maxCount-1)) {
      return false;
    }

    this.index++;
    return true;
  }

  setPrevPage(): boolean {
    if (this.index == 0) {
      return false;
    }

    this.index--;
    return true;
  }

  getPage(): Observable<string> {
    return this.fileService.getPageImage(this.hash, this.index, this.maxHeight, this.maxWidth);
  }
}
