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

  choice:String = null;

  constructor(public navCtrl: NavController) {
  }
  
  navigateToNextPage(): void {
    if(this.choice == "Student")
    {
      this.navCtrl.push(StudentPage);
    }
    else if(this.choice == "Vendor")
    {
      this.navCtrl.push(VendorPage);
    }
    else if(this.choice == "Admin")
    {
      this.navCtrl.push(AdminPage);
    }
    else if(this.choice == "Receipt")
    {
      this.navCtrl.push(ReceiptPage);
    }
    //this.navCtrl.push(VendorPage);
  }

}
