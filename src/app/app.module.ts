import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabase } from 'angularfire2/database'; 
//import { Http } from '@angular/http';
import { HttpModule } from '@angular/http';


@NgModule({
  declarations: [
    MyApp,
    HomePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
      HttpModule,

    AngularFireModule.initializeApp({
        apiKey: "AIzaSyCfNlkxEHtaKd1pvDQ-uiVRs5V1Z8KaUEE",
        authDomain: "songdb-5f776.firebaseapp.com",
        databaseURL: "https://songdb-5f776.firebaseio.com",
        storageBucket: "songdb-5f776.appspot.com",
        messagingSenderId: "122686588404"
    }),



  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  ],
  providers: [
   //   Http,
    StatusBar,
      SplashScreen,
      AngularFireDatabase,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
