import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Quote } from '@angular/compiler';
import { users } from '../interfaces/users';
import { waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  emmitLoginStatus = new EventEmitter();
  emmitEmail = new EventEmitter();

  loggedEmail = ""; //Actual logged email
  isLoggedIn = false;

  constructor(private db: AngularFirestore, private route: Router) { 
    
  }

  async checkLogin(){
    if(this.isLoggedIn == false){
      this.route.navigate(['/']);  
    }
  }

  async login(email: string, password: string, users: Array<any>){
    users = await this.getAllUsers();
    users.forEach(user => {
      if(user.email == email && user.senha == password){
        this.emmitLoginStatus.emit(true);
        this.isLoggedIn = true;
        this.emmitEmail.emit(email);
        this.loggedEmail = email;
        this.route.navigate(['/home']);    
      }      
    });
  }

  async register(username: string, password: string, name: string){
    const user = this.db.collection('/user');
    user.add({ nome: name, email: username, senha: password, saldo: 0, root: false });
    return true;
  }

  async editUser(id: string, email: string, password: string, name: string, balance: string, root: boolean){
    const db = this.db.collection('user');
    db.doc(id).update({email: email, senha: password, nome: name, saldo: balance, root: root});
  }

  async deleteUser(id: string){
    const db = this.db.collection('/user');
    db.doc(id).delete();
  }

  async logout(){
    this.emmitLoginStatus.emit("False");
  }

  getAllUsers() {
    return new Promise<any>((resolve)=> {
      this.db.collection('user').valueChanges({ idField: 'id'}).subscribe(users => resolve(users));
    })
  }
  isRoot(){ //Return logged account attributes
    const user = this.db.collection<users>('user');
    return new Promise<any>((resolve)=> {
      this.db.collection('user', ref => ref.where('email', '==', this.loggedEmail)).valueChanges({ idField: 'id'}).subscribe(account => resolve(account));
    })
  }
}
