import { Component, OnInit, Input } from '@angular/core';
import { user } from '@angular/fire/auth';
import { users } from 'src/app/interfaces/users';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(public firebaseService: FirebaseService) { }

  ngOnInit(): void {
    this.isRoot();
  }

  root = false;
  editForm = false;

  users: users[] = [];
  account: users[] = [];

  async getUsers(){
    this.users = await this.firebaseService.getAllUsers();
    console.log(this.users);
  }

  async deleteUser(id: string){
    this.firebaseService.deleteUser(id);
    this.users = await this.firebaseService.getAllUsers();
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

  async openEditForm(){
    this.editForm = true;
  }

  async editUser(id:string, email: string, password: string, name: string, balance: string, root: boolean){
    this.firebaseService.editUser(id, email, password, name, balance, root);
    //Need to finish
  }
}
