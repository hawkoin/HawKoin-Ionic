import { Component } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';

import { HttpClient } from '@angular/common/http';
import { cloudUrl, httpOptions } from '../app.module';

@Component({
  selector: 'page-spender',
  templateUrl: 'spender.page.html'
})
export class SpenderPage {

  spenderID = null; //stores spender ID
  balance = null; //variable to store balance
  name: String = ""; //variable to store spender name
  classType: String = null; //variable to store type of spender
  url: string = cloudUrl + this.classType + '/' + this.spenderID; //url is the server + spender type + spender num used for http requests
  authToken: String; //stores token that was stored during login
  QRData: String; //data for qr code
  isRunning: boolean = false; //boolean to determine is asset check is running or not
  refreshTimer: any; //variable used to store timer for status refresh


  constructor(public navCtrl: NavController, private http: HttpClient, private atrCtrl: AlertController) {

    this.authToken = localStorage.getItem("Token"); //retrieves token used during login
    this.spenderID = localStorage.getItem("IDNum"); //retrieves user id 
    this.classType = localStorage.getItem("ClassType"); //retrieves type of user

    this.QRData = this.classType + " " + this.spenderID + " " + this.authToken; //generates data for QR Code

    this.http.get(this.url, httpOptions).subscribe((response) => { //gets spender name from Fabric and displays it upon page load
      var parsedJ = JSON.parse(JSON.stringify(response));
      document.getElementById("welcome-heading1").innerHTML = "Welcome, " + parsedJ.contactInfo.firstName + " " + parsedJ.contactInfo.lastName;
    });

  }

  toggleBalance(): void { //called when balance is to be toggled
    var text = document.getElementById("spender-heading2"); //gets html id for label
    var buttonText = document.getElementById("spender-button3"); //get html id for button

    if (text.hidden) { //runs if text is currently hidden
      text.hidden = false; //unhides the text
      buttonText.textContent = "Hide Balance"; //updates button to hide balance
    } else { //hides the balance
      text.hidden = true; //hides the text
      buttonText.textContent = "Show Balance"; //updates button to show balance
    }
  }

  refreshData(): void //method to check for any inProgress assets
  {
    if (!this.isRunning) { //checks if method is already running
      var filter = ""; //variable for the filter to use
      if (this.classType == "org.hawkoin.network.Student") { //filter for student spender
        filter = cloudUrl + 'org.hawkoin.network.InProgress' + '?filter=%7B%22where%22%20%3A%20%7B%22status%22%3A%22WAITING%22%2C%20%22fromUser%22%20%3A%20%22resource%3Aorg.hawkoin.network.Student%23' + this.spenderID + '%22%7D%7D';
      }
      else { //filter for faculty spender
        filter = cloudUrl + 'org.hawkoin.network.InProgress' + '?filter=%7B%22where%22%20%3A%20%7B%22status%22%3A%22WAITING%22%2C%20%22fromUser%22%20%3A%20%22resource%3Aorg.hawkoin.network.Faculty%23' + this.spenderID + '%22%7D%7D';
      }

      this.http.get(filter, httpOptions).subscribe((response) => { //reguests status from fabric

        var parsedJ = JSON.parse(JSON.stringify(response)); //parse response
        if (!this.isRunning && parsedJ[0] && parsedJ[0].status == 'WAITING') { //displays alert if not running and assest status is waiting 
          this.isRunning = true; //changes isRunning to true
          this.confirmation(parsedJ[0]); //called confirmation dialog on response
        }

      });
    }

    var text = document.getElementById("spender-heading2"); //gets html id for label
    this.http.get(this.url, httpOptions).subscribe((response) => { //gets up to date balance value
      var parsedJ = JSON.parse(JSON.stringify(response)); //parses response from fabric
      if (text && text.hidden) {
        text.innerHTML = "Balance: $" + parsedJ.balance; //writes balance to label
        text.hidden = true; //hides text if already hidden
      }
      else if (text) {
        text.innerHTML = "Balance: $" + parsedJ.balance; //writes balance to label
      }
    });

    this.refreshTimer = setTimeout(this.refreshData.bind(this), 500); //sets a timeout to refresh the list every 0.5 seconds

  }

  async showAlert(title: string, subTitle: string) { //called to diplay an alert dialog

    let alert = await this.atrCtrl.create({ //creates alert dialog
      header: title,
      subHeader: subTitle,
      buttons: ['OK']
    });
    alert.present(); //presents alert dialog

  }

  async confirmation(response: any) { //runs when confirmation is received
    var payload; //payload to send to Fabric 

    let alertConfirm = await this.atrCtrl.create({ //creates a confirmation alert window
      header: 'Confirm Transaction',
      message: 'Amount: ' + response.amount + "\nVendor: " + response.toUser,
      cssClass: 'buttonCss',
      buttons: [
        {
          text: 'Deny',
          role: 'cancel',
          cssClass: 'cancel-button',
          handler: () => { //runs when cancel button is pressed

            payload = {
              "$class": "org.hawkoin.network.InProgress",
              "amount": response.amount,
              "status": "CANCELLED",
              "authToken": response.authToken,
              "fromUser": response.fromUser,
              "toUser": response.toUser
            }; //create asset payload to send to Fabric

            this.http.put(cloudUrl + 'org.hawkoin.network.InProgress' + "/" + response.id, JSON.stringify(payload), httpOptions).subscribe(data => { //puts updated cancel status for asset

              console.log(data); //log response for testing
              this.showAlert("Success!", "Cancelled!"); //shows alert that transaction has been cancelled
              this.isRunning = false; //sets isRunning to false

            }, error => { //catches errors

              console.log(error); //log response for testing
              this.showAlert("Error", error.error.error.message); //display error in prompt
              this.isRunning = false; //sets isRunning to false

            });

          }
        },
        {
          text: 'Confirm',
          cssClass: 'confirm-button',
          handler: () => { //runs when confirm button is pressed

            payload = {
              "$class": "org.hawkoin.network.InProgress",
              "amount": response.amount,
              "status": "CONFIRMED",
              "authToken": response.authToken,
              "fromUser": response.fromUser,
              "toUser": response.toUser
            }; //create asset payload to send to Fabric

            this.http.put(cloudUrl + 'org.hawkoin.network.InProgress' + "/" + response.id, JSON.stringify(payload), httpOptions).subscribe(data => { //puts updated confirmed status for asset

              console.log(data); //log response for testing
              this.showAlert("Success!", "Confirmed!"); //show alert that transaction has been confirmed
              this.isRunning = false; //set isRunning to false

            }, error => { //catches errors

              console.log(error); //log response for testing
              this.showAlert("Error", error.error.error.message); //display error in prompt
              this.isRunning = false; //set isRunning  false

            });

          }
        }
      ]
    });

    await alertConfirm.present(); //displays confirmation alert window

  }

  ionViewWillEnter() { //runs when page loads
    console.log("Loaded spender page"); //log for testing
    this.refreshData(); //begin refresh data
  }

  ionViewWillLeave() { //runs when page exits
    console.log("leaving spender page"); //log for testing
    clearTimeout(this.refreshTimer); //clear refresh timer
  }

}
