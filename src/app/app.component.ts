import { Observable } from 'rxjs/Observable';
import { Component, ViewChild, Output } from '@angular/core';
import { Nav, Platform, LoadingController } from 'ionic-angular';

import { Storage } from '@ionic/storage';
import { Keyboard } from '@ionic-native/keyboard';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { AuthService } from '../providers/auth/auth-service';
import { UserService } from '../providers/user/user-service';

import { HomePage } from '../pages/home/home';

import { User } from 'models/app-models';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  @ViewChild(Nav) nav: Nav;
  rootPage:any;

  @Output() currentUser: User;

  //private userObservable: Observable<User>;

  constructor(
    private keyboard: Keyboard,
    public platform: Platform,
    public splashScreen: SplashScreen,
    public loadingCtrl: LoadingController,
    public statusBar: StatusBar,
    public storage: Storage,
    public authService: AuthService,
    public userService: UserService
  ) {
    this.initializeApp();
    this.isUserLoggedIn();

  }

  private initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleLightContent();
      this.keyboard.hideKeyboardAccessoryBar(false);
    });
  }

  get user(): User {
    //console.log(this.userService.currentUser);
    return this.userService.currentUser;
  }

  private isUserLoggedIn(): void {

    let loading = this.loadingCtrl.create({
      //content: "Consultando vagas para " + this.garageName + "..."
      content: "Verificando autenticação..."
    });
    loading.present();

    this.authService.getAuthState()
      .subscribe((auth) => {
        if (auth) {
          console.log("autenticado")

          const userObs: Observable<User> = this.userService.checkUserAccount(auth);

            userObs.subscribe( (user:User) => {
              if (user) {
               this.userService.currentUser = user;
               this.userService.setProfile(user);
              } else {
                loading.setContent("Criando conta...");
                this.userService.createUserAccount(auth)
                  .then( () => {
                    loading.dismiss();
                    this.nav.setRoot(HomePage);
                  })
                  .catch( (err) => console.log(err))
              }
            });

            userObs
            .first()
            .subscribe( (user:User) => {
              if (user) {
                loading.dismiss();
                this.nav.setRoot(HomePage);
              } else {
                //this.nav.setRoot('LoginPage');
              }
            });

        } else {
          console.log("nao  autenticado")
          loading.dismiss();
          this.splashScreen.hide();
          this.nav.setRoot('LoginPage');
        }
      });

  }

  public logout(): void {
    this.storage.clear();
    this.authService.signOut()
    .then(() => {
      this.nav.setRoot('LoginPage');
    })
  }

  /* openPage(page): void {
    this.nav.setRoot(page.component,
      {
        garage_id: page.uid,
        name: page.title
      });
  } */

}

