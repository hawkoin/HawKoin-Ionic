import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'page-vendor',
  templateUrl: 'vendor.html'
})
export class VendorPage {
  amount = null;
  scannedCode = null;
  vendorID = 12345;
  authToken = null;
  payload = null;

  constructor(public navCtrl: NavController, private barcodeScanner: BarcodeScanner, private http: HttpClient) {
    
  }

  scanCode() {

     this.barcodeScanner.scan().then(barcodeData => {
       this.scannedCode = barcodeData.text;
       document.getElementById("vendor-checkbox1").innerHTML = "Amount:" + this.amount + " Scanned code: " + this.scannedCode;

       this.payload = {'$class': 'org.hawkoin.network.TransferFunds',
       'amount': this.amount,
       'authToken': 'noToken',
       'fromUser': ('resource:org.hawkoin.network.student#' + this.scannedCode),
       'toUser': ('resource:org.hawkoin.network.vendor#' + this.vendorID)};
      this.http.post("http://35.188.189.147:3000/api/org.hawkoin.network.TransferFunds", this.payload);
       
     })

     
  }

}
