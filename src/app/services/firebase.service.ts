import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Quote } from '@angular/compiler';
import { users } from '../interfaces/users';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(private firebaseAuth: AngularFireAuth, private db: AngularFirestore) { 
  }

  async login(email: string, password: string, users: Array<any>){
    users = await this.getAllUsers();
    users.forEach(user => {
      if(user.email == email && user.senha == password){
        sessionStorage.setItem('isLoggedIn', 'True');
        sessionStorage.setItem('email', email);
        window.location.href = "/home";
      }      
    });
  }

  async register(email: string, password: string, name: string){
    const user = this.db.collection<users>('user');
    user.add({ nome: name, email: email, senha: password, saldo: 0, root: false});
    window.location.href = "";
  }

  logout(){
    this.firebaseAuth.signOut();
    localStorage.removeItem('user');
    sessionStorage.setItem('isLoggedIn', 'False');
    window.location.href = "";
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
