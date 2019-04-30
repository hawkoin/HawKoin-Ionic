import { NgModule } from '@angular/core';

import { IonicModule } from 'ionic-angular';
import { CommonModule } from '@angular/common';

import { GoogleLComponent } from './google-l/google-l';

@NgModule({
	declarations: [GoogleLComponent],
	imports: [CommonModule, // <--- for angular directives
		IonicModule  // <--- for ionic components
	],
	exports: [GoogleLComponent]

})
export class ComponentsModule {}
