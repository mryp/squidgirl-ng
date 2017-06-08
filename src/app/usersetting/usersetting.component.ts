import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FileService } from "../file.service"
import { UserService, UserListResponse } from '../user.service';

@Component({
  selector: 'app-usersetting',
  templateUrl: './usersetting.component.html',
  styleUrls: ['./usersetting.component.css']
})
export class UsersettingComponent implements OnInit {
  userCount:number = 0;
  userList = [];

  constructor(
    private fileService:FileService,
    private userService:UserService,
    private router: Router
  ) { }

  ngOnInit() {
    this.showUserList();
  }

  showUserList() {
    this.userList = [];
    this.userService.getUserList().subscribe(
      res => {
        this.setUserListSuccess(res);
      },
      error => {
        this.setUserListError(error);
      }
    );
  }

  setUserListSuccess(res:UserListResponse) {
    console.log(res);
    this.userCount = res.count;
    for (let item of res.users) {
      this.userList.push(item);
    }
  }

  setUserListError(error:any) {
    let errorText = error.status + ":" + error.statusText;
    console.log(errorText);
  }

  cancelSetting() {
    this.router.navigateByUrl('/list/file');
  }

  addUser() {
    this.router.navigateByUrl('/useradd');
  }

  deleteUser(userName:string) {
    console.log("deleteUser=" + userName);
  }
}
