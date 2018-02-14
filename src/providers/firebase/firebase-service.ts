import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { AngularFireDatabase } from 'angularfire2/database';
//import { QueryFn } from 'angularfire2/database/interfaces';

@Injectable()
export class FirebaseService {

  constructor(public http: Http,
    public afDB: AngularFireDatabase) {
  }

  getObject<T>(document) {
    return this.afDB.object<T>(document);
  }

  getList<T>(document) {
    return this.afDB.list<T>(document);
  }

  addItem(document, item) {
    this.afDB.list(document).push(item);
  }

  removeItem(document, key) {
    this.afDB.list(document).remove(key);
  }

  query(document, options) {
    //return this.afDB.list(document);
    return this.afDB.list(document, options);
  }

}
