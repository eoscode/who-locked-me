import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoginPage } from './login';
import { GooglePlus } from '@ionic-native/google-plus';

@NgModule({
  declarations: [
    LoginPage
  ],
  imports: [
    IonicPageModule.forChild(LoginPage),
  ],
  providers: [GooglePlus]
})
export class LoginPageModule {}
