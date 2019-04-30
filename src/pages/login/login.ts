import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { StudentPage } from "../student/student"
import { VendorPage } from "../vendor/vendor"
import { AdminPage } from "../admin/admin"
import { ReceiptPage } from '../receipt/receipt';


@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {


  choice: string = null; //page selection variable
  vend: string = null; //vendor number variable
  stud: string = null; //student number variable

  constructor(public navCtrl: NavController) {
  }

  navigateToNextPage(): void { //called when login button is pressed

    localStorage.setItem("StudentNum", this.stud); //stores student number in local storage
    localStorage.setItem("VendorNum", this.vend); //stores vendor number in local storage

    if (this.choice == "Student") {
      this.navCtrl.push(StudentPage); //navigates to student 
    }
    else if (this.choice == "Vendor") {
      this.navCtrl.push(VendorPage); //naviagtes to vendor
    }
    else if (this.choice == "Admin") {
      this.navCtrl.push(AdminPage); //navigates to admin
    }
    else if (this.choice == "Receipt") {
      this.navCtrl.push(ReceiptPage); //navigates to receipt
    }
  }

 

}
