import { Component, OnInit, Input } from '@angular/core';
import { user } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { async } from '@firebase/util';
import { delay } from 'rxjs';
import { numbers } from 'src/app/interfaces/numbers';
import { users } from 'src/app/interfaces/users';
import { FirebaseService } from 'src/app/services/firebase.service';
import { SortitionService } from 'src/app/services/sortition.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(public firebaseService: FirebaseService, private route: Router, public sortitionService: SortitionService) { }

  ngOnInit(): void {
    this.getAllNumbers();
    this.isRoot();
    this.checkLogin(); //Check if the user is logged and not acess directly this component
  }

  root = false;
  editForm = false;

  users: users[] = [];
  account: users[] = [];
  numbers: numbers[] = [];

  //User Functions:

  async getUsers(){
    this.users = await this.firebaseService.getAllUsers();
  }

  async deleteUser(id: string){
    this.firebaseService.deleteUser(id);
    this.users = await this.firebaseService.getAllUsers(); //Update in front-end list
    this.editForm = false; //Bug if the editform is opened and the user is deleted
  }

  async isRoot(){
    this.account = await this.firebaseService.isRoot(); //Get logged account status
    if(this.account[0].root == true){
      this.root = true;
    }
    else{
      this.root = false;
    }
  }

  async checkLogin(){
    this.firebaseService.checkLogin();
  }

  async openEditForm(){
    this.editForm = true;
  }

  async editUser(id:string, email: string, password: string, name: string, balance: string, root: boolean){
    this.firebaseService.editUser(id, email, password, name, balance, root);
    this.users = await this.firebaseService.getAllUsers(); //Update in front-end list
    this.editForm = false;
  }

  //Sortition Functions

  async getAllNumbers(){
    this.numbers = await this.sortitionService.getAllNumbers();
  }

  async createGame(length: string) {
    const lenghtInt = parseInt(length);
    this.sortitionService.createGame(lenghtInt);
    this.numbers = await this.sortitionService.getAllNumbers();
  }

  async buyNumber(number: string){ //SOLVE BUG
    const numberInt = parseInt(number);
    this.sortitionService.buyNumber(numberInt);
    this.numbers = await this.sortitionService.getAllNumbers();
  }

}