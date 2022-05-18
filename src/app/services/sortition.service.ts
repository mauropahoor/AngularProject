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
  }

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

  accountData: users[] = [];
  async buyNumber(number: number, email: string){
    this.accountData = await new Promise<any>((resolve)=> {
      this.db.collection('user', ref => ref.where('email', '==', email)).valueChanges({ idField: 'id'}).subscribe(account => resolve(account));
    })
    let id = await new Promise<any>((resolve)=> {
      this.db.collection('numbers', ref => ref.where('number', '==' , number)).valueChanges({ idField: 'id'}).subscribe(number => resolve(number[0].id));
    }) 
    console.log("Numero: ", id);
    console.log("Conta: ", this.accountData[0].nome);
    this.db.collection('numbers').doc(id).update({ owner: this.accountData[0].nome });
  }

  changePrice(number: number){
    const db = this.db.collection('numbers');
    db.doc('status').update({price: number });
  }

  getPrice(){
    return new Promise<any>((resolve)=>{
      this.db.collection('numbers').doc('status').valueChanges({ idField: 'id' }).subscribe(price => resolve(price));
    })
  }
}
