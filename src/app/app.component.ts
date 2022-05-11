import { Component } from '@angular/core';
import { FirebaseService } from './services/firebase.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(public firebaseService: FirebaseService) {

   }
  
  ngOnInit(): void {
  }

  isLoggedIn = sessionStorage.getItem('isLoggedIn');

  email = sessionStorage.getItem('email');

  title = 'AngularProject';

  logout(){
    this.firebaseService.logout();
  }
}
