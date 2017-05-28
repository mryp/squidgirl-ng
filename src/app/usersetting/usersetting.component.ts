import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FileService } from "../file.service"

@Component({
  selector: 'app-usersetting',
  templateUrl: './usersetting.component.html',
  styleUrls: ['./usersetting.component.css']
})
export class UsersettingComponent implements OnInit {

  constructor(
    private fileService:FileService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  cancelSetting() {
    this.router.navigate(['/list', { outlets: { content: 'filelist' } }]);
  }

  saveSetting() {
    this.router.navigate(['/list', { outlets: { content: 'filelist' } }]);
  }
}
