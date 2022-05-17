import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { numbers } from '../interfaces/numbers';
import { users } from '../interfaces/users';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root'
})
export class SortitionService {

  constructor(private db: AngularFirestore, private firebaseService: FirebaseService) {
    this.firebaseService.emmitEmail.subscribe( email => this.loggedEmail = email );
   }

  loggedEmail = "";

  getAllNumbers() {
    return new Promise<any>((resolve)=> {
      this.db.collection('numbers', ref => ref.orderBy('number')).valueChanges({ idField: 'id'}).subscribe(numbers => resolve(numbers));
    })
  }

  createGame(length: number) {
    const db = this.db.collection('numbers');
    for(let i = 1; i <= length; i++){
      db.add({owner: 'null', number: i})
    }
  }

  numberSelected: any[] = [];
  account: any[] = [];
  buyNumber(number: number){ //SOLVE BUG
    const db = this.db.collection('numbers');
    this.db.collection('numbers', ref => ref.where('number', '==' , number)).valueChanges({ idField: 'id'}).subscribe(number => this.numberSelected = number);
    this.db.collection('user', ref => ref.where('email', '==', this.loggedEmail)).valueChanges({ idField: 'id'}).subscribe(account => this.account = account);
    const id = this.numberSelected[0].id;
    console.log("ONOME", this.account[0].nome);
    db.doc(id).update({owner: this.account[0].nome });
  }
}
