import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MdSidenav } from '@angular/material';

import { LoginService } from "../login.service"

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  title = 'ファイル一覧';
  menuIcon = "menu";
  @ViewChild('sidenav') sidenav: MdSidenav; //#sidenav オブジェクトを読み込むため設定

  categoryLinkList = [
    {
      title: 'ルートフォルダ',
      link: "/list",
      content: "filelist",
      icon: "folder_open",
    },
    {
      title: '履歴',
      link: "/list",
      content: "filelist",
      icon: "history",
    },
  ];

  reactionLinkList = [
    {
      title: '気に入った',
      link: "/list",
      content: "filelist",
      icon: "thumb_up",
    },
    {
      title: 'いまいち',
      link: "/list",
      content: "filelist",
      icon: "thumb_down",
    },
  ];

  otherLinkList = [
    {
      title: '設定',
      link: "/list",
      content: "setting",
      icon: "settings",
    },
  ];

  constructor(
    private loginService:LoginService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  sideNaviOpenStart() {
    this.menuIcon = "arrow_back";
  }
  sideNaviCloseStart() {
    this.menuIcon = "menu";
  }
  sideNaviToggle() {
    this.sidenav.toggle();
  }

  jumpPage(title:string, link:string, content:string) {
    this.sidenav.close();
    this.title = title;
    this.router.navigate([link, { outlets: { content: content } }]);
  }

}