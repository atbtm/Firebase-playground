﻿import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { FirebaseListObservable, AngularFireDatabase } from 'angularfire2/database';
import { Http } from '@angular/http';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
    songs: FirebaseListObservable<any>;
    providers: FirebaseListObservable<any>;

  constructor(public navCtrl: NavController, public alertCtrl: AlertController,
      public afdb: AngularFireDatabase, public http: Http) {
      this.songs = afdb.list('/songs');
      this.providers = afdb.list('/providers');
      
  }
  getProviders(inputProviderZipcode) {
      let coordQuery = "https://maps.googleapis.com/maps/api/geocode/json?address=" + inputProviderZipcode + "&key=AIzaSyBZmraWD9Qtku4ZxkM4eB8WvB7et2ML560";
      console.log("###" + coordQuery);
      var jsonRes;
      this.http.get(coordQuery).subscribe(data => {
          var lat, lng;
          console.log(data.json().results[0]);
          lat = data.json().results[0].geometry.location.lat;
          lng = data.json().results[0].geometry.location.lng;
          console.log(lat + " " + lng);

          //console.log(lat + " " + lng);
          let radius = "50000";               // search radius
          let providerType = "hospital";      // facility type
          let serviceType = "mri";            // keyword
          let providerQuery = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=${providerType}&keyword=${serviceType}&key=AIzaSyBZmraWD9Qtku4ZxkM4eB8WvB7et2ML560`;
          console.log(providerQuery);
          this.http.get(providerQuery)
              .subscribe(data => {

                  console.log("#providerQ: " + providerQuery)
                  console.log(data.json());
                  jsonRes = data;

                  this.pushProviders(jsonRes);
              }, (err) => {
                  console.log(err);
              });


      }, (err) => {
          console.log(err);
          });      
  }
  pushProviders(data) {
      let providerResult = data.json().results;
      console.log(providerResult);
      for (let provider of providerResult) {
          let id = provider.id;
          let basePrice = 50;                                 // base price for all services
          let servicePriceMap: Map<string, number> =
              new Map([["mri", 1000], ["dental", 50]]);       // map to store price offset for service on top of base price
          let randomFactor = 0.7 * Math.random();             // currently scaled at 0.7 * random

          /*
          provider["services"] = {};

          servicePriceMap.forEach(function (value, key) {
              this[key] = value * randomFactor; // this.push(key + ': ' + value);
              console.log("############LOGGING"+servicePriceMap[key]);
              provider["services"][servicePriceMap[key]] = {};
              provider["services"][servicePriceMap[key]] = { "noInsurance": this[key] * 1.2, "basicInsurance": this[key], "premiumInsurance": this[key] * 0.8 };
          });
          */
          

      //    provider["services"][servicePriceMap["mri"]] = {};
      //    provider["services"][servicePriceMap["mri"]] = { "noInsurance": 1500, "basicInsurance": 1000, "premiumInsurance":700};
          console.log(id);
          console.log("############PRINTING Provider: " + JSON.stringify(provider));
         this.providers.push({provider });
      }

  }
  addSong() {
      let prompt = this.alertCtrl.create({
          title: 'Song Name',
          message: "Enter name for new song",
          inputs: [
              {
                  name: 'title',
                  placeholder: 'Title'
              },
          ],
          buttons: [
              {
                  text: 'Cancel',
                  handler: data => {
                      console.log('Cancel clicked');
                  }
              },
              {
                  text: 'Save',
                  handler: data => {
                      this.songs.push({
                          title: data.title
                      });
                  }
              }
          ]
      });
      prompt.present();

  }
}
