//source: https://angularfirebase.com/lessons/ionic-google-login-with-firebase-and-angularfire/

import { Component } from '@angular/core';

import * as firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs/Observable';

import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Platform } from '@ionic/angular';


@Component({
  selector: 'google-l',
  templateUrl: 'google-l.html'
})
export class GoogleLComponent {

  user: Observable<firebase.User>;

  constructor(private afAuth: AngularFireAuth, 
              private gplus: GooglePlus,
              private platform: Platform) {

    this.user = this.afAuth.authState;

  }

  async nativeGoogleLogin(): Promise<firebase.User> {
    try {
  
      const gplusUser = await this.gplus.login({
        'webClientId': '450929965097-n1j7pbt94akt631v9bqdbf65qf2lk45a.apps.googleusercontent.com',
        'offline': true,
        'scopes': 'profile email'
      })
  
      return await this.afAuth.auth.signInWithCredential(
        firebase.auth.GoogleAuthProvider.credential(gplusUser.idToken)
        )
  
    } catch(err) {
      console.log(err)
    }
  }

  async webGoogleLogin(): Promise<void> {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      const credential = await this.afAuth.auth.signInWithPopup(provider);
      console.log(credential);
  
    } catch(err) {
      console.log(err)
    }
  
  }

  googleLogin() {
    if (this.platform.is('cordova')) {
      this.nativeGoogleLogin();
    } else {
      this.webGoogleLogin();
    }
  }
  
  signOut() {
    this.afAuth.auth.signOut();
  }




}