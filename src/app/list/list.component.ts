import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { MdSidenav } from '@angular/material';

import { LoginService } from "../login.service"
import { EnvOption } from "../envoption";

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  title = 'フォルダ';
  appName = EnvOption.APP_NAME;

  sidenaviMode = 'over';
  sidenaviOpened = false;
  sidenaviIconVisible = true;
  @ViewChild('sidenav') sidenav: MdSidenav; //#sidenav オブジェクトを読み込むため設定

  categoryLinkList = [
    {
      title: 'フォルダ',
      link: "/list/file",
      icon: "folder_open",
    },
    {
      title: '履歴',
      link: "/list/file",
      icon: "history",
    },
  ];

  reactionLinkList = [
    {
      title: '気に入った',
      link: "/list/file",
      icon: "thumb_up",
    },
    {
      title: 'いまいち',
      link: "/list/file",
      icon: "thumb_down",
    },
  ];

  otherLinkList = [
    {
      title: '設定',
      link: "/setting",
      icon: "settings",
    },
    {
      title: 'ユーザー設定',
      link: "/usersetting",
      icon: "settings",
    },
  ];

  constructor(
    private loginService:LoginService,
    private router: Router
  ) { }

  ngOnInit() {
    this.setSidenavi(window.innerWidth);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.setSidenavi(event.target.innerWidth);
  }

  setSidenavi(windowSize:number) {
    console.log("setSidenavi size=" + windowSize);
    if (windowSize < EnvOption.WINDOW_WIDTH_TABLET) {
      this.sidenaviMode = 'over';
      this.sidenaviOpened = false;
      this.sidenaviIconVisible = true;
    } else {
      this.sidenaviMode = 'side';
      this.sidenaviOpened = true;
      this.sidenaviIconVisible = false;
    }
  }

  sideNaviToggle() {
    this.sidenav.toggle();
  }

  jumpPage(title:string, link:string) {
    if (this.sidenaviIconVisible) {
      this.sidenav.close();
    }
    this.title = title;
    this.router.navigate([link]);
  }

}
