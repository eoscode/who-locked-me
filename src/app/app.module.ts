import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Keyboard } from '@ionic-native/keyboard';
import { IonicStorageModule } from '@ionic/storage';
import { HttpModule } from '@angular/http'

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule, AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { LoginPageModule } from '../pages/login/login.module';
import { Dialogs } from '@ionic-native/dialogs';
import { SuperTabsModule } from 'ionic2-super-tabs';
import { GooglePlus } from "@ionic-native/google-plus";
import { DatePicker } from '@ionic-native/date-picker';

import { MyApp } from './app.component';
import { FirebaseConfig } from './firebase-config';

import { GarageService } from '../providers/garage/garage-service';
import { UserService } from '../providers/user/user-service';
import { AuthService } from '../providers/auth/auth-service';
import { FirebaseService } from '../providers/firebase/firebase-service';
import { CheckInService } from '../providers/checkin/checkIn-service';

import { GarageCheckInPage } from '../pages/garage-checkin/garage-checkin';
import { HomePage } from '../pages/home/home';

import { UserInfoComponent } from '../components/user-info/user-info.component';
import { SeatStatusComponent } from '../components/seat-status/seat-status.component';


let pages = [
  MyApp,
  GarageCheckInPage,
  HomePage,
  UserInfoComponent,
  SeatStatusComponent
];

@NgModule({
  declarations: pages,
  imports: [
    BrowserModule,

    IonicModule.forRoot(MyApp, {
      preloadModules: true,
      mode: 'md'
    }),
    SuperTabsModule.forRoot(),
    IonicStorageModule.forRoot(),
    AngularFireModule.initializeApp(FirebaseConfig.config),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    HttpModule,
    LoginPageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: pages,

  providers: [
    Keyboard,
    StatusBar,
    SplashScreen,
    AngularFireDatabase,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    GarageService,
    AuthService,
    FirebaseService,
    UserService,
    CheckInService,
    GooglePlus,
    Dialogs,
    DatePicker
  ]
})
export class AppModule {}
