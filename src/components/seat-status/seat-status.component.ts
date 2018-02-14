import { Component, Input } from '@angular/core';

import { UserService } from '../../providers/user/user-service';

import { Seat, User } from 'models/app-models';

@Component({
  selector: 'wlm-seat-status',
  templateUrl: 'seat-status.component.html'
})
export class SeatStatusComponent {

  @Input() seat: Seat;

  constructor(
    private userService: UserService
  ) {
   // console.log(this.seat)
  }

  get label(): string {
    if (this.seat.checkin == null) {
      return "Livre";
    } else {
      let user = this.seat.checkin.user;
      return user.name.split(" ")[0];
    }
  }

  get statusSeat() {
    let user: User = this.userService.currentUser;
    if (
      (user != null && user.currentSeat != null) &&
        user.currentSeat.uid == this.seat.uid
    ) {
      return "icon-seat-off-user icon-car";
    } else if (this.seat.checkin != null) {
      if (this.seat.checkin.scheduledCheckout != null) {
        return "icon-seat-off-schedule icon-car";
      } else {
        return "icon-card-off icon-car";
      }
    } else {
      return "icon-seat-on icon-car";
    }


    /* } else if (this.seat.scheduledCheckout != null) {
      return "icon-seat-off-schedule icon-car";
    } else {
      if (this.seat.checkin == null) {
        return "icon-seat-on icon-car";
      } else {
        return "icon-card-off icon-car";
      }
    } */
  }

  get statusCheckIn() {
    if (this.seat.checkin == null) {
      return "seat-on";
    } else {
      if (this.seat.checkin.user.external) {
        return "seat-off-external-user";
      } else {
        return "seat-off";
      }
    }

  }

}
