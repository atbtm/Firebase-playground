import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { ProviderPage } from '../pages/provider/provider';
import { HttpModule } from '@angular/http';
import { Geolocation } from '@ionic-native/geolocation';
import { AgmCoreModule } from 'angular2-google-maps/core';
@NgModule({
  declarations: [
    MyApp,
      ProviderPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
      HttpModule,
      AgmCoreModule.forRoot({
          apiKey: 'AIzaSyBZmraWD9Qtku4ZxkM4eB8WvB7et2ML560'
      })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ProviderPage
  ],
  providers: [
      Geolocation,
    StatusBar,
      SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
