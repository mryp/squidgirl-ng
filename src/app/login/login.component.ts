import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { LoginService } from "../login.service"

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  //フィールド
  //------------------------------------------------
  title = 'ログイン';
  userName:string = "";
  userPassword:string = "";
  isShowError:boolean = false;
  errorMessage:string = "";

  //メソッド
  //------------------------------------------------
  /**
   * コンストラクタ
   */
  constructor(
    private loginService:LoginService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  loginStart() {
    this.loginService.postLogin(this.userName, this.userPassword).subscribe(
      res => {
        let login = res.json();
        if (login.token != "") {
          this.router.navigate(['/list/folder', 'root', 0]);
        } else {
          this.setErrorMessage("トークン取得エラー");
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
