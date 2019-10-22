import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { GoogleLComponent } from './google-l/google-l.component';

import { QRCodeModule } from 'angular2-qrcode';
import { HttpClientModule } from '@angular/common/http';

import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';

import { GooglePlus } from '@ionic-native/google-plus/ngx';

const firebaseConfig = {


  }

export const cloudUrl:string = 'http://35.188.189.147:3000/api/';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, QRCodeModule, HttpClientModule, 
  IonicModule.forRoot(), AppRoutingModule, 
   AngularFireModule.initializeApp(firebaseConfig), // <-- firebase here
    AngularFireAuthModule
    ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    BarcodeScanner, GooglePlus
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
