import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { LoginPage } from '../pages/login/login';
import { StudentPage } from '../pages/student/student';
import { VendorPage } from '../pages/vendor/vendor';
import { AdminPage } from '../pages/admin/admin';
import { ReceiptPage } from '../pages/receipt/receipt';


import { QRCodeModule } from 'angular2-qrcode';
import { HttpClientModule } from '@angular/common/http';

import { BarcodeScanner } from '@ionic-native/barcode-scanner'

import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';

import { GooglePlus } from '@ionic-native/google-plus';

const firebaseConfig = {
  //see firebase doc on team drive
}

export const cloudUrl:string = 'http://35.188.189.147:3000/api/';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { GoogleLComponent } from '../components/google-l/google-l';

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    StudentPage,
    VendorPage,
    AdminPage,
    ReceiptPage, GoogleLComponent
  ],
  imports: [
    BrowserModule, QRCodeModule, HttpClientModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig), // <-- firebase here
    AngularFireAuthModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    StudentPage,
    VendorPage,
    AdminPage,
    ReceiptPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    BarcodeScanner, GooglePlus
  ]
})
export class AppModule { }