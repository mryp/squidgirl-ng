import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.css']
})
export class ImageComponent implements OnInit {
  isVisibleToolbar = false;

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
    this.onScreenResize();
  }

  @HostListener("window:resize")
  onScreenResize() {
    //
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
      //前へ移動
      console.log("前へ移動");
    }
    else
    {
      //次へ移動
      console.log("次へ移動");
    }
  }
}
