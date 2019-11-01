import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

import { HttpClient } from '@angular/common/http';
import { cloudUrl, httpOptions } from '../app.module';
import { LoginPage } from '../login/login.page';



@Component({
  selector: 'page-student',
  templateUrl: 'student.page.html'
})
export class StudentPage {

  studentID = localStorage.getItem("StudentNum"); //retrieves student number from local storage
  balance = null; //variable to store balance
  name: String = ""; //variable to store name
  //url is the server + student num used for htp requests
  url: string = cloudUrl + 'org.hawkoin.network.student/' + this.studentID;
  authToken: String; //retrieves token that was stored in login
  QRData: String; //data for qr code
  isRunning: boolean = false;


  constructor(public navCtrl: NavController, private http: HttpClient) {
    LoginPage.user.getIdToken().then((token) => {
      this.authToken = token;
      this.QRData = this.studentID + " " + this.authToken;
    });

    this.http.get(cloudUrl + 'org.hawkoin.network.student/' + this.studentID).subscribe((response) => { //gets student name from Fabric and displays it upon page load
      var parsedJ = JSON.parse(JSON.stringify(response));
      document.getElementById("welcome-heading1").innerHTML = "Welcome, " + parsedJ.contactInfo.firstName + " " + parsedJ.contactInfo.lastName;
    });

    this.refreshData();

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
      text.hidden = false; //unhides the text
      buttonText.textContent = "Hide Balance"; //updates button to hide balance
    } else { //hides the balance
      text.hidden = true; //hides the text
      buttonText.textContent = "Show Balance"; //updates button to show balance
    }
  }

  refreshData(): void //method to refresh transaction list
  {
    if (!this.isRunning) {
      this.http.get(cloudUrl + 'org.hawkoin.network.InProgress' + '?filter=%7B%22where%22%20%3A%20%7B%22status%22%3A%22WAITING%22%2C%20%22fromUser%22%20%3A%20%22resource%3Aorg.hawkoin.network.Student%23' + this.studentID + '%22%7D%7D').subscribe((response) => { //reguests list from Fabric
        var parsedJ = JSON.parse(JSON.stringify(response));
        if (!this.isRunning && parsedJ[0] && parsedJ[0].status == 'WAITING') {
          this.isRunning = true;
          var payload;

          if (window.confirm('Amount: ' + parsedJ[0].amount + "\nVendor: " + parsedJ[0].toUser)) {
            payload = {
              "$class": "org.hawkoin.network.InProgress",
              "amount": parsedJ[0].amount,
              "status": "CONFIRMED",
              "authToken": parsedJ[0].authToken,
              "fromUser": parsedJ[0].fromUser,
              "toUser": parsedJ[0].toUser
            }; //create payload to send to Fabric

          }
          else {
            payload = {
              "$class": "org.hawkoin.network.InProgress",
              "amount": parsedJ[0].amount,
              "status": "CANCELLED",
              "authToken": parsedJ[0].authToken,
              "fromUser": parsedJ[0].fromUser,
              "toUser": parsedJ[0].toUser
            }; //create payload to send to Fabric
          }

          this.http.put(cloudUrl + 'org.hawkoin.network.InProgress' + "/" + parsedJ[0].id, JSON.stringify(payload), httpOptions).subscribe(data => {
            console.log(data); //log response for testing
            window.alert("Confirmed/Cancelled!"); //display success in prompt
            //document.getElementById("vendor-checkbox1inner").innerHTML = "Amount: " + this.amount + " From ID: " + this.fromID + "Auth Token: " + this.authToken; //displays amount and recipient ids
            //this.check = true; //checks checkmark
            this.isRunning = false;
          }, error => { //catches errors
            console.log(error); //log response for testing
            window.alert("Error: " + error.error.error.message); //display error in prompt
            this.isRunning = false;
          });

        }

      });
    }
    var text = document.getElementById("student-heading2"); //gets html id for label
    this.http.get(cloudUrl + 'org.hawkoin.network.student/' + this.studentID).subscribe((response) => {
      var parsedJ = JSON.parse(JSON.stringify(response)); //parses response from fabric
      if (text && text.hidden) {
        text.innerHTML = "Balance: $" + parsedJ.balance; //writes balance to label
        text.hidden = true;
      }
      else if (text) {
        text.innerHTML = "Balance: $" + parsedJ.balance; //writes balance to label

      }
    });


    setTimeout(this.refreshData.bind(this), 500); //sets a timeout to refresh the list eery 2 seconds


  }


}
