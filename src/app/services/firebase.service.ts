import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(public firebaseAuth: AngularFireAuth) { 
  }

  async signin(email: string, password: string){
    try{
      await this.firebaseAuth.signInWithEmailAndPassword(email, password).then(res=>{
        sessionStorage.setItem('isLoggedIn', 'True');
        sessionStorage.setItem('email', email);
        localStorage.setItem('user', JSON.stringify(res.user))
        window.location.href = "/home"
      });
    }catch{
      alert("Erro ao fazer login");
    }
  }
  async signup(email: string, password: string){
    try{
      await this.firebaseAuth.createUserWithEmailAndPassword(email, password).then(res=>{
        localStorage.setItem('user', JSON.stringify(res.user))
        alert("Registro concluido!")
        window.location.href = ""
      });
    }catch{
      alert("Não foi possivel concluir o registro!");
    }
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
}
