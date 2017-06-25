import { Component, OnInit, HostListener, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Response } from "@angular/http";

import { FileService, FileListResponse, FileListFileResponse } from "../file.service"
import { PageService } from "../page.service"
import { EnvOption } from "../envoption";

export interface TitleItem {
  title: string;
  hash: string;
}

@Component({
  selector: 'app-filelist',
  templateUrl: './filelist.component.html',
  styleUrls: ['./filelist.component.css'],
})
export class FilelistComponent implements OnInit {
  folderHash = "";
  folderOffset = 0;
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

  titleList:TitleItem[] = [];

  constructor(
    private fileService:FileService,
    private pageService:PageService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    route.params.subscribe(params => {
      //ページ切り替えのたびにパラメータを設定する
      let hash = params['hash'];
      let offset = +params['offset'];
      let isChangeFolder = false;
      let isChangeTitle = false;
      if (hash != this.folderHash || offset != this.folderOffset) {
        isChangeFolder = true;
      }
      if (hash != this.folderHash) {
        isChangeTitle = true;
      }

      //更新があったデータだけ再取得を行う
      this.folderHash = hash;
      this.folderOffset = offset;
      if (isChangeFolder) {
        this.showFolderList(this.folderHash, this.folderOffset);
      }
      if (isChangeTitle) {
        this.showTitleList(this.folderHash);
      }
    });
  }

  ngOnInit() {
    this.setListColumn(window.innerWidth);
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

  showTitleList(hash:string) {
    this.titleList = [];
    this.fileService.postParentList(hash).subscribe(
      res => {
        let list:TitleItem[] = [];
        for (let item of res.folders) {
          list.push({title: item.name, hash: item.hash});
        }

        this.titleList = list.reverse();
      },
      error => {
        this.titleList.push({title: "ERROR", hash: "root"});
      }
    );
  }

  setSuccessPost(res:FileListResponse) {
    this.title = res.name;
    this.responseAllCount = res.allcount;
    this.responseFileCount = res.count;
    this.nowPageCount = Math.ceil(this.folderOffset / this.listItemCountMax) + 1;
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
      console.log("clickListItem folder=" + item.hash);
      this.router.navigate(['/list/folder', item.hash, 0]);
    }
    else {
      console.log("clickListItem file! index=" + item.index)
      this.pageService.setBook(item.hash, item.page, item.index);
      this.router.navigate(["/image"]);
    }
  }

  jumpFolder(hash:string) {
    this.router.navigate(['/list/folder', hash, 0]);
  }

  jumpFirstPage() {
    if (this.folderOffset == 0) {
      return;
    }
    this.router.navigate(['/list/folder', this.folderHash, 0]);
  }

  jumpPrevPage() {
    let offset = 0;
    if (this.folderOffset == 0) {
      return;
    }
    else if (this.folderOffset < this.listItemCountMax) {
      offset = 0;
    }
    else {
      offset = this.folderOffset - this.listItemCountMax;
    }
    this.router.navigate(['/list/folder', this.folderHash, offset]);
  }

  jumpNextPage() {
    if (this.nowPageCount == this.totalPageCount) {
      return;
    }
    let offset = this.folderOffset + this.listItemCountMax;
    this.router.navigate(['/list/folder', this.folderHash, offset]);
  }

  jumpLastPage() {
    if (this.nowPageCount == this.totalPageCount) {
      return;
    }
    let offset = (this.totalPageCount - 1) * this.listItemCountMax;
    this.router.navigate(['/list/folder', this.folderHash, offset]);
  }
}
