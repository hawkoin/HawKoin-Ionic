import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

import { HttpClient, HttpHeaders } from '@angular/common/http';



@Component({
  selector: 'page-vendor',
  templateUrl: 'vendor.html'
})
export class VendorPage {
  check: Boolean = false; //variable for checkboz
  amount: number = null; //variable to store amount to transfer
  scannedCode = null; //variable to store scanned QR Code
  vendorID = localStorage.getItem("VendorNum"); //retrieves vendor num from local storage
  authToken: String = "noToken"; //variable to store authToken
  payload = null; //varirable to store payload on server

  constructor(public navCtrl: NavController, private barcodeScanner: BarcodeScanner, private http: HttpClient) {

  }

  scanCode() { //called when to scan code

    if (this.amount > 0) //checks if value was entered for amount
    {
      this.barcodeScanner.scan().then(barcodeData => { //launches barcode scanner
        this.scannedCode = barcodeData.text; //stores scanned code

        const httpOptions = { //constant for http headers
          headers: new HttpHeaders({
            'Content-Type': 'application/json'
          })
        };

        this.payload = {
          "$class": "org.hawkoin.network.TransferFunds",
          "amount": this.amount,
          "authToken": this.authToken,
          "fromUser": ('resource:org.hawkoin.network.Student#' + this.scannedCode),
          "toUser": ('resource:org.hawkoin.network.Vendor#' + this.vendorID)
        }; //create payload to send to Fabric

        this.http.post("http://35.188.189.147:3000/api/org.hawkoin.network.TransferFunds", JSON.stringify(this.payload), httpOptions).subscribe(response => {
          console.log(response); //log response for testing
          document.getElementById("vendor-checkbox1inner").innerHTML = "Amount: " + this.amount + " Scanned code: " + this.scannedCode; //displays amount and recipient ids
          this.check = true; //checks checkmark
        });

        setTimeout(this.refresh.bind(this), 10000); //sets a timeout for 10 seconds to clear page for next transaction
      })

    }
    else {
      window.alert("Please enter a positive value for amount."); //displays an alert when amount is not entered
    }

  }

  refresh() //called to refresh page
  {
    this.amount = null; //clears amount
    document.getElementById("vendor-checkbox1inner").innerHTML = ""; //clears checkbox
    this.check = false; //uncheck checkmark
  }

}
