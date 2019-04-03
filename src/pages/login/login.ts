import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { StudentPage } from "../student/student"

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  constructor(public navCtrl: NavController) {
  }
  
  navigateToStudent(): void {
    this.navCtrl.push(StudentPage);
  }
}
