import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService, UserListResponse } from '../user.service';

@Component({
  selector: 'app-useradd',
  templateUrl: './useradd.component.html',
  styleUrls: ['./useradd.component.css']
})
export class UseraddComponent implements OnInit {
  userName:string = "";
  userPassword:string = "";
  adminChecked:boolean = false;
  isShowError:boolean = false;
  errorMessage:string = "";

  constructor(
    private userService:UserService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  cancel() {
    this.router.navigateByUrl('/usersetting');
  }

  registStart() {
    this.isShowError = false;
    this.errorMessage = "";
    if (this.userName == "" || this.userPassword == "") {
      this.setErrorMessage("ユーザー名・パスワードが入力されていません");
      return;
    }

    this.userService.postCreateUser(this.userName, this.userPassword, this.adminChecked).subscribe(
      res => {
        let createUser = res.json();
        if (createUser.status == 0) {
          this.router.navigate(['/usersetting']);
        } else {
          this.setErrorMessage("ユーザー作成エラー status=" + createUser.status);
        }
      },
      error => {
        this.setErrorMessage(error.status + ":" + error.statusText);
      }
    );
  }

  setErrorMessage(message:string) {
    this.isShowError = true;
    this.errorMessage = message;
  }
}
