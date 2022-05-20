import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { users } from 'src/app/interfaces/users';
import { SortitionService } from 'src/app/services/sortition.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private firebaseService: FirebaseService, private sortitionService: SortitionService) { 
    this.getWinner();
  }

  ngOnInit(): void {
  }

  winner: any = { winner: '' };
  userIncorrect = false;

  async login(email:string, password:string){
    await this.firebaseService.login(email, password, []);
    this.userIncorrect = true;
    setTimeout(() => { this.userIncorrect = false; }, 3000);
  }
  async getWinner(){
    this.winner = await this.sortitionService.getWinner();
  }
}
