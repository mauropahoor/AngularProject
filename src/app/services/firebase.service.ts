import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Quote } from '@angular/compiler';
import { users } from '../interfaces/users';
import { waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  userRef: AngularFirestoreCollection<users>;

  constructor(private firebaseAuth: AngularFireAuth, private db: AngularFirestore, private route: Router) { 
    this.userRef = db.collection('/user');
  }

  async login(email: string, password: string, users: Array<any>){
    users = await this.getAllUsers();
    users.forEach(user => {
      if(user.email == email && user.senha == password){
        sessionStorage.setItem('isLoggedIn', 'True');
        sessionStorage.setItem('email', email);
        this.route.navigate(['/home']);    
      }      
    });
  }

  async register(username: string, password: string, name: string){
    const user = this.db.collection('/user');
    user.add({ nome: name, email: username, senha: password, saldo: 0, root: false });
    return true;
  }

  async deleteUser(id: string){
    const db = this.db.collection('/user');
    db.doc(id).delete();
  }

  logout(){
    sessionStorage.setItem('isLoggedIn', 'False');
    this.route.navigate(['']);
  }

  checkLogin(){
    if(sessionStorage.getItem('isLoggedIn') != 'True'){
      window.location.href = "";
    }
  }

  getAllUsers() {
    return new Promise<any>((resolve)=> {
      this.db.collection('user').valueChanges({ idField: 'id'}).subscribe(users => resolve(users));
    })
  }
  isRoot(){
    const user = this.db.collection<users>('user');
    const email = sessionStorage.getItem('email');
    console.log(this.db.collection('user', ref => ref.where('root', '==', true).where('email', '==', email)));
    if(this.db.collection('user', ref => ref.where('root', '==', true).where('email', '==', email)))
    {  
      return true;
    }
    else
      return false;
    
  }
}
