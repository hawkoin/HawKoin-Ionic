import { Component, ChangeDetectorRef } from '@angular/core';
import { NavController } from '@ionic/angular';

import { HttpClient } from '@angular/common/http';
import { cloudUrl, httpOptions } from '../app.module'

@Component({
  selector: 'page-admin',
  templateUrl: 'admin.page.html'
})
export class AdminPage {
  items: any[] = []; //array to store each transaction
  refreshTimer:any;

  constructor(public navCtrl: NavController, private http: HttpClient, private ref: ChangeDetectorRef) {
    this.refreshData(); //call refreshData() when page loads
  }

  refreshData(): void //method to refresh transaction list
  {
    this.http.get(cloudUrl + 'org.hawkoin.network.TransferFunds', httpOptions).subscribe((response) => { //reguests list from Fabric

      this.items = []; //clear out current list

      for (let i = 0; response[i]; i++) { //loops through transactions until end is reached
        this.items.push({ //adds transaction to list 
          transaction: "Transaction # " + response[i].transactionId,
          vendor: "From User: " + response[i].fromUser,
          spender: "To User: " + response[i].toUser, 
          amount: "Amount: " + response[i].amount,
          date: "Date: " + response[i].timestamp
        });
      }
    });
    this.ref.detectChanges();

    this.refreshTimer = setTimeout(this.refreshData.bind(this), 5000); //sets a timeout to refresh the list eery 2 seconds
  }

      ionViewWillLeave() {
        console.log("leaving page");
      clearTimeout(this.refreshTimer);
    }

}
