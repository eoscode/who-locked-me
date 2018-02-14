declare module 'models/app-models' {

  interface Checkin {
    user?: User;
    chekedByAnotherUser?: User;
    scheduledCheckout?: string;
  }

  interface User {
    uid?: string;
    name?: string;
    username?: string;
    email?: string;
    picture?: string;
    gift?: string;
    phone?: string;
    birthday?: Date;
    external?: boolean;
    currentSeat?: Seat;
  }

  interface Garage {
    uid?: string;
    name?: string;
    seats?: Array<Seat>;
  }

  interface Seat {
    uid?: string;
    name?: string;
    checkin?: Checkin;
    garage?: Garage;
  }

}
