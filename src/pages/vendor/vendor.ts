import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'page-vendor',
  templateUrl: 'vendor.html'
})
export class VendorPage {
  amount: number = null;
  scannedCode = null;
  vendorID = 12345;
  authToken:String = "noToken";
  payload = null;

  constructor(public navCtrl: NavController, private barcodeScanner: BarcodeScanner, private http: HttpClient) {
    
  }

  scanCode() {

     this.barcodeScanner.scan().then(barcodeData => {
       this.scannedCode = barcodeData.text;
       

       this.payload = {"$class": "org.hawkoin.network.TransferFunds",
       "amount": this.amount,
       "authToken": this.authToken,
       "fromUser": ('resource:org.hawkoin.network.Student#' + this.scannedCode),
       "toUser": ('resource:org.hawkoin.network.Vendor#' + this.vendorID)};

       console.log(JSON.stringify(this.payload));
      this.http.post("http://35.188.189.147:3000/api/org.hawkoin.network.TransferFunds", JSON.stringify(this.payload)).subscribe(response =>
      {
        console.log(response);
      });
      document.getElementById("vendor-checkbox1").innerHTML = "Amount: " + this.amount + " Scanned code: " + this.scannedCode;

      
     })

     
  }

}
