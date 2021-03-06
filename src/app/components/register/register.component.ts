import { Component, OnInit } from '@angular/core';
import { users } from 'src/app/interfaces/users';
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


  error = [
    {type: 'noName', description: 'Não deixe o campo de nome vazio!'},
    {type: 'noPassword', description: 'Não deixe o campo de senha vazio!'},
    {type: 'noEmail', description: 'Não deixe o campo de email vazio!'},
    {type: 'emailAlreadyUsed', description: 'Este email ja foi utilizado!'},
    {type: 'invalidEmail', description: 'Digite um email válido!'}
  ];

  message: string = "";
  async register(email: string, password: string, name: string){
    let emailCheck: users[] = [];
    emailCheck = await this.firebaseService.checkEmail(email);
    if(name == ''){
      this.message = this.error[0].description;
    }
    else if(email == ''){
      this.message = this.error[2].description;
    }
    else if(password == ''){
      this.message = this.error[1].description;
    }
    else if(emailCheck.length > 0){ //Check if have one or more accounts with this email
      this.message = this.error[3].description;
    }
    else if(this.validateEmail(email)){
      this.message = this.error[4].description;
    }
    else{
      await this.firebaseService.register(email, password, name);
      this.message = "Registro concluido!";
    }
    setTimeout(() => { this.message = ""; }, 3000);
  }

  validateEmail (emailAdress: string){
    let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (emailAdress.match(regexEmail)) {
      return false; 
    } else {
      return true; //Return true if the string isnt in a email type 
    } 
  }

}
