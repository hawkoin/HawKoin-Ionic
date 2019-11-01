import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

import { HttpClient } from '@angular/common/http';
import { cloudUrl } from '../app.module'

@Component({
  selector: 'page-receipt',
  templateUrl: 'receipt.page.html'
})
export class ReceiptPage {

  items: Array<any>; //array to store each transaction
  studentID: String = localStorage.getItem("StudentNum"); //retrieves student number from local storage
  constructor(public navCtrl: NavController, private http: HttpClient) {


    this.http.get(cloudUrl + 'org.hawkoin.network.TransferFunds?filter=%7B%22where%22%3A%20%7B%22fromUser%22%20%3A%20%22resource%3Aorg.hawkoin.network.Student%23' + this.studentID + '%22%7D%7D').subscribe((response) => { //reguests list from Fabric

      this.items = []; //clear out current list

      for (let i = 0; response[i]; i++) { //loops through transactions until end is reached
        console.log(i);

        this.items.push({ //adds transaction to list 
          name: "Transaction #" + response[i].transactionId + " From User: " + response[i].fromUser + " To User: " + response[i].toUser + " Amount: " + response[i].amount
        });
      }

    });

  }
}
