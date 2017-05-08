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
  listItemWidthMin = 120;
  itemList = [
    {title: "三国志1ああいうえおあいうえお", file:"sangokushi1.zip", image: "assets/img/dummy_1.jpg"},
    {title: "三国志2", file:"sangokushi2.zip", image: "assets/img/dummy_2.jpg"},
    {title: "三国志3", file:"sangokushi3.zip", image: "assets/img/dummy_3.jpg"},
    {title: "三国志4", file:"sangokushi4.zip", image: "assets/img/dummy_4.jpg"},
  ];

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
    this.fileService.sendFileList(hash,
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
    for (let item of list) {
      console.log(item.name);
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
