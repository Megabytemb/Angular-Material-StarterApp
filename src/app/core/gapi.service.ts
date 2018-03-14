/// <reference path='../../../node_modules/zone.js/dist/zone.js.d.ts' />
import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Observable } from 'rxjs/Observable';
import { observeOn } from 'rxjs/operator/observeOn';
import { ZoneScheduler } from './zone-scheduler';
import { Observer } from 'rxjs/Observer';
import { environment } from '../../environments/environment';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import 'rxjs/add/observable/fromPromise';

class GoogleUser {
  id: string;
  fullName: string;
  firstName: string;
  lastName: string;
  avatar: string;
  email: string;
  id_token: string;
}

// GAPI is declared in platform.js on the document level
declare var gapi: any;

@Injectable()
export class GapiService {
  private readonly gapiUrl: string = 'https://apis.google.com/js/platform.js';
  private loadingGapi: Observable<boolean>;

  private $authState: ReplaySubject<GoogleUser|null>;
  public authState: Observable<GoogleUser|null>;

  private auth2: gapi.auth2.GoogleAuth;

  constructor() {
    this.$authState = new ReplaySubject(1);
    this.loadGapi().take(1).subscribe(() => {
      console.log('initial Google load');
      const user = this.auth2.currentUser.get();
      if (user.isSignedIn()) {
        const googleProfile = this.getProfile(user);
        this.$authState.next(googleProfile);
      } else {
        this.$authState.next(null);
      }

      // Set up the listener too, so we always get updates.
      this.auth2.currentUser.listen((updatedUser) => {
        if (updatedUser.isSignedIn()) {
          const googleProfile = this.getProfile(updatedUser);
          this.$authState.next(googleProfile);
        } else {
          this.$authState.next(null);
        }
      });
    });

    this.authState = observeOn.call(this.$authState.asObservable(), new ZoneScheduler(Zone.current));
  }

  public getIdToken(): Observable<string> {
    return this.loadGapi().take(1).map((res) => {
      const user = this.auth2.currentUser.get();
      if (user.isSignedIn()) {
        const idToken = this.auth2.currentUser.get().getAuthResponse().id_token;
        return idToken;
      } else {
        return null;
      }
    });
  }

  private getProfile(profile: gapi.auth2.GoogleUser) {
    const basicUser = profile.getBasicProfile();

    const user = new GoogleUser();
    user.id = basicUser.getId();
    user.fullName = basicUser.getName();
    user.firstName = basicUser.getGivenName();
    user.lastName = basicUser.getFamilyName();
    user.avatar = basicUser.getImageUrl();
    user.email = basicUser.getEmail();
    user.id_token = profile.getAuthResponse().id_token;

    return user;
  }

  private loadGapi(): Observable<boolean> {
    if (!!this.auth2) {
      // if `gapi` is available just return it as `Observable`
      return Observable.of(true);
    } else if (this.loadingGapi) {
      // if `this.loadingGapi` is set then the request is in progress
      return this.loadingGapi;
    } else {
      // we need to load GAPI
      this.loadingGapi = Observable.create((observer: Observer<boolean>) => {
        const node = document.createElement('script');
        node.src = this.gapiUrl;
        node.type = 'text/javascript';
        node.charset = 'utf-8';
        document.getElementsByTagName('head')[0].appendChild(node);
        node.onload = () => {
          // we've now loaded, so unset the observable
          this.loadingGapi = null;
          // and configure GAPI
          gapi.load('auth2', () => {
            gapi.auth2.init({
              client_id: environment.GOOGLE_CLIENT_ID,
              cookie_policy: 'single_host_origin',
              scope: 'profile email'
            }).then((auth2) => {
              this.auth2 = auth2;
              observer.next(true);
              observer.complete();
            });
          });
        };
      });
      return this.loadingGapi;
    }
  }

  public renderSignin(element, options) {
    return this.loadGapi().take(1)
    .subscribe(res => {
      return Observable.fromPromise(gapi.signin2.render(element, options));
    });
  }

  public signIn() {
    return this.loadGapi().take(1)
    .subscribe(res => {
      return Observable.fromPromise(this.auth2.signIn());
    });
  }

  public signOut() {
    return this.loadGapi().take(1)
    .subscribe(res => {
      return Observable.fromPromise(this.auth2.signOut());
    });
  }

}
