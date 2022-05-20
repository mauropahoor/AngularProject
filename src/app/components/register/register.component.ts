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

  showMessage = false;

  error = [
    {type: 'noName', description: 'Não deixe o campo de nome vazio!'},
    {type: 'noPassword', description: 'Não deixe o campo de senha vazio!'},
    {type: 'noEmail', description: 'Não deixe o campo de email vazio!'},
    {type: 'emailAlreadyUsed', description: 'Este email ja foi utilizado!'},
  ];

  message: string = "";
  async register(email: string, password: string, name: string){
    let emailCheck: users[] = [];
    emailCheck = await this.firebaseService.checkEmail(email);
    this.showMessage = true;
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
    else{
      await this.firebaseService.register(email, password, name);
      this.message = "Registro concluido!";
    }
    setTimeout(() => { this.showMessage = false; }, 3000);
  }

}
