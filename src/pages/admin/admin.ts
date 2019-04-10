import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'page-admin',
  templateUrl: 'admin.html'
})
export class AdminPage {
  items: any[] = []; //array to store each transaction

  constructor(public navCtrl: NavController, private http: HttpClient) {
    this.refreshData(); //call refreshData() when page loads
  }

  refreshData(): void //method to refresh transaction list
  {
    this.http.get('http://35.188.189.147:3000/api/org.hawkoin.network.TransferFunds').subscribe((response) => { //reguests list from Fabric

      this.items = []; //clear out current list

      for (let i = 0; response[i]; i++) { //loops through transactions until end is reached
        this.items.push({ //adds transaction to list 
          name: "Transaction #" + response[i].transactionId + " From User: " + response[i].fromUser + " To User: " + response[i].toUser + " Amount: " + response[i].amount
        });
      }
    });

    setTimeout(this.refreshData.bind(this), 2000); //sets a timeout to refresh the list eery 2 seconds
  }

}
