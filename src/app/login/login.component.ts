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
    this.loginService.createLoginToken(this.userName, this.userPassword);
    this.router.navigate(['/list', { outlets: { content: 'filelist' } }]);
  }
}
