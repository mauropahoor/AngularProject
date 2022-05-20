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

  async createGame(length: number) {
    const db = this.db.collection('numbers');
    let numbers: numbers[] = await this.getAllNumbers();  
    for(let i = 0; i < numbers.length; i++){ //Delete old numbers  
      let id = numbers[i].id;
      let idString = id.toString();
      db.doc(idString).delete();
    }
    db.doc('status').update({winner: '' });
    for(let i = 1; i <= length; i++){ //Create a new one
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
    }) //Get id of the number to be bought
    let price = await new Promise<any>((resolve)=> {
      this.db.collection('numbers', ref => ref.where('number', '==' , number)).doc('status').valueChanges({ idField: 'id'}).subscribe(number => resolve(number));
    })  
    console.log("Numero: ", id);
    console.log("Conta: ", this.accountData[0].nome);
    console.log("Id da conta", this.accountData[0].id);
    console.log("Preço: ",price.price);
    let newBalance = this.accountData[0].saldo - price.price;
    this.db.collection('numbers').doc(id).update({ owner: this.accountData[0].nome });
    this.db.collection('user').doc(this.accountData[0].id).update({ saldo: newBalance});
  }

  async checkNumber(number: number){
    let numberStatus = await new Promise<any>((resolve)=> {
      this.db.collection('numbers', ref => ref.where('number', '==' , number)).valueChanges({ idField: 'id'}).subscribe(number => resolve(number));
    });
    if(numberStatus[0].owner == 'null' )
      return true
    else
      return false


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

  async createResult(number: numbers[]){
    const db = this.db.collection('numbers');
    let numbers: numbers[] = await this.getAllNumbers();    
    let min = Math.ceil(0);
    let max = Math.floor(numbers.length);
    let result = Math.floor(Math.random() * (max - min + 1)) + min;
    let winnerName = number[result].owner;
    db.doc('status').update({winner: winnerName });
  }

  async getWinner(){
    return new Promise<any>((resolve)=>{
      this.db.collection('numbers').doc('status').valueChanges({ idField: 'id' }).subscribe(winner => resolve(winner));
    })
  }
}
