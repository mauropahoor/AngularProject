import { Component, OnInit, Input } from '@angular/core';
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
    this.firebaseService.checkLogin();
    this.isRoot(); //Need to finish
  }

  data = sessionStorage.getItem('isLoggedIn');
  root = false;

  users: users[] = [];
  async getUsers(){
    this.users = await this.firebaseService.getAllUsers();
    console.log(this.users);
  }

  isRoot(){ //Need to finish
    if(this.firebaseService.isRoot() == true)
      this.root = true;
  }
}
