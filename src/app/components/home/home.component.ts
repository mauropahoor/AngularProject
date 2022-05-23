import { NumberSymbol } from '@angular/common';
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

  async ngOnInit() {
    await this.getAllNumbers();
    this.getUsers();
    this.isRoot();
    this.getPrice();
    this.getFilteredNumbers(this.pageSize);
    this.checkLogin(); //Check if the user is logged and not acess directly this component
  }

  root = false;
  editForm = false;

  users: users[] = [];
  account: users[] = [];
  numbers: numbers[] = [];
  price: any = [];
  numbersFiltered: numbers[] = [];
  //Front-end function:


  position = 0; //Position in table page
  pageSize = 5; //Size of each table
  getFilteredNumbers(size: number){ //Filter the table by the pageSize
    this.numbersFiltered = [];
    for(let i = this.position;i < size;i++){
      this.numbersFiltered.push(this.numbers[i]);
    }
  }

  showMessage = false
  backPageTable(){
    if(this.position > 0){
      this.numbersFiltered = [];
      this.position -= this.pageSize;
      let start = this.position;
      for(let i = start;i < start+this.pageSize;i++){
        this.numbersFiltered.push(this.numbers[i]);
      }
    }
    else{
      this.showMessage = true;
      setTimeout(() => { this.showMessage = false; }, 3000);
    }
  }

  nextPageTable(){
    if(this.position < this.numbers.length - this.pageSize){
      this.numbersFiltered = [];
      this.position += this.pageSize;
      let start = this.position;
      for(let i = start;i < start+this.pageSize;i++){
        this.numbersFiltered.push(this.numbers[i]);
      }
    }
    else{
      this.showMessage = true;
      setTimeout(() => { this.showMessage = false; }, 3000);
    }
  }
  
  //User Functions:

  async getUsers(){
    this.users = await this.firebaseService.getAllUsers();
  }

  async deleteUser(id: string){
    this.firebaseService.deleteUser(id);
    this.getUsers(); //Update in front-end list
    this.editForm = false; //Bug if the editform is opened and the user is deleted
  }

  async isRoot(){
    this.account = await this.firebaseService.loggedAccount(); //Get logged account status
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

  async editUser(id:string, email: string, password: string, name: string, balance: string){
    this.firebaseService.editUser(id, email, password, name, balance);
    this.getUsers(); //Update in front-end list
    this.editForm = false;
    //Solve bug
  }

  //Sortition Functions

  async getAllNumbers(){
    this.numbers = await this.sortitionService.getAllNumbers();
  }

  async createGame(length: string) {
    const lenghtInt = parseInt(length);
    await this.sortitionService.createGame(lenghtInt);
    this.getAllNumbers();
  }

  message: string = '';
  error = [
    {type:'Number already used', description:'Número já está em uso!'},
    {type:'No money', description:'Saldo insuficiente.'}
  ];
  async buyNumber(number: string){
    const numberInt = parseInt(number);
    const isNumberUsed = await this.sortitionService.checkNumber(numberInt); 
    if(isNumberUsed){
      let loggedEmail = this.account[0].email;
      if(this.account[0].saldo > this.price.price){  
        await this.sortitionService.buyNumber(numberInt, loggedEmail);
      }
      else{
        this.message = this.error[1].description;
        setTimeout(() => { this.message = ''; }, 3000);
      }
      await this.getAllNumbers(); //Update the data in front-end
      this.getFilteredNumbers(this.position + this.pageSize);
      this.account = await this.firebaseService.loggedAccount();
    }
    else{
      this.message = this.error[0].description;
      setTimeout(() => { this.message = ''; }, 3000);
    }
  }

  async changePrice(number: string){
    const numberInt = parseFloat(number);
    this.sortitionService.changePrice(numberInt);
    this.getPrice();
  }

  async getPrice(){
    this.price = await this.sortitionService.getPrice();
  }

  winnerName = '';
  async createResult(){
    await this.sortitionService.createResult(this.numbers);
    let winner = await this.sortitionService.getWinner();
    this.winnerName = winner.winner;
  }

}