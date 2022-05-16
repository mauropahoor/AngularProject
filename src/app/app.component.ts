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
    this.firebaseService.emmitLoginStatus.subscribe( status => this.isLoggedIn = status );
    this.firebaseService.emmitEmail.subscribe( email => this.email = email );
  }

  isLoggedIn = "";

  email = "";

  title = 'SiteSorteios';

  logout(){
    this.firebaseService.logout();
  }
}
