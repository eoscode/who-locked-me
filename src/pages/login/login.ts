import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AuthService } from '../../providers/auth/auth-service';
import { UserService } from '../../providers/user/user-service';

import { User } from 'models/app-models';

import * as firebase from 'firebase';


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  isLoading: boolean = false;

  constructor(public navCtrl: NavController,
     public navParams: NavParams,
     private authService: AuthService,
     private userService: UserService) {

  }

  private onSignInSuccess(): void {

    this.authService.getAuthState()
    .subscribe((auth: firebase.User) => {

      if (auth) {

        let user: User = {};
        user.uid = auth.uid;
        user.name = auth.displayName;
        user.picture = auth.photoURL;
        user.email = auth.email;
        user.phone = auth.phoneNumber;

        this.userService.setProfile(user);

        this.userService.isExist(user.uid)
        //.first()
        .subscribe((userExists: boolean) => {
          if (!userExists) {
            this.userService.creatUser(user);
          }

        });

      }

    });

  }

public connectWithGoogle(): void {
    this.isLoading = true;
    //this.onSignInSuccess();

    this.authService.signInWithGoogle()
    .then(() => {
      console.log("autenticacao ok");
    }).catch((err) => {
      console.log(err);
      alert('Erro: '+ err.message + ' - ' + err.code);
      this.isLoading = false;
    });

  }

  ionViewDidLoad() {

  }

}
