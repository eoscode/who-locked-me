import { Component, ViewChild } from "@angular/core";
import { NavController, NavParams, LoadingController, Platform, AlertController, Refresher, ToastController } from "ionic-angular";

import { Dialogs } from "@ionic-native/dialogs";

import { CheckInService } from '../../providers/checkin/checkIn-service'
import { GarageService } from "../../providers/garage/garage-service";
import { UserService } from "../../providers/user/user-service";

import { User, Seat, Checkin } from "models/app-models";
import { Observable } from "rxjs/Observable";

//@IonicPage()
@Component({
  selector: "page-garage",
  templateUrl: "garage-checkin.html",
  providers: [CheckInService, GarageService]
})
export class GarageCheckInPage {
  @ViewChild("datePicker") datePicker;

  i = 0;

  seats: Observable<Seat[]>;
  //private garageName: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private platform: Platform,
    private dialogs: Dialogs,
    private userService: UserService,
    private garageService: GarageService
  ) {
    //this.user = {};

    //this.garageName = navParams.get("name");
    //this.garageName = this.navParams.get("name");
    garageService.init(this.navParams.get("garage_id"));
    //garageProvider.init('1');
  }

  ionViewDidLoad() {
    /* this.userService.getProfile()
    .then(user => {

      this.user = user;
      this.seats.forEach(seats => {
        seats.filter(seat => {
          let checkin = seat.checkin;
          if (checkin && checkin.user.uid == user.uid) {
            this.userService.mySeat = seat;
          }
        });
      });

    }); */

    this.loadSeats();
  }

  public refreshTasks(refresher: Refresher): void {
    this.loadSeats();
    refresher.complete();
  }

  public onClick(seat: Seat): void {
    let currentUser = this.userService.currentUser;
    let currentSeat: Seat = currentUser.currentSeat;

    let checkin: Checkin = seat.checkin;

    if (checkin) {

      if (currentUser.uid === checkin.user.uid) {
        this.checkOut(seat);
      } else {

        if (checkin.scheduledCheckout) {
          this.alertDialog({
            title: checkin.user.name,
            message: `Vou sair às ${checkin.scheduledCheckout}h`
          });
        } else {
          this.alertDialog({
            title: "Check-In",
            message: `${checkin.user.name} está utilizando a vaga.`
          });
        }

      }

    } else  {

      if (currentSeat && currentSeat.uid !== seat.uid) {
        this.alertDialog({
          title: "Check-In",
          message: "Você já está utilizando uma vaga."
        });
      } else {
        this.checkIn(seat);
      }

    }

  }

  private checkIn(seat: Seat): void {

    let checkin: Checkin = {
      user: this.userService.currentUser,
      chekedByAnotherUser: null
    };

    this.garageService.checkIn(seat, checkin)
      .then((message: string) => {
        let toast = this.toastCtrl.create({
          message: message,
          duration: 2000,
          position: 'bottom'
        });
        toast.present();
      });
  }

  private checkOut(seat: Seat): void {
    this.garageService.checkOut(seat)
      .then((message: string) => {
        let toast = this.toastCtrl.create({
          message: message,
          duration: 2000,
          position: 'bottom'
        });
        toast.present();
      });
  }

  private loadSeats(): void {
    let loading = this.loadingCtrl.create({
      content: "Consultando vagas..."
    });
    loading.present();

    this.seats = this.garageService.listSeats();
    this.seats.subscribe(seats => {
      loading.dismiss();
    });
  }

  public takenSeatForAnotherUser(seat: Seat): void {
    if (seat.checkin != null) {

      this.confirmCheckOut(seat).then(result => {
        if (result) {
          this.checkOut(seat);
        }
      });

    } else {
      this.promptAnotherUser(seat).then(result => {
        if (result.status && (result.data != null && result.data != "")) {
          let externalUser: User = {
            external: true,
            name: result.data,
            uid: new Date().toISOString()
          };

          let checkin: Checkin = {
            user: externalUser,
            chekedByAnotherUser: this.userService.currentUser
          };
          this.garageService.checkInByAnotherUser(seat, checkin)
            .then((message: string) => {
              let toast = this.toastCtrl.create({
                message: message,
                duration: 2000,
                position: 'bottom'
              });
              toast.present();
            });

        }
      });
    }
  }

  private alertDialog(options: {message: string, title?: string}): void {
    if (options.title == null) {
      options.title = "Check-In";
    }
    if (this.platform.is("cordova")) {
      this.dialogs.alert(options.message, options.title);
    } else {
      let alert = this.alertCtrl.create({
        title: options.title,
        subTitle: options.message,
        buttons: ["OK"]
      });
      alert.present();
    }
  }

  private confirmCheckOut(seat: Seat): Promise<boolean> {

    let checkin = seat.checkin;
    var message = checkin.user.name + " saiu da vaga?";
    return this.confirmCheckOutDialog({
      title: "Check-Out",
      message: message
    });

  }

  private confirmCheckOutDialog(options: {message: string, title?: string}): Promise<boolean> {
    if (options.title == null) {
      options.title = "Check-Out?";
    }

    if (this.platform.is("cordova")) {
      return new Promise((resolve, reject) => {
        this.dialogs.confirm(options.message, options.title, ["Sim", "Não"]).then(option => {
          if (option == 1) {
            resolve(true);
          } else {
            resolve(false);
          }
        });
      });
    } else {
      return new Promise((resolve, reject) => {
        let alert = this.alertCtrl.create({
          title: options.title,
          message: options.message,
          buttons: [
            {
              text: "Não",
              role: "cancel",
              handler: () => {
                console.log("Cancel clicked");
              }
            },
            {
              text: "Sim",
              handler: () => {
                resolve(true)
              }
            }
          ]
        });
        alert.present();
      });
    }
  }

  private promptAnotherUser(seat: Seat, title?: string): Promise<{status: boolean, data?: string}>  {
    if (title == null) {
      title = "Check-In";
    }

    var message = "Informe o nome do usuário que está utilizando a vaga.";

    if (this.platform.is("cordova2")) {
      return new Promise((resolve, reject) => {
        this.dialogs
          .prompt(message, title, ["OK", "Cancelar"])
          .then(callback => {
            var status = callback.buttonIndex == 1;
            resolve({ status: status, data: callback.input1 });
          });
      });
    } else {
      return new Promise((resolve, reject) => {
        let alert = this.alertCtrl.create({
          title: title,
          message: message,
          inputs: [
            {
              name: "name",
              placeholder: "Nome"
            }
          ],
          buttons: [
            {
              text: "Cancelar",
              role: "cancel",
              handler: data => {
                console.log("Cancel clicked");
              }
            },
            {
              text: "OK",
              handler: data => {
                if (data.name != null && data.name != "") {
                  resolve({ status: true, data: data.name });
                } else {
                  resolve({ status: false });
                }
              }
            }
          ]
        });
        alert.present();
      });
    }
  }
}
