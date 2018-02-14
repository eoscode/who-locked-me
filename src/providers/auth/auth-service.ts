import { Injectable } from "@angular/core";
import { Platform } from "ionic-angular";
import { AngularFireAuth } from "angularfire2/auth";
import { GooglePlus } from "@ionic-native/google-plus";

import { Observable } from 'rxjs/Observable';

import "rxjs/add/operator/map";
import 'rxjs/add/operator/first';

import * as firebase from "firebase/app";

@Injectable()
export class AuthService {

  public firebaseUser: firebase.User;

  constructor(
    private afAuth: AngularFireAuth,
    private platform: Platform,
    private googlePlus: GooglePlus
  ) {

  }

  public getAuthState(): Observable<firebase.User> {
    return this.afAuth.authState;
  }

  public isUserLoggedIn(): Promise<firebase.User> {
      return new Promise((resolve, reject) => {
        this.afAuth.authState
        .first()
        .subscribe((user: firebase.User) => {
          if (user) {
            this.firebaseUser = user;
            resolve(user);
          } else {
            reject(null);
          }
        });
      });
  }

  get authenticated(): Promise<boolean> {
    return this.isUserLoggedIn()
      .then(() => true)
      .catch(() => false);
  }

  public signInWithGoogle() {
    if (this.platform.is("cordova")) {
      var params = {
        webClientId:
          "632361546592-29cmvpihc68klr76a0lufmegt0efd0gv.apps.googleusercontent.com",
        offline: true
      };

      this.googlePlus
        .login(params)
        .then(res => {

          return this.afAuth.auth.signInWithCredential(
            firebase.auth.GoogleAuthProvider.credential(res.idToken)
          );

        })
        .catch(err => {
          alert("Error - " + err);
        });
    } else {
      return this.afAuth.auth.signInWithRedirect(
        new firebase.auth.GoogleAuthProvider()
      );
    }
  }

  public signOut(): Promise<any> {
    return this.afAuth.auth.signOut();
  }

  /* async register(user: any) {
    try {
      const result = await this.afAuth.auth.createUserWithEmailAndPassword(
        user.email,
        user.password
      );
      if (result) {
       // this.navCtrl.setRoot('HomePage');
      }
    } catch (e) {
      console.error(e);
    }
  }
 */
}
