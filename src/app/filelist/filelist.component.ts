import { Component, OnInit, HostListener, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Response } from "@angular/http";

import { FileService, FileListResponse, FileListFileResponse } from "../file.service"
import { PageService } from "../page.service"
import { EnvOption } from "../envoption";

@Component({
  selector: 'app-filelist',
  templateUrl: './filelist.component.html',
  styleUrls: ['./filelist.component.css']
})
export class FilelistComponent implements OnInit {
  title = "";
  listColumn = 2;         //列数（画面サイズ・画像サイズから計算する）
  listItemWidthMin = 160; //画像の横幅
  listItemCountMax = 12;  //1ページに表示する最大個数

  itemList = [];
  upFolderItem: FileListFileResponse = null;

  responseAllCount = 0;
  responseFileCount = 0;
  nowPageCount = 0;
  totalPageCount = 0;

  constructor(
    private fileService:FileService,
    private pageService:PageService,
    private router: Router
  ) { }

  ngOnInit() {
    this.setListColumn(window.innerWidth);
    this.showFolderList(this.fileService.getFolderHash(), this.fileService.getFolderOffset());
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.setListColumn(event.target.innerWidth);
  }

  setListColumn(width:number) {
    let contentWidth:number = width;
    if (window.innerWidth >= EnvOption.WINDOW_WIDTH_TABLET) {
      //メニューを常に表示しているのでメニューの横幅を省く
      contentWidth -= EnvOption.MENU_WIDTH;
    }
    this.listColumn = contentWidth / this.listItemWidthMin;
  }

  showFolderList(hash:string, offset:number) {
    this.itemList = [];
    this.fileService.postFileList(hash, offset, this.listItemCountMax).subscribe(
      res => {
        this.setSuccessPost(res);
      },
      error => {
        this.setErrorPost(error);
      }
    );
  }

  setSuccessPost(res:FileListResponse) {
    this.title = res.name;
    this.responseAllCount = res.allcount;
    this.responseFileCount = res.count;
    this.nowPageCount = Math.ceil(this.fileService.getFolderOffset() / this.listItemCountMax) + 1;
    this.totalPageCount = Math.ceil(this.responseAllCount / this.listItemCountMax);

    for (let item of res.files) {
      //タイトルだけ先にセットする
      if (item.name == "..") {
        this.upFolderItem = item;
        continue;
      }
      this.itemList.push(item);
      this.fileService.getThumbnail(item.hash).subscribe(
        imageUrl => {
          item.image = imageUrl;
        },
        error => {
          this.setErrorPost(error);
        }
      );
    }
  }

  setErrorPost(error:any) {
    let errorText = error.status + ":" + error.statusText;
    if (error.status == 0 || error.statusText == "") {
      errorText = "サーバー接続エラー";
    }
  }

  clickListItem(item: FileListFileResponse) {
    console.log("clickListItem name=" + item.name);
    if (item.isdir) {
      console.log("clickListItem folder!");
      this.showFolderList(item.hash, 0);
    }
    else {
      console.log("clickListItem file! index=" + item.index)
      this.pageService.setBook(item.hash, item.page, item.index);
      this.router.navigate(["/image"]);
    }
  }

  jumpUpFolder() {
    if (this.upFolderItem != null) {
      this.clickListItem(this.upFolderItem);
    }
  }

  jumpFirstPage() {
    if (this.fileService.getFolderOffset() == 0) {
      return;
    }
    this.showFolderList(this.fileService.getFolderHash(), 0);
  }

  jumpPrevPage() {
    let offset = 0;
    if (this.fileService.getFolderOffset() == 0) {
      return;
    }
    else if (this.fileService.getFolderOffset() < this.listItemCountMax) {
      offset = 0;
    }
    else {
      offset = this.fileService.getFolderOffset() - this.listItemCountMax;
    }
    this.showFolderList(this.fileService.getFolderHash(), offset);
  }

  jumpNextPage() {
    if (this.nowPageCount == this.totalPageCount) {
      return;
    }
    let offset = this.fileService.getFolderOffset() + this.listItemCountMax;
    this.showFolderList(this.fileService.getFolderHash(), offset);
  }

  jumpLastPage() {
    if (this.nowPageCount == this.totalPageCount) {
      return;
    }
    let offset = (this.totalPageCount - 1) * this.listItemCountMax;
    this.showFolderList(this.fileService.getFolderHash(), offset);
  }

  showFolderMenu() {
    //未実装
  }
}
