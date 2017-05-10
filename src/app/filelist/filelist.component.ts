import { Component, OnInit, HostListener, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Response } from "@angular/http";
import { LoginService } from "../login.service"
import { FileService } from "../file.service"

class FileListItem {
  hash: string;
  name: string;
  image: string;
  isdir: boolean;

  constructor() {
    this.hash = "";
    this.name = "";
    this.image = "";
    this.isdir = false;
  }
}

@Component({
  selector: 'app-filelist',
  templateUrl: './filelist.component.html',
  styleUrls: ['./filelist.component.css']
})
export class FilelistComponent implements OnInit {
  title = "";
  allCount = 0;
  listColumn = 3;
  listItemWidthMin = 160;
  itemList = [];
  upFolderItem: FileListItem = null;

  constructor(
    private fileService:FileService,
    private router: Router
  ) { }

  ngOnInit() {
    this.onScreenResize();
    this.showFolderList("");
  }

  @HostListener("window:resize")
  onScreenResize() {
    this.listColumn = innerWidth / this.listItemWidthMin;
  }

  showFolderList(hash:string) {
    this.fileService.postFileList(hash,
      (responce, error) => {
        if (responce != null) {
          this.setSuccessStory(responce);
        } else if (error != null) {
          this.setErrorStory(error);
        }
      }
    );
  }

  setSuccessStory(responce:Response) {
    let json = responce.json();
    this.title = json.name;
    this.allCount = json.allcount;

    this.itemList = [];
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
      this.itemList.push(newItem);

      this.fileService.getThumbnail(item.hash,
        (imageUrl, error) => {
          if (responce != null) {
            //サムネイル画像は非同期で取得する
            newItem.image = imageUrl;
          } else if (error != null) {
            this.setErrorStory(error);
          }
        }
      );
    }
  }

  setErrorStory(error:any) {
    let errorText = error.status + ":" + error.statusText;
    if (error.status == 0 || error.statusText == "") {
      errorText = "サーバー接続エラー";
    }
  }

  clickListItem(item: FileListItem) {
    console.log("clickListItem name=" + item.name);
    if (item.isdir) {
      console.log("clickListItem folder!");
      this.showFolderList(item.hash);
    }
    else {
      console.log("clickListItem file!")
    }
    //this.router.navigate(["/image"]);
  }

  onClickUpward() {
    if (this.upFolderItem != null) {
      this.clickListItem(this.upFolderItem);
    }
  }
}
