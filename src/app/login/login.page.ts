//login code source: https://angularfirebase.com/lessons/ionic-google-login-with-firebase-and-angularfire/

import { Component } from '@angular/core';
import { NavController } from '@ionic/angular'

import * as firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs/Observable';

import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Platform } from '@ionic/angular';

import { HttpClient } from '@angular/common/http';
import { cloudUrl, httpOptions } from '../app.module';

@Component({
  selector: 'page-login',
  templateUrl: 'login.page.html'
})
export class LoginPage {

  user: Observable<firebase.User>; //firebase user
  accessToken: string = null; //Google access token string
  email: string = null; //Google email token string

  constructor(private afAuth: AngularFireAuth, private navCtrl: NavController,
    private gplus: GooglePlus,
    private platform: Platform, private http: HttpClient) {

    this.user = this.afAuth.authState; //initialize firbase user
    this.afAuth.auth.getRedirectResult().then( //gets the result from a redirect
      (result) => {
        if (result.user) { //checks if the result's user is valid
          this.email = result.user.email; //stores email
          this.accessToken = result.credential['accessToken']; //stores access token
          this.navigateToNextPage(); //calls navigate to next page
        }
      }
    ).catch(function (error) {
      console.log(error); //logs errors
    });

  }

  navigateToNextPage(): void { //called when login button is pressed

    //verify with backend that user is student
    this.http.get(cloudUrl + 'org.hawkoin.network.Student?filter=%7B%22where%22%3A%20%7B%22contactInfo.email%22%3A%20%22' + this.email + '%22%7D%20%7D', httpOptions
    ).subscribe((response) => {
      var parsedJ = JSON.parse(JSON.stringify(response));
      if (parsedJ.length && parsedJ[0].$class == "org.hawkoin.network.Student") {
        localStorage.setItem("IDNum", parsedJ[0].id); //stores student number in local storage
        localStorage.setItem("ClassType", parsedJ[0].$class);
        localStorage.setItem("Token", this.accessToken); //stores student token in local storage
        this.navCtrl.navigateForward(['/spender']); //navigates to spender 
      }
      else {
        //verify with backend that user is faculty
        this.http.get(cloudUrl + 'org.hawkoin.network.Faculty?filter=%7B%22where%22%3A%20%7B%22contactInfo.email%22%3A%20%22' + this.email + '%22%7D%20%7D', httpOptions
        ).subscribe((response) => {
          var parsedJ = JSON.parse(JSON.stringify(response));
          if (parsedJ.length && parsedJ[0].$class == "org.hawkoin.network.Faculty") {
            localStorage.setItem("IDNum", parsedJ[0].id); //stores faculty number in local storage
            localStorage.setItem("ClassType", parsedJ[0].$class);
            localStorage.setItem("Token", this.accessToken); //stores faculty token in local storage
            this.navCtrl.navigateForward(['/spender']); //navigates to spender 
          }
          else {
            //verify with backend that user is vendor
            this.http.get(cloudUrl + 'org.hawkoin.network.Vendor?filter=%7B%22where%22%3A%20%7B%22contactInfo.email%22%3A%20%22' + this.email + '%22%7D%20%7D', httpOptions
            ).subscribe((response) => {
              var parsedJ = JSON.parse(JSON.stringify(response));
              if (parsedJ.length && parsedJ[0].$class == "org.hawkoin.network.Vendor") {
                localStorage.setItem("IDNum", parsedJ[0].id); //stores vendor number in local storage
                localStorage.setItem("ClassType", parsedJ[0].$class);
                localStorage.setItem("Token", this.accessToken); //stores vendor token in local storage
                this.navCtrl.navigateForward(['/vendor']); //navigates to vendor 
              }
              else {
                //verify with backend that user is admin
                this.http.get(cloudUrl + 'org.hawkoin.network.Administrator?filter=%7B%22where%22%3A%20%7B%22contactInfo.email%22%3A%20%22' + this.email + '%22%7D%20%7D', httpOptions
                ).subscribe((response) => {
                  var parsedJ = JSON.parse(JSON.stringify(response));
                  if (parsedJ.length && parsedJ[0].$class == "org.hawkoin.network.Administrator") {
                    localStorage.setItem("IDNum", parsedJ[0].id); //stores vendor number in local storage
                    localStorage.setItem("ClassType", parsedJ[0].$class);
                    localStorage.setItem("Token", this.accessToken); //stores admin token in local storage
                    this.navCtrl.navigateForward(['/admin']); //navigates to admin 
                  }
                  else {
                    //display login error
                    window.alert("Error: Your HawKoin account has not been set up. Please contact HawKoin support at dar220@lehigh.edu for assistance.");
                  }
                });
              }
            });
          }
        });
      }
    });
  }

  async nativeGoogleLogin(): Promise<firebase.User> { //native cordova google login
    try {
      const gplusUser = await this.gplus.login({
        'webClientId': '450929965097-n1j7pbt94akt631v9bqdbf65qf2lk45a.apps.googleusercontent.com',
        'offline': true,
        'scopes': 'profile email'
      }); //signs in with native popup using popup

      const credential = await this.afAuth.auth.signInWithCredential(
        firebase.auth.GoogleAuthProvider.credential(gplusUser.idToken)
      ); //signs into firebase with credentials provided

      //stores credential information
      this.accessToken = gplusUser.accessToken;
      this.email = credential.email;

      this.navigateToNextPage(); //calls navigate to next page

      return credential; //returns credential to calling function

    } catch (err) {
      console.log(err); //log error
    }
  }

  async webGoogleLogin(): Promise<void> { //web google login

    try {
      const provider = new firebase.auth.GoogleAuthProvider().setCustomParameters({ prompt: 'select_account' }); //set up Google as a login provider with a select account prompt

      await this.afAuth.auth.signInWithRedirect(provider); //signs in using a redirect through firebase

    } catch (err) {
      console.log(err); //log error
    }

  }

  async webCheck(): Promise<void> { //refreshs data if user is already logged into google on web

    try {
      const provider = new firebase.auth.GoogleAuthProvider(); //set up Google as a login provider
      await this.afAuth.auth.signInWithRedirect(provider); //signs in using a redirect

    } catch (err) {
      console.log(err); //log error
    }

  }

  nextPage() { //called when user clicks the continue button 

    if (this.platform.is('cordova')) { //calls native login
      this.nativeGoogleLogin();
    } else {  //calls web check
      this.webCheck();
    }

  }

  googleLogin() { //called when user clicks the login button

    if (this.platform.is('cordova')) { //calls native login
      this.nativeGoogleLogin();
    } else {  //calls web login
      this.webGoogleLogin();
    }

  }


  signOut() { //called when user clicks the signout button

    this.afAuth.auth.signOut().then(() => { //signs out of google through firebase

      if (this.platform.is('cordova')) { //runs only on cordova
        this.gplus.logout(); //signs out of native google plugin
      }

    });

  }

  showGuide() { //displays the user guide on google drive using system browser
    window.open('https://drive.google.com/open?id=1jes1QwQE08pRzHLoi_iJQHumYFIFjNofqjV-_hozmcI', '_system');
  }

}