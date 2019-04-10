import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'page-student',
  templateUrl: 'student.html'
})
export class StudentPage {

  studentID = localStorage.getItem("StudentNum"); //retrieves student number from local storage
  balance = null; //variable to store balance
  name: String = ""; //variable to store name

  constructor(public navCtrl: NavController, private http: HttpClient) {
    this.http.get('http://35.188.189.147:3000/api/org.hawkoin.network.student/' + this.studentID).subscribe((response) => { //gets student name from Fabric and displays it upon page load
      var parsedJ = JSON.parse(JSON.stringify(response));
      document.getElementById("welcome-heading1").innerHTML = "Welcome, " + parsedJ.contactInfo.firstName + " " + parsedJ.contactInfo.lastName;
    });

  }

  toggleBalance(): void { //called when balance is to be toggled
    var text = document.getElementById("student-heading2"); //gets html id for label
    var buttonText = document.getElementById("student-button3"); //get htnl id for burron

    if (text.hidden) { //runs if text is currently hidden

      this.http.get('http://35.188.189.147:3000/api/org.hawkoin.network.student/' + this.studentID).subscribe((response) => {
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
