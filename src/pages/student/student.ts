import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-student',
  templateUrl: 'student.html'
})
export class StudentPage {

  constructor(public navCtrl: NavController) {
  }

  toggleBalance(): void {
    var text = document.getElementById("student-markdown2");
  if (text.hidden) {
    text.innerHTML = "Swapped text!";
    text.hidden = false;
  } else {
    text.hidden = true;
  }
  }
  
}
