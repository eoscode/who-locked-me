import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

import { FirebaseService } from '../firebase/firebase-service';

import { User } from 'models/app-models';

import { Observable } from 'rxjs/Observable';

import * as firebase from "firebase/app";

@Injectable()
export class UserService {

  public currentUser: User;

  constructor(
    public firebaseService: FirebaseService,
    public storage: Storage
  ) {

  }

  public async creatUser(user: User): Promise<void> {
    let itemRef = this.firebaseService.getObject(`/users/${user.uid}`);
    return await itemRef.set(user);
  }

  public isExist(uid: string): Observable<boolean> {
    return this.firebaseService.query('/users',
      (ref) => ref.orderByChild('uid').equalTo(uid)
      ).valueChanges()
      .map((users: User[]) => {
          return users.length > 0;
        })
  }

 public checkUserAccount(user: firebase.User): Observable<User> {
    //firebase.database.Reference
  return this.firebaseService.query('/users',
    (ref) => ref.orderByChild('uid').equalTo(user.uid)
    ).valueChanges()
    //.first()
    .map((users: User[]) => {
      if (users.length == 0) {
        return null;
      } else {
        return users[0];
      }
      })
  }

  public async createUserAccount(auth: firebase.User): Promise<void> {
    let user: User = {};
    user.uid = auth.uid;
    user.name = auth.displayName;
    user.picture = auth.photoURL;
    user.email = auth.email;
    user.phone = auth.phoneNumber;

    return await this.creatUser(user);
  }

  getProfile(): Promise<User> {
    return this.storage.get('currentUser');
  }

  setProfile(user: User) {
    return this.storage.set('currentUser', user);
  }

}
