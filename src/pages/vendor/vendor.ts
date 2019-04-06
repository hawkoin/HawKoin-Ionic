import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

import { HttpClient, HttpHeaders } from '@angular/common/http';



@Component({
  selector: 'page-vendor',
  templateUrl: 'vendor.html'
})
export class VendorPage {
  check : Boolean = false;
  amount: number = null;
  scannedCode = null;
  vendorID = localStorage.getItem("VendorNum");
  authToken:String = "noToken";
  payload = null;

  constructor(public navCtrl: NavController, private barcodeScanner: BarcodeScanner, private http: HttpClient) {

  }

  scanCode() {

    if(this.amount)
    {
      this.barcodeScanner.scan().then(barcodeData => {
        this.scannedCode = barcodeData.text;
 
 
 
        const httpOptions = {
          headers: new HttpHeaders({
           'Content-Type':  'application/json'
          })
        };
        
 
        this.payload = {"$class": "org.hawkoin.network.TransferFunds",
        "amount": this.amount,
        "authToken": this.authToken,
        "fromUser": ('resource:org.hawkoin.network.Student#' + this.scannedCode),
        "toUser": ('resource:org.hawkoin.network.Vendor#' + this.vendorID)};
 
        console.log(JSON.stringify(this.payload));
       this.http.post("http://35.188.189.147:3000/api/org.hawkoin.network.TransferFunds", JSON.stringify(this.payload), httpOptions).subscribe(response =>
       {
         console.log(response);
       });
       document.getElementById("vendor-checkbox1inner").innerHTML = "Amount: " + this.amount + " Scanned code: " + this.scannedCode;
 
      this.check = true;
      setTimeout(this.refresh.bind(this), 10000);
      })

    }
    else
    {
      window.alert("Please enter a value for amount.");
    }
     
  }

  refresh()
  {
    this.amount = null;
    document.getElementById("vendor-checkbox1inner").innerHTML = "";
    this.check = false;
  }

}
