import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { StudentPage } from "../student/student"
import { VendorPage } from "../vendor/vendor"
import { AdminPage } from "../admin/admin"

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  constructor(public navCtrl: NavController) {
  }
  
  navigateToNextPage(): void {
    this.navCtrl.push(AdminPage);
  }
}
