import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule, MdDialogModule } from '@angular/material';
import { RouterModule, Routes } from '@angular/router';
import 'hammerjs';

import { AppComponent } from './app.component';
import { ListComponent } from './list/list.component';
import { LoginService } from './login.service';
import { LoginComponent } from './login/login.component';
import { FilelistComponent } from './filelist/filelist.component';
import { SettingComponent } from './setting/setting.component';
import { ImageComponent } from './image/image.component';
import { UsersettingComponent, UsersettingDeleteDialog } from './usersetting/usersetting.component';
import { UseraddComponent } from './useradd/useradd.component';
import { FileService } from './file.service';
import { PageService } from './page.service';
import { UserService } from './user.service';

//ルーター
const appRoutes = [
  { path: "", component:LoginComponent },
  { path: 'list',
    component:ListComponent,
    children: [
      { path: 'folder/:hash/:offset', component: FilelistComponent },
    ]
  },
  { path: "image", component:ImageComponent },
  { path: 'setting', component: SettingComponent },
  { path: 'useradd', component: UseraddComponent },
  { path: 'usersetting', component: UsersettingComponent },
]

@NgModule({
  declarations: [
    AppComponent,
    ListComponent,
    LoginComponent,
    FilelistComponent,
    SettingComponent,
    ImageComponent,
    UsersettingComponent,
    UseraddComponent,
    UsersettingDeleteDialog,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    BrowserAnimationsModule,
    MaterialModule,
    RouterModule.forRoot(appRoutes),
    MdDialogModule,
  ],
  providers: [
    LoginService,
    FileService,
    PageService,
    UserService,
  ],
  entryComponents: [
    UsersettingDeleteDialog
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
