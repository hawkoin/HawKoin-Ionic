import { Component } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { cloudUrl, httpOptions } from '../app.module';

import { LoadingController } from '@ionic/angular';



@Component({
  selector: 'page-vendor',
  templateUrl: 'vendor.page.html'
})
export class VendorPage {
  check: Boolean = false; //variable for checkboz
  amount: number = null; //variable to store amount to transfer
  fromID = null;
  vendorID = localStorage.getItem("IDNum"); //retrieves vendor num from local storage
  fromAuthToken: String = null; //variable to store fromAuthToken
  payload = null; //varirable to store payload on server
  loading = null;
  InProgressID = null;
  isRunning: Boolean = false;

  constructor(public navCtrl: NavController, private barcodeScanner: BarcodeScanner, private http: HttpClient, public loadingCtrl: LoadingController, private atrCtrl: AlertController) {

  }

  amountCheck() {
    return this.amount > 0;
  }


  scanCode() { //called when to scan code

    if (this.amountCheck()) //checks if value was entered for amount
    {
      this.barcodeScanner.scan().then(barcodeData => { //launches barcode scanner
        this.processBarcode(barcodeData.text); //stores scanned code
      });

    }
    else {
      this.showAlert('Error', "Please enter a positive value for amount.");
      //window.alert("Please enter a positive value for amount."); //displays an alert when amount is not entered
    }

  }

  processBarcode(scannedCode: String) {
    //splits up data from QR code
    this.fromID = scannedCode.split(" ")[0];
    this.fromAuthToken = scannedCode.split(" ")[1];


    this.presentLoading();
    this.InProgressID = this.generateUUID();

    //post the InProgressAsset
    this.payload = {
      "$class": "org.hawkoin.network.InProgress",
      "id": this.InProgressID,
      "amount": this.amount,
      "status": "WAITING",
      "authToken": this.fromAuthToken,
      "fromUser": ('resource:org.hawkoin.network.Student#' + this.fromID),
      "toUser": ('resource:org.hawkoin.network.Vendor#' + this.vendorID)
    }; //create payload to send to Fabric

    this.http.post(cloudUrl + 'org.hawkoin.network.InProgress', JSON.stringify(this.payload), httpOptions).subscribe(data => {
      console.log(data);
      this.isRunning = false;
      this.refreshData();
      //log response for testing
      //window.alert("Success posting!"); //display success in prompt

    }, error => { //catches errors
      console.log(error); //log response for testing
      this.showAlert("Error", error.error.error.message);
      //window.alert("Error: " + error.error.error.message); //display error in prompt
      return;
    });

  }

  clearPage() //called to refresh page
  {
    this.amount = null; //clears amount
    document.getElementById("vendor-checkbox1inner").innerHTML = ""; //clears checkbox
    this.check = false; //uncheck checkmark
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

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({
      message: 'Waiting for Confimation',
      spinner: 'crescent'
    });
    await this.loading.present();

    const { role, data } = await this.loading.onDidDismiss();

    console.log('Loading dismissed!');
  }

  refreshData(): void {


    this.http.get(cloudUrl + 'org.hawkoin.network.InProgress' + '?filter=%7B%22where%22%3A%7B%22id%22%3A%22' + this.InProgressID + '%22%7D%7D', httpOptions).subscribe((response) => { //reguests list from Fabric        var parsedJ = JSON.parse(JSON.stringify(response));
      var parsedJ = JSON.parse(JSON.stringify(response));
      if (!this.isRunning && parsedJ[0] && parsedJ[0].status == "CONFIRMED") {
        //window.alert("true1");
        this.isRunning = true;
        this.payload = {
          "$class": "org.hawkoin.network.TransferFunds",
          "amount": this.amount,
          "authToken": this.fromAuthToken,
          "fromUser": ('resource:org.hawkoin.network.Student#' + this.fromID),
          "toUser": ('resource:org.hawkoin.network.Vendor#' + this.vendorID)
        }; //create payload to send to Fabric

        this.http.post(cloudUrl + 'org.hawkoin.network.TransferFunds', JSON.stringify(this.payload), httpOptions).subscribe(data => {
          console.log(data); //log response for testing
          this.loading.dismiss();
          this.showAlert("Success!", "Amount: " + this.amount + " From ID: " + this.fromID);
          //this.showAlert("Success!", "Amount: " + this.amount + " From ID: " + this.fromID + " Auth Token: " + this.fromAuthToken);
          // window.alert("Success! \n Amount: " + this.amount + " From ID: " + this.fromID + " Auth Token: " + this.fromAuthToken); //display success in prompt
          //document.getElementById("vendor-checkbox1inner").innerHTML = "Amount: " + this.amount + " From ID: " + this.fromID + "Auth Token: " + this.authToken; //displays amount and recipient ids
          //this.check = true; //checks checkmark
          this.payload = {
            "$class": "org.hawkoin.network.InProgress",
            "amount": parsedJ[0].amount,
            "status": "COMPLETED",
            "authToken": parsedJ[0].authToken,
            "fromUser": parsedJ[0].fromUser,
            "toUser": parsedJ[0].toUser
          }; //create payload to send to Fabric

          this.http.put(cloudUrl + 'org.hawkoin.network.InProgress' + "/" + this.InProgressID, JSON.stringify(this.payload), httpOptions).subscribe(data => {
            console.log(data); //log response for testing
          }, error => { //catches errors
            console.log(error); //log response for testing
          });


          this.clearPage();
        }, error => { //catches errors
          console.log(error); //log response for testing
          this.loading.dismiss();
          this.showAlert("Error", error.error.error.message);
          //window.alert("Error: " + error.error.error.message); //display error in prompt
          this.payload = {
            "$class": "org.hawkoin.network.InProgress",
            "amount": parsedJ[0].amount,
            "status": "FAILED",
            "authToken": parsedJ[0].authToken,
            "fromUser": parsedJ[0].fromUser,
            "toUser": parsedJ[0].toUser
          }; //create payload to send to Fabric

          this.http.put(cloudUrl + 'org.hawkoin.network.InProgress' + "/" + this.InProgressID, JSON.stringify(this.payload), httpOptions).subscribe(data => {
            console.log(data); //log response for testing
          }, error => { //catches errors
            console.log(error); //log response for testing
          });

          this.clearPage();
        });
      }
      else if (!this.isRunning && parsedJ[0] && parsedJ[0].status == "CANCELLED") {
        //window.alert("true2");
        this.isRunning = true;
        this.loading.dismiss();
        this.showAlert("Error", "Transaction cancelled by student");
        //window.alert("Transaction cancelled by student");
        this.clearPage();
      }
      else {
        setTimeout(this.refreshData.bind(this), 500); //sets a timeout to refresh the list eery 2 seconds
      }

    });



  }

  async showAlert(title: string, subTitle: string) {
    let alert = await this.atrCtrl.create({
      header: title,
      subHeader: subTitle,
      buttons: ['OK']
    });
    alert.present();
  }


}

