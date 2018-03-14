import { Injectable } from '@angular/core';
import { GapiService } from './gapi.service';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class UserService {

  public currentUser: Observable<any|null>;

  constructor(private gapi: GapiService) {
    this.currentUser = this.gapi.authState;
  }

  signIn() {
    return this.gapi.signIn();
  }

  signOut() {
    return this.gapi.signOut();
  }

}
