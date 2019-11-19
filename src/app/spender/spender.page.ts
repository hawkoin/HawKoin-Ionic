import { Component } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';

import { HttpClient } from '@angular/common/http';
import { cloudUrl, httpOptions } from '../app.module';

@Component({
  selector: 'page-spender',
  templateUrl: 'spender.page.html'
})
export class SpenderPage {

  spenderID = localStorage.getItem("IDNum"); //retrieves spender number from local storage
  balance = null; //variable to store balance
  name: String = ""; //variable to store name
  classType: String = localStorage.getItem("ClassType");
  //url is the server + spender num used for htp requests
  url: string = cloudUrl + this.classType + '/' + this.spenderID;
  authToken: String; //retrieves token that was stored in login
  QRData: String; //data for qr code
  isRunning: boolean = false;
  reloadCounter: number = 0;


  constructor(public navCtrl: NavController, private http: HttpClient, private atrCtrl: AlertController) {


    this.authToken = localStorage.getItem("Token");
    this.QRData = this.classType + " " + this.spenderID + " " + this.authToken;


    this.http.get(this.url, httpOptions).subscribe((response) => { //gets spender name from Fabric and displays it upon page load
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
    this.http.get(url, httpOptions).subscribe((response) => {
      return response;
    });
  }

  toggleBalance(): void { //called when balance is to be toggled
    var text = document.getElementById("spender-heading2"); //gets html id for label
    var buttonText = document.getElementById("spender-button3"); //get htnl id for burron

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
      var filter = "";
      if (this.classType == "org.hawkoin.network.Student") {
        filter = cloudUrl + 'org.hawkoin.network.InProgress' + '?filter=%7B%22where%22%20%3A%20%7B%22status%22%3A%22WAITING%22%2C%20%22fromUser%22%20%3A%20%22resource%3Aorg.hawkoin.network.Student%23' + this.spenderID + '%22%7D%7D';
      }
      else {
        filter = cloudUrl + 'org.hawkoin.network.InProgress' + '?filter=%7B%22where%22%20%3A%20%7B%22status%22%3A%22WAITING%22%2C%20%22fromUser%22%20%3A%20%22resource%3Aorg.hawkoin.network.Faculty%23' + this.spenderID + '%22%7D%7D';
      }
      this.http.get(filter, httpOptions).subscribe((response) => { //reguests list from Fabric
        var parsedJ = JSON.parse(JSON.stringify(response));
        if (!this.isRunning && parsedJ[0] && parsedJ[0].status == 'WAITING') {
          this.isRunning = true;
          this.confirmation(parsedJ[0]);
        }

      });
    }
    var text = document.getElementById("spender-heading2"); //gets html id for label
    this.http.get(this.url, httpOptions).subscribe((response) => {
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

  async showAlert(title: string, subTitle: string) {
    let alert = await this.atrCtrl.create({
      header: title,
      subHeader: subTitle,
      buttons: ['OK']
    });
    alert.present();
  }

  async confirmation(response: any) {
    var payload;


    let alertConfirm = await this.atrCtrl.create({
      header: 'Confirm Transaction',
      message: 'Amount: ' + response.amount + "\nVendor: " + response.toUser,
      cssClass: 'buttonCss',
      buttons: [
        {
          text: 'Deny',
          role: 'cancel',
          cssClass: 'cancel-button',
          handler: () => {
            payload = {
              "$class": "org.hawkoin.network.InProgress",
              "amount": response.amount,
              "status": "CANCELLED",
              "authToken": response.authToken,
              "fromUser": response.fromUser,
              "toUser": response.toUser
            }; //create payload to send to Fabric
            this.http.put(cloudUrl + 'org.hawkoin.network.InProgress' + "/" + response.id, JSON.stringify(payload), httpOptions).subscribe(data => {
              console.log(data); //log response for testing
              //window.alert("Confirmed/Cancelled!"); //display success in prompt
              this.showAlert("Success!", "Cancelled!");
              //document.getElementById("vendor-checkbox1inner").innerHTML = "Amount: " + this.amount + " From ID: " + this.fromID + "Auth Token: " + this.authToken; //displays amount and recipient ids
              //this.check = true; //checks checkmark
              this.isRunning = false;
            }, error => { //catches errors
              console.log(error); //log response for testing
              this.showAlert("Error", error.error.error.message);
              //window.alert("Error: " + error.error.error.message); //display error in prompt
              this.isRunning = false;
            });
          }
        },
        {
          text: 'Confirm',
          cssClass: 'confirm-button',
          handler: () => {
            payload = {
              "$class": "org.hawkoin.network.InProgress",
              "amount": response.amount,
              "status": "CONFIRMED",
              "authToken": response.authToken,
              "fromUser": response.fromUser,
              "toUser": response.toUser
            }; //create payload to send to Fabric
            this.http.put(cloudUrl + 'org.hawkoin.network.InProgress' + "/" + response.id, JSON.stringify(payload), httpOptions).subscribe(data => {
              console.log(data); //log response for testing
              //window.alert("Confirmed/Cancelled!"); //display success in prompt
              this.showAlert("Success!", "Confirmed!");
              //document.getElementById("vendor-checkbox1inner").innerHTML = "Amount: " + this.amount + " From ID: " + this.fromID + "Auth Token: " + this.authToken; //displays amount and recipient ids
              //this.check = true; //checks checkmark
              this.isRunning = false;
            }, error => { //catches errors
              console.log(error); //log response for testing
              this.showAlert("Error", error.error.error.message);
              //window.alert("Error: " + error.error.error.message); //display error in prompt
              this.isRunning = false;
            });
          }
        }
      ]
    });
    await alertConfirm.present();

  }

}
