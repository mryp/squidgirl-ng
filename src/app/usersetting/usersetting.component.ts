import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
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
    private router: Router,
    private dialog: MdDialog
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
    let dialogRef = this.dialog.open(UsersettingDeleteDialog, {
      data: userName,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == "yes") {
        //削除
        this.postDeleteUser(userName);
      }
    });
  }

  postDeleteUser(userName:string) {
    this.userService.postDeleteUser(userName).subscribe(
      res => {
        this.showUserList();
      },
      error => {
        this.setUserListError(error);
      }
    );
  }
}

@Component({
  selector: 'app-usersetting-delete-dialog',
  templateUrl: './usersetting.deletedialog.html',
})
export class UsersettingDeleteDialog {
  constructor(@Inject(MD_DIALOG_DATA) public data: any,
    public dialogRef: MdDialogRef<UsersettingDeleteDialog>
  ) { }
}
