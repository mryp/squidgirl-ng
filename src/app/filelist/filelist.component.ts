import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { Response } from "@angular/http";
import { LoginService } from "../login.service"
import { FileService } from "../file.service"

@Component({
  selector: 'app-filelist',
  templateUrl: './filelist.component.html',
  styleUrls: ['./filelist.component.css']
})
export class FilelistComponent implements OnInit {
  listColumn = 3;
  listItemWidthMin = 160;
  itemList = [];

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
    let list = responce.json();
    this.itemList = [];
    for (let item of list) {
      //タイトルだけ先にセットする
      let newItem = {name: item.name, image:""};
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

  clickListItem(file:string) {
    console.log("clickListItem file=" + file);
    this.router.navigate(["/image"]);
  }
}
