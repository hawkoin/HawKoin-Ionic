//source: https://angularfirebase.com/lessons/ionic-google-login-with-firebase-and-angularfire/

import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import * as firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs/Observable';

import { GooglePlus } from '@ionic-native/google-plus';
import { Platform } from 'ionic-angular';

import { StudentPage } from "../student/student"
import { VendorPage } from "../vendor/vendor"
import { AdminPage } from "../admin/admin"
import { ReceiptPage } from '../receipt/receipt';


@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  user: Observable<firebase.User>;

  choice: string = null; //page selection variable
  vend: string = null; //vendor number variable
  stud: string = null; //student number variable

  constructor(public navCtrl: NavController, private afAuth: AngularFireAuth, 
    private gplus: GooglePlus,
    private platform: Platform) {
      this.user = this.afAuth.authState;
  }

  navigateToNextPage(studentNum, vendorNum): void { //called when login button is pressed

    localStorage.setItem("StudentNum", this.stud); //stores student number in local storage
    localStorage.setItem("VendorNum", this.vend); //stores vendor number in local storage

    if (this.choice == "Student") {
      this.navCtrl.push(StudentPage); //navigates to student 
    }
    else if (this.choice == "Vendor") {
      this.navCtrl.push(VendorPage); //naviagtes to vendor
    }
    else if (this.choice == "Admin") {
      this.navCtrl.push(AdminPage); //navigates to admin
    }
    else if (this.choice == "Receipt") {
      this.navCtrl.push(ReceiptPage); //navigates to receipt
    }
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
      console.log(err);
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
