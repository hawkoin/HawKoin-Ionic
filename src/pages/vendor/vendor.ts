import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';


@Component({
  selector: 'page-vendor',
  templateUrl: 'vendor.html'
})
export class VendorPage {

  scannedCode = null;

  constructor(public navCtrl: NavController, private barcodeScanner: BarcodeScanner) {
    
  }

  scanCode() {
     this.barcodeScanner.scan().then(barcodeData => {
       this.scannedCode = barcodeData.text;
     })
  }

}
