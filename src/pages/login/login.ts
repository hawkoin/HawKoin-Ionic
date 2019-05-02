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

import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  user: Observable<firebase.User>;
  accessToken : string = null;
  email : string = null;

  choice: string = null; //page selection variable
  vend: string = null; //vendor number variable
  stud: string = null; //student number variable

  constructor(public navCtrl: NavController, private afAuth: AngularFireAuth, 
    private gplus: GooglePlus,
    private platform: Platform, private http: HttpClient) {
      this.user = this.afAuth.authState;
  }

  navigateToNextPage(): void { //called when login button is pressed
    console.log("AT NAV" + this.email);

    //verify with backend that user is student
    this.http.get("http://35.188.189.147:3000/api/org.hawkoin.network.Student?filter=%7B%22where%22%3A%20%7B%22contactInfo.email%22%3A%20%22" + this.email +"%22%7D%20%7D"
    ).subscribe((response) => { //gets student name from Fabric and displays it upon page load
      console.log(response);
      var parsedJ = JSON.parse(JSON.stringify(response));
     if(parsedJ.length && parsedJ[0].$class == "org.hawkoin.network.Student")
     {
       localStorage.setItem("StudentNum", parsedJ[0].id); //stores student number in local storage
       localStorage.setItem("Token", this.accessToken); //stores student number in local storage
       this.navCtrl.push(StudentPage); //navigates to student 
     }
  }); 

    //verify with backend that user is faculty
    this.http.get("http://35.188.189.147:3000/api/org.hawkoin.network.Faculty?filter=%7B%22where%22%3A%20%7B%22contactInfo.email%22%3A%20%22" + this.email +"%22%7D%20%7D"
    ).subscribe((response) => { //gets student name from Fabric and displays it upon page load
     var parsedJ = JSON.parse(JSON.stringify(response));
     if(parsedJ.length && parsedJ[0].$class == "org.hawkoin.network.Faculty")
     {
       localStorage.setItem("StudentNum", parsedJ[0].id); //stores student number in local storage
       localStorage.setItem("Token", this.accessToken); //stores student number in local storage
       this.navCtrl.push(StudentPage); //navigates to student 
     }
  }); 

 
 //verify with backend that user is vendor
 this.http.get("http://35.188.189.147:3000/api/org.hawkoin.network.Vendor?filter=%7B%22where%22%3A%20%7B%22contactInfo.email%22%3A%20%22" + this.email +"%22%7D%20%7D"
 ).subscribe((response) => { //gets student name from Fabric and displays it upon page load
  var parsedJ = JSON.parse(JSON.stringify(response));
  console.log("RESSSSSPONE" + response);
  if(parsedJ.length && parsedJ[0].$class == "org.hawkoin.network.Vendor")
  {
    localStorage.setItem("VendorNum", parsedJ[0].id); //stores student number in local storage
    localStorage.setItem("Token", this.accessToken); //stores student number in local storage
    this.navCtrl.push(VendorPage); //navigates to student 
  }
}); 

 //verify with backend that user is admin
 this.http.get("http://35.188.189.147:3000/api/org.hawkoin.network.Administrator?filter=%7B%22where%22%3A%20%7B%22contactInfo.email%22%3A%20%22" + this.email +"%22%7D%20%7D"
 ).subscribe((response) => { //gets student name from Fabric and displays it upon page load
  var parsedJ = JSON.parse(JSON.stringify(response));
  if(parsedJ.length && parsedJ[0].$class == "org.hawkoin.network.Administrator")
  {
    localStorage.setItem("Token", this.accessToken); //stores student number in local storage
    this.navCtrl.push(AdminPage); //navigates to student 
  }
}); 

if (this.choice == "Receipt") {
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
  
      const credential = await this.afAuth.auth.signInWithCredential(
        firebase.auth.GoogleAuthProvider.credential(gplusUser.idToken)
        )

        this.accessToken = gplusUser.accessToken;
        this.email = credential.email;

        return credential;
    } catch(err) {
      console.log(err)
    }
  }

  async webGoogleLogin(): Promise<void> {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      const credential = await this.afAuth.auth.signInWithPopup(provider);
      console.log(credential);
      this.accessToken = credential.credential['accessToken'];
      this.email = credential.additionalUserInfo.profile['email'];
      this.navigateToNextPage();
    } catch(err) {
      console.log(err);
    }
  
  }

  googleLogin() {
    if (this.platform.is('cordova')) {
      this.nativeGoogleLogin();
      this.navigateToNextPage();
    } else {
      this.webGoogleLogin();
    }
  }

  
  signOut() {
    this.afAuth.auth.signOut().then(() => {window.location.assign('https://accounts.google.com/Logout');});
  }


}
