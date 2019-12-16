import { Component } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';

import { HttpClient } from '@angular/common/http';
import { cloudUrl, httpOptions } from '../app.module';

import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'page-vendor',
  templateUrl: 'vendor.page.html'
})
export class VendorPage {
  amount: number = null; //variable to store amount to transfer
  fromID = null; //variable to store ID of spender
  fromClass = null; //variable to store type of spender
  vendorID = null;  //stores vendor ID
  fromAuthToken: String = null; //variable to store fromAuthToken
  payload = null; //variable to store payload on server
  loading = null; //variable for loading dialog
  InProgressID = null; //variable to store ID of an in progress transaction 
  isRunning: Boolean = false; //boolean to determine is asset check is running or not
  refreshTimer: any; //variable used to store refresh timer for asset check

  constructor(public navCtrl: NavController, private barcodeScanner: BarcodeScanner, private http: HttpClient, public loadingCtrl: LoadingController, private atrCtrl: AlertController) {
    this.vendorID = localStorage.getItem("IDNum"); //retrieves vendor ID from local storage
  }

  amountCheck() { //called to check if inputed amount is valid
    return this.amount > 0;
  }

  scanCode() { //called to scan code

    if (this.amountCheck()) //checks if value was entered for amount
    {
      this.barcodeScanner.scan().then(barcodeData => { //launches barcode scanner
        this.processBarcode(barcodeData.text); //stores scanned code
      });

    }
    else {
      this.showAlert('Error', "Please enter a positive value for amount."); //displays an alert when amount is not entered
    }

  }

  processBarcode(scannedCode: String) { //process the scanned code

    //splits up data from QR code
    this.fromClass = scannedCode.split(" ")[0];
    this.fromID = scannedCode.split(" ")[1];
    this.fromAuthToken = scannedCode.split(" ")[2];

    this.presentLoading(); //present loading dialog
    this.InProgressID = this.generateUUID(); //generate a new ID for asset tracking

    //post the InProgress asset
    this.payload = {
      "$class": "org.hawkoin.network.InProgress",
      "id": this.InProgressID,
      "amount": this.amount,
      "status": "WAITING",
      "authToken": this.fromAuthToken,
      "fromUser": (this.fromClass + '#' + this.fromID),
      "toUser": ('resource:org.hawkoin.network.Vendor#' + this.vendorID)
    }; //create payload to send to Fabric

    this.http.post(cloudUrl + 'org.hawkoin.network.InProgress', JSON.stringify(this.payload), httpOptions).subscribe(data => {

      console.log(data); //log response for testing
      this.isRunning = false; //set isRunning check to false
      this.refreshData(); //call refresh to check InProgress status

    }, error => { //catches errors

      console.log(error); //log response for testing
      this.loading.dismiss(); //dimiss loading screen
      this.showAlert("Error", error.error.error.message); //display error
      return; //exit processBarcode

    });

  }

  clearPage() //called to clear page
  {
    this.amount = null; //clears amount
    clearTimeout(this.refreshTimer); //clears refreshTimer
  }

