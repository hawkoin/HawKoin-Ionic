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

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    StudentPage,
    VendorPage,
    AdminPage,
    ReceiptPage
  ],
  imports: [
    BrowserModule,QRCodeModule, HttpClientModule,
    IonicModule.forRoot(MyApp)
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
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    BarcodeScanner
  ]
})
export class AppModule {}