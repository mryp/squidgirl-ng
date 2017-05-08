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
    this.loginService.sendLogin(this.userName, this.userPassword,
      (token, error) => {
        if (token != "") {
          this.router.navigate(['/list', { outlets: { content: 'filelist' } }]);
        } else if (error != null) {
          this.setErrorMessage(error.status + ":" + error.statusText);
        } else {
          this.setErrorMessage("トークン取得エラー");
        }
      }
    );
  }

  setErrorMessage(message:string) {
    this.isShowError = true;
    this.errorMessage = message;
  }
}
