import { Component, OnInit, HostListener, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Response } from "@angular/http";
import { FileService } from "../file.service"
import { PageService } from "../page.service"

class FileListItem {
  hash: string;
  name: string;
  image: string;
  isdir: boolean;
  page: number;

  constructor() {
    this.hash = "";
    this.name = "";
    this.image = "";
    this.isdir = false;
    this.page = 0;
  }
}

@Component({
  selector: 'app-filelist',
  templateUrl: './filelist.component.html',
  styleUrls: ['./filelist.component.css']
})
export class FilelistComponent implements OnInit {
  title = "";
  listColumn = 2;         //列数（画面サイズ・画像サイズから計算する）
  listItemWidthMin = 160; //画像の横幅
  listItemCountMax = 10;  //1ページに表示する最大個数

  itemList = [];
  upFolderItem: FileListItem = null;

  requestHash = "";
  requestOffset = 0;
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
    this.onScreenResize();
    this.showFolderList("", 0);
  }

  @HostListener("window:resize")
  onScreenResize() {
    this.listColumn = innerWidth / this.listItemWidthMin;
  }

  showFolderList(hash:string, offset:number) {
    this.requestHash = hash;
    this.requestOffset = offset;
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

  setSuccessPost(responce:Response) {
    let json = responce.json();
    this.title = json.name;
    this.responseAllCount = json.allcount;
    this.responseFileCount = json.count;
    this.nowPageCount = Math.ceil(this.requestOffset / this.listItemCountMax) + 1;
    this.totalPageCount = Math.ceil(this.responseAllCount / this.listItemCountMax);

    for (let item of json.files) {
      //タイトルだけ先にセットする
      if (item.name == "..") {
        this.upFolderItem = item;
        continue;
      }
      let newItem = new FileListItem();
      newItem.hash = item.hash;
      newItem.name = item.name;
      newItem.isdir = item.isdir;
      newItem.page = item.page;
      this.itemList.push(newItem);

      this.fileService.getThumbnail(item.hash).subscribe(
        imageUrl => {
          newItem.image = imageUrl;
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

  clickListItem(item: FileListItem) {
    console.log("clickListItem name=" + item.name);
    if (item.isdir) {
      console.log("clickListItem folder!");
      this.showFolderList(item.hash, 0);
    }
    else {
      console.log("clickListItem file!")
      this.pageService.setBook(item.hash, item.page);
      this.router.navigate(["/image"]);
    }
  }

  jumpUpFolder() {
    if (this.upFolderItem != null) {
      this.clickListItem(this.upFolderItem);
    }
  }

  jumpFirstPage() {
    if (this.requestOffset == 0) {
      return;
    }
    this.requestOffset = 0;
    this.showFolderList(this.requestHash, this.requestOffset);
  }

  jumpPrevPage() {
    if (this.requestOffset == 0) {
      return;
    }
    else if (this.requestOffset < this.listItemCountMax) {
      this.requestOffset = 0;
    }
    else {
      this.requestOffset -= this.listItemCountMax;
    }
    this.showFolderList(this.requestHash, this.requestOffset);
  }

  jumpNextPage() {
    if (this.nowPageCount == this.totalPageCount) {
      return;
    }
    this.requestOffset += this.listItemCountMax;
    this.showFolderList(this.requestHash, this.requestOffset);
  }

  jumpLastPage() {
    if (this.nowPageCount == this.totalPageCount) {
      return;
    }
    this.requestOffset = (this.totalPageCount - 1) * this.listItemCountMax;
    this.showFolderList(this.requestHash, this.requestOffset);
  }

  showFolderMenu() {
    //未実装
  }
}
