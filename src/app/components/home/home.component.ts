import { Component, OnInit } from '@angular/core';
import { numbers } from 'src/app/interfaces/numbers';
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
  }

  data = sessionStorage.getItem('isLoggedIn');

  test = true;

  numbers: numbers[] = [
    {num: 0, owner: "null"},
    {num: 1, owner: "null"},
    {num: 2, owner: "mauro"}
  ];

}
