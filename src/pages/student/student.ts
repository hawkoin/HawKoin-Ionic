import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { HttpClient } from '@angular/common/http';
import { cloudUrl } from '../../app/app.module';


@Component({
  selector: 'page-student',
  templateUrl: 'student.html'
})
export class StudentPage {

  studentID = localStorage.getItem("StudentNum"); //retrieves student number from local storage
  balance = null; //variable to store balance
  name: String = ""; //variable to store name
  //url is the server + student num used for htp requests
  url: string = cloudUrl + 'org.hawkoin.network.student/' + this.studentID;
  authToken: String = localStorage.getItem("Token"); //retrieves token that was stored in login
  QRData: String = this.studentID + " " + this.authToken; //data for qr code

  constructor(public navCtrl: NavController, private http: HttpClient) {
    this.http.get(cloudUrl + 'org.hawkoin.network.student/' + this.studentID).subscribe((response) => { //gets student name from Fabric and displays it upon page load
      var parsedJ = JSON.parse(JSON.stringify(response));
      document.getElementById("welcome-heading1").innerHTML = "Welcome, " + parsedJ.contactInfo.firstName + " " + parsedJ.contactInfo.lastName;
    });

  }

  /**
   * New method to abstract the http get request form the constructor
   * @param http 
   * @param url 
   */
  httpRequest(http: HttpClient, url: string): any {
    //private http = new HttpClient(); 
    this.http.get(url).subscribe((response) => {
      return response;
    });
  }

  toggleBalance(): void { //called when balance is to be toggled
    var text = document.getElementById("student-heading2"); //gets html id for label
    var buttonText = document.getElementById("student-button3"); //get htnl id for burron

    if (text.hidden) { //runs if text is currently hidden

      this.http.get(cloudUrl + 'org.hawkoin.network.student/' + this.studentID).subscribe((response) => {
        var parsedJ = JSON.parse(JSON.stringify(response)); //parses response from fabric
        text.innerHTML = "Balance: $" + parsedJ.balance; //writes balance to label
      });

      text.hidden = false; //unhides the text
      buttonText.textContent = "Hide Balance"; //updates button to hide balance
    } else { //hides the balance
      text.hidden = true; //hides the text
      buttonText.textContent = "Show Balance"; //updates button to show balance
    }
  }

}
