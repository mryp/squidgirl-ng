import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from "../login.service"

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  title = 'ファイル一覧';

  constructor() { }

  ngOnInit() {
  }

}
