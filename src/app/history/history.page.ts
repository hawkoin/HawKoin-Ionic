import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

import { HttpClient } from '@angular/common/http';
import { cloudUrl, httpOptions } from '../app.module'

@Component({
  selector: 'page-history',
  templateUrl: 'history.page.html'
})
export class HistoryPage {

  items: Array<any>; //array to store each transaction
  request: string;
  constructor(public navCtrl: NavController, private http: HttpClient) {


    if (localStorage.getItem("ClassType") == "org.hawkoin.network.Student") {
      this.request = cloudUrl + 'org.hawkoin.network.TransferFunds?filter=%7B%22where%22%3A%20%7B%22fromUser%22%20%3A%20%22resource%3A' + localStorage.getItem("ClassType") + '%23' + localStorage.getItem("IDNum") + '%22%7D%7D';
    }
    else {
      this.request = cloudUrl + 'org.hawkoin.network.TransferFunds?filter=%7B%22where%22%3A%20%7B%22toUser%22%20%3A%20%22resource%3A' + localStorage.getItem("ClassType") + '%23' + localStorage.getItem("IDNum") + '%22%7D%7D';
    }
    this.http.get(this.request, httpOptions).subscribe((response) => { //reguests list from Fabric

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
