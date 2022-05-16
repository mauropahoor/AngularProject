import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(public firebaseService: FirebaseService) { }

  ngOnInit(): void {
  }

  registerSucess = false;

  async register(email: string, password: string, name: string){
    if(await this.firebaseService.register(email, password, name)){
      this.registerSucess = true;
    }
    else{
      alert("Falha no registro");
    }
  }

}
