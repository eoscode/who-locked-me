import { Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';

import { SuperTabs } from 'ionic2-super-tabs';
import { FabContainer } from 'ionic-angular/components/fab/fab-container';
import { Platform } from 'ionic-angular/platform/platform';
import { DatePicker } from '@ionic-native/date-picker';

import { UserService } from '../../providers/user/user-service';
import { GarageService } from '../../providers/garage/garage-service';

import { GarageCheckInPage } from '../garage-checkin/garage-checkin';

import { Seat } from 'models/app-models';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  @ViewChild(SuperTabs) superTabs: SuperTabs;
  @ViewChild('dateTime') dateTime;

  pages: Array<{title: string, component: any, uid: string}>

  checkOutTime = new Date();

  constructor(public navCtrl: NavController,
    public platform: Platform,
    public nativeDataPicker: DatePicker,
    private userService: UserService,
    private garageService: GarageService
  ) {

      //carrega as garagens do usuario
      this.pages = [
        { title: 'Sala 1201', component: GarageCheckInPage, uid: '1' },
        { title: 'Sala 1202', component: GarageCheckInPage, uid: '2' }
      ];

    }

    get currentSeat(): Seat {
      return this.userService.currentUser.currentSeat;
    }

    public scheduleCheckout(fab: FabContainer): void {

      fab.close();

      if (this.platform.is('cordova')) {
        this.nativeDataPicker.show({
          date: new Date(),
          mode: 'time',
          okText: 'OK',
          cancelText: 'Cancelar',
          is24Hour: true,
          androidTheme: this.nativeDataPicker.ANDROID_THEMES.THEME_DEVICE_DEFAULT_LIGHT
        }).then(
          date => {
            this.checkOutTimeChanged({
              hour: date.getHours(),
              minute: (date.getMinutes() < 10 ? '0' : '') + date.getMinutes()
            });
          },
          err => console.log('Error occurred while getting date: ', err)
        );
      } else {
        this.dateTime.open();
      }

    }

    public checkOutTimeChanged(time): void {

      let { hour, minute } = time;

      let seat: Seat = this.userService.currentUser.currentSeat;
      this.garageService.scheduleCheckout(seat,
         {
           scheduledCheckout: hour + ":" + minute
          }
        );

    }

    onTabSelect(tab: { index: number; id: string; }) {
      console.log(`Selected tab: `, tab);
    }

}
