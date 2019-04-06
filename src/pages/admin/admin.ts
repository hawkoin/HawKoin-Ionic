import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'page-admin',
  templateUrl: 'admin.html'
})
export class AdminPage {
  items: any[] = [];
  
  constructor(public navCtrl: NavController, private http: HttpClient) {
    this.refreshData();
  }

  refreshData(): void
  {
    this.http.get('http://35.188.189.147:3000/api/org.hawkoin.network.TransferFunds').subscribe((response) => {
    console.log(response);

    this.items = [];

    //list.innerHTML = response[0].fromUser + " " + response[0].toUser + " " + response[0].amount;

    for (let i = 0; response[i]; i++) {
      this.items.push({
        name: "Transaction #" + response[i].transactionId  + " From User: " + response[i].fromUser + " To User: " + response[i].toUser + " Amount: " + response[i].amount
      });
    }

    });
    setTimeout(this.refreshData.bind(this), 2000);
  }

}
