import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GoogleLComponent } from './google-l.component';

@NgModule({
  imports: [ CommonModule, FormsModule,IonicModule,],
  declarations: [GoogleLComponent],
  exports: [GoogleLComponent]
})
export class GoogleLComponentModule {}
