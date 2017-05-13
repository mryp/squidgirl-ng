import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router } from '@angular/router';

import { PageService } from "../page.service"

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.css']
})
export class ImageComponent implements OnInit, OnDestroy {
  isVisibleToolbar = false;
  pageImage = "";

  constructor(
    private pageService:PageService,
    private router: Router
  ) { }

  ngOnInit() {
    this.onScreenResize();
    this.pageService.loadPage();
    this.showImage();
  }

  ngOnDestroy() {
    console.log("ngOnDestroy");
    this.pageService.savePage().subscribe(
      response => {
        console.log("ok:" + response.json())
      },
      error => {
        console.log(error.status + ":" + error.statusText);
      }
    );
  }

  @HostListener("window:resize")
  onScreenResize() {
    this.pageService.setImageSize(innerHeight, innerWidth);
  }

  backToMenu() {
    this.router.navigate(["/"]);
  }

  showOption() {

  }

  clickImage(event:any) {
    let mouseEvent = <MouseEvent>event;
    console.log("clickImage x=" + mouseEvent.x + " y=" + mouseEvent.y);

    let menuAreaHeight = innerHeight / 4;
    let pageChangeWidth = innerWidth / 2;
    if (mouseEvent.y < menuAreaHeight)
    {
      //ツールバー表示状態変更
      this.isVisibleToolbar = !this.isVisibleToolbar;
      console.log("ツールバー表示変更 " + this.isVisibleToolbar);
    }
    else if (mouseEvent.x < pageChangeWidth)
    {
      console.log("前へ移動");
      if (this.pageService.setPrevPage()) {
        this.showImage();
      }
    }
    else
    {
      console.log("次へ移動");
      if (this.pageService.setNextPage()) {
        this.showImage();
      }
    }
  }

  showImage() {
    this.pageService.getPage().subscribe(
      imageUrl => {
        this.pageImage = imageUrl;
      },
      error => {
        this.setError(error);
        this.pageImage = "";
      }
    );
  }

  setError(error:any) {
    let errorText = error.status + ":" + error.statusText;
    if (error.status == 0 || error.statusText == "") {
      errorText = "サーバー接続エラー";
    }
  }

}
