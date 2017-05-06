import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from "../login.service"

@Component({
  selector: 'app-filelist',
  templateUrl: './filelist.component.html',
  styleUrls: ['./filelist.component.css']
})
export class FilelistComponent implements OnInit {
  listColumn = 3;
  listItemHeightMin = 120;
  itemList = [
    {title: "三国志1ああいうえおあいうえお", file:"sangokushi1.zip", image: "assets/img/dummy_1.jpg"},
    {title: "三国志2", file:"sangokushi2.zip", image: "assets/img/dummy_2.jpg"},
    {title: "三国志3", file:"sangokushi3.zip", image: "assets/img/dummy_3.jpg"},
    {title: "三国志4", file:"sangokushi4.zip", image: "assets/img/dummy_4.jpg"},
  ];

  constructor(
    private loginService:LoginService,
    private router: Router
  ) { }

  ngOnInit() {
    this.onScreenResize();
  }

  @HostListener("window:resize")
  onScreenResize() {
    this.listColumn = innerWidth / this.listItemHeightMin;
  }

  clickListItem(file:string) {
    console.log("clickListItem file=" + file);
    this.router.navigate(["/image"]);
  }
}
