import { Component, OnInit, AfterViewInit } from '@angular/core';
import { UserService } from '../core/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {

  constructor(private user: UserService) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    // const buttonOptions = {
    //   'scope': 'profile email',
    //   'width': 240,
    //   'height': 50,
    //   'longtitle': true,
    //   'theme': 'dark',
    //   'onfailure': this.loginError.bind(this)
    // };

    // this.gapi.renderSignin(document.getElementById('googleBtn'), buttonOptions);
  }

  loginError(user) {
    console.log(user);
  }

}
