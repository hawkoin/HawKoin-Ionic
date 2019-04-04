import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'page-student',
  templateUrl: 'student.html'
})
export class StudentPage {

  choice = null;
  studentID = 1234;
  balance = null;

  constructor(public navCtrl: NavController,private http: HttpClient) {
  }

  toggleBalance(): void {
    var text = document.getElementById("student-markdown2");
    var buttonText = document.getElementById("student-button3");

  if (text.hidden) {

    this.http.get('http://35.188.189.147:3000/api/org.hawkoin.network.student/' + this.studentID).subscribe((response) => {
    var parsedJ =  JSON.parse(JSON.stringify(response))
    text.innerHTML = parsedJ.contactInfo.firstName + " " + parsedJ.contactInfo.lastName  + " Balance: " + parsedJ.balance;
       });

    text.hidden = false;
    buttonText.textContent = "Hide Balance"
  } else {
    text.hidden = true;
    buttonText.textContent = "Show Balance"
  }
  }
  
}