  //Source: https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
  generateUUID() { // Public Domain/MIT
    var d = new Date().getTime();//Timestamp
    var d2 = (performance && performance.now && (performance.now() * 1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16;//random number between 0 and 16
      if (d > 0) {//Use timestamp until depleted
        r = (d + r) % 16 | 0;
        d = Math.floor(d / 16);
      } else {//Use microseconds since page-load if supported
        r = (d2 + r) % 16 | 0;
        d2 = Math.floor(d2 / 16);
      }
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  }

  async presentLoading() { //present a loading dialog
    this.loading = await this.loadingCtrl.create({ //creates the loading dialog
      message: 'Waiting for Confimation',
      spinner: 'crescent'
    });
    await this.loading.present(); //presents the loading dialog

    await this.loading.onDidDismiss(); //waits until dialog has been dismissed

    console.log('Loading dismissed!'); //log dismissed for testing
  }

  async showAlert(title: string, subTitle: string) { //present a alert dialog

    let alert = await this.atrCtrl.create({ //create the alert dialog
      header: title,
      subHeader: subTitle,
      buttons: ['OK']
    });

    alert.present(); //present the alert dialog

  }

  refreshData(): void { //call to check status of InProgress asset

    //check the asset status
    this.http.get(cloudUrl + 'org.hawkoin.network.InProgress' + '?filter=%7B%22where%22%3A%7B%22id%22%3A%22' + this.InProgressID + '%22%7D%7D', httpOptions).subscribe((response) => { //reguests list from Fabric        var parsedJ = JSON.parse(JSON.stringify(response));

      var parsedJ = JSON.parse(JSON.stringify(response)); //parse the response

      if (!this.isRunning && parsedJ[0] && parsedJ[0].status == "CONFIRMED") { //if refresh is not already running and status is confirmed then continue
        this.isRunning = true; //set isRunning to true so refreshData does not run again while current asset is being processed
        this.payload = {
          "$class": "org.hawkoin.network.TransferFunds",
          "amount": this.amount,
          "authToken": this.fromAuthToken,
          "fromUser": (this.fromClass + '#' + this.fromID),
          "toUser": ('resource:org.hawkoin.network.Vendor#' + this.vendorID)
        }; //create transaction payload to send to Fabric

        //post transaction payload to Fabric
        this.http.post(cloudUrl + 'org.hawkoin.network.TransferFunds', JSON.stringify(this.payload), httpOptions).subscribe(data => {
          console.log(data); //log response for testing
          this.loading.dismiss(); //dismiss the loading dialog
          this.showAlert("Success!", "Amount: " + this.amount + " From ID: " + this.fromID); //show a success alert 

          this.payload = {
            "$class": "org.hawkoin.network.InProgress",
            "amount": parsedJ[0].amount,
            "status": "COMPLETED",
            "authToken": parsedJ[0].authToken,
            "fromUser": parsedJ[0].fromUser,
            "toUser": parsedJ[0].toUser
          }; //create updated asset payload to send to Fabric

          //put updated asset information to Fabric
          this.http.put(cloudUrl + 'org.hawkoin.network.InProgress' + "/" + this.InProgressID, JSON.stringify(this.payload), httpOptions).subscribe(data => {
            console.log(data); //log response for testing
          }, error => { //catches errors
            console.log(error); //log response for testing
          });

          this.clearPage(); //clear out any data on the page
          clearTimeout(this.refreshTimer); //clear out the refresh timer

        }, error => { //catches errors

          console.log(error); //log response for testing
          this.loading.dismiss(); //dismiss dialog box
          this.showAlert("Error", error.error.error.message); //display error alert

          this.payload = {
            "$class": "org.hawkoin.network.InProgress",
            "amount": parsedJ[0].amount,
            "status": "FAILED",
            "authToken": parsedJ[0].authToken,
            "fromUser": parsedJ[0].fromUser,
            "toUser": parsedJ[0].toUser
          }; //create updated failed asset payload to send to Fabric

          //send updated asset to Fabric
          this.http.put(cloudUrl + 'org.hawkoin.network.InProgress' + "/" + this.InProgressID, JSON.stringify(this.payload), httpOptions).subscribe(data => {
            console.log(data); //log response for testing
          }, error => { //catches errors
            console.log(error); //log response for testing
          });

          this.clearPage(); //clear out any data on the page
          clearTimeout(this.refreshTimer); //clear out the refresh timer          

        });
      }
      else if (!this.isRunning && parsedJ[0] && parsedJ[0].status == "CANCELLED") { //check if refresh is running and status has been cancelled

        this.isRunning = true; //set isRunning to true so refreshData does not run again while current asset is being processed
        this.loading.dismiss(); //dismiss the loading dialog
        this.showAlert("Error", "Transaction cancelled by spender"); //show error dialog


        this.clearPage(); //clear out any data on the page
        clearTimeout(this.refreshTimer); //clear out the refresh timer        

      }
      else { //continue to refresh to check asset status

        this.refreshTimer = setTimeout(this.refreshData.bind(this), 500); //sets a timeout to refresh the list evert 0.5 seconds

      }

    });

  }

  ionViewWillLeave() { //runs when view leaves 
    console.log("Leaving vendor page"); //log for testing
    clearTimeout(this.refreshTimer); //clear out the refresh timer 
  }


}

