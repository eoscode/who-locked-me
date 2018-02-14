import { Injectable } from '@angular/core';

import { AngularFireList } from 'angularfire2/database';

import { Observable } from 'rxjs/Observable';

import { FirebaseService } from '../firebase/firebase-service';

import { Seat, Garage, User, Checkin } from 'models/app-models';

import 'rxjs/add/operator/map';

@Injectable()
export class GarageService {

  private garageId: string;
  private itemsRef: AngularFireList<any>;
  private seats: Observable<Seat[]>;

  constructor(
    private firebaseService: FirebaseService
    //private userService:
  ) {

  }

  public init(garageId: string) {
    this.garageId = garageId;
  }

  private formatPath(seat: Seat): string {
    return `/garages/${seat.garage.uid}/seats/${seat.uid}`
  }

  private formatPathUser(user: User): string {
    return `/users/${user.uid}`
  }

public listSeats(): Observable<Seat[]> {
    this.itemsRef = this.firebaseService.getList(`/garages/${this.garageId}/seats`);

    /*
    this.itemsRef.snapshotChanges()
    .subscribe(actions => {
      actions.forEach(action => {
        console.log(action.type);
        console.log(action.key);
        console.log(action.payload.val());
      });
    });
    */

    this.seats = this.itemsRef.snapshotChanges().map(changes => {
      let garage: Garage = {};
      garage.uid = this.garageId;
      return changes.map(c => (
        { uid: c.payload.key, garage: garage, ...c.payload.val() }
      ));
    });
    return this.seats;
  }

  public checkIn(seat: Seat, checkin: Checkin): Promise<string> {
    let objRef = this.firebaseService.getObject('/');

    let updateData = {}

    updateData[`${this.formatPath(seat)}/checkin`] = checkin
    updateData[`${this.formatPathUser(checkin.user)}/currentSeat`] = {
      uid: seat.uid,
      garage: {
        uid: seat.garage.uid
      }
    }

    return objRef.update(updateData)
      .then(() =>  "Checkin realizado com sucesso.")
      .catch((error) => {
        console.log(error);
        return "Não foi possível realizar o checkin.";
      });

  }

  public checkInByAnotherUser(seat: Seat, checkin: Checkin) {
    let objRef = this.firebaseService.getObject('/');
    let updateData = {}
    updateData[`${this.formatPath(seat)}/checkin`] = checkin

    return objRef.update(updateData)
      .then(() =>  "Checkin realizado com sucesso.")
      .catch((error) => {
        console.log(error);
        return "Não foi possível realizar o checkin.";
      });
  }

  public checkOut(seat: Seat): Promise<string> {

    let user: User = seat.checkin.user;

    let objRef = this.firebaseService.getObject('/');
    let updateData = {}

    updateData[`${this.formatPath(seat)}/checkin`] = null;

    if (!user.external) {
      updateData[`${this.formatPathUser(seat.checkin.user)}/currentSeat`] = null;
    }

    return objRef.update(updateData)
    .then(() => {
      return "Checkout realizado com sucesso."}
    )

    /* this.itemsRef.update(seat.$key, {
      user: seat.user,
      chekedByAnotherUser: seat.chekedByAnotherUser,
      scheduledCheckout: seat.scheduledCheckout
    }); */
  }

  public scheduleCheckout(seat: Seat, options: {scheduledCheckout: string}): Promise<void> {
    let objRef = this.firebaseService.getObject(`${this.formatPath(seat)}/checkin`);
    return objRef.update({scheduledCheckout: options.scheduledCheckout});
  }

}
