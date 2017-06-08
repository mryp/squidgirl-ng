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
  isImageDownload = false;
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
        console.log("ok:" + response.text())
      },
      error => {
        console.log(error.status + ":" + error.statusText);
      }
    );
  }

  @HostListener("window:resize")
  onScreenResize() {
    this.pageService.setImageSize(innerHeight, innerWidth, devicePixelRatio);
  }

  backToMenu() {
    this.router.navigate(['/list/file']);
  }

  showOption() {

  }

  clickImage(event:any) {
    let mouseEvent = <MouseEvent>event;
    console.log("clickImage x=" + mouseEvent.x + " y=" + mouseEvent.y);
    if (this.isImageDownload) {
      console.log("画像取得中のため移動処理キャンセル");
      return;
    }

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
      if (this.pageService.setPrevPage()) {
        console.log("前へ移動");
        this.showImage();
      }
    }
    else
    {
      if (this.pageService.setNextPage()) {
        console.log("次へ移動");
        this.showImage();
      }
    }
  }

  showImage() {
    this.isImageDownload = true;
    this.pageService.getPage().subscribe(
      imageUrl => {
        this.isImageDownload = false;
        this.pageImage = imageUrl;
      },
      error => {
        this.setError(error);
        this.isImageDownload = false;
        this.pageImage = "";
      }
    );
  }

  setError(error:any) {
    console.log(error);
  }

}
