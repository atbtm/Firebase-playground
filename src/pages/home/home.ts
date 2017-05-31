import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { Http } from '@angular/http';
import * as firebase from "firebase";

firebase.initializeApp({
    apiKey: "AIzaSyAXwqkQhaRynB_yJz1NUezgP8JoaQt1Sc0",
    authDomain: "fir-playground-195a9.firebaseapp.com",
    databaseURL: "https://fir-playground-195a9.firebaseio.com",
    projectId: "fir-playground-195a9",
    storageBucket: "fir-playground-195a9.appspot.com",
    messagingSenderId: "692509908432"
})


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
    public providers = "PlaceHolder";
    engine: string;
  // public providers = [];
  constructor(public navCtrl: NavController, public alertCtrl: AlertController,
      public http: Http) {
      this.engine = "This is engine string";

      this.providers = "PlaceHolder";
  }
  
  populateDbToGrid() {
      var providerData;
      // var providers = this.providers;
      var p = firebase.database().ref('/').once('value');
      p.then(res => {
          console.log("###" + JSON.stringify(res.val()));
          this.providers = res.val();
      }
      );
  }
  pushProviders(data) {
      let providerResult = data.json().results;
      function genPrice(base, servicePrice, randomFactor, insuranceFactor) {
          return Math.floor((base + servicePrice * (0.8 + 0.2 * randomFactor) * insuranceFactor) * 100) / 100;
      }
      for (let provider of providerResult) {
          let id = provider.id;

          /**
           *  These are parameters that need to be passed in
           */
          let basePrice = 50;                                 // base price for all services
          var servicePriceMap = new Map();
          servicePriceMap.set("mri", 1000);
          servicePriceMap.set("dental", 50);                 // map to store price offset for service on top of base price
          let randomFactor = Math.random();             // currently scaled at 0.7 * random

          provider["services"] = {};
          var serviceItr = servicePriceMap.keys();
          var nextService = serviceItr.next();
          while (nextService.value != undefined) {
              let ServiceName = nextService.value;
              provider["services"][ServiceName] = {};
              provider["services"][ServiceName] = {
                  "noInsurance": genPrice(basePrice, servicePriceMap.get(ServiceName), randomFactor, 1.26),
                  "basicInsurance": genPrice(basePrice, servicePriceMap.get(ServiceName), randomFactor, 1.012),
                  "premiumInsurance": genPrice(basePrice, servicePriceMap.get(ServiceName), randomFactor, 0.74)
              };
              nextService = serviceItr.next();
          }
          //console.log("############PRINTING Provider Str: " + JSON.stringify(provider.services));
          firebase.database().ref('/' + id).set(provider);

      }
      this.populateDbToGrid();
  }
  
  getProviders(inputProviderZipcode) {
      let coordQuery = "https://maps.googleapis.com/maps/api/geocode/json?address=" + inputProviderZipcode + "&key=AIzaSyBZmraWD9Qtku4ZxkM4eB8WvB7et2ML560";
      var jsonRes;
      this.http.get(coordQuery).subscribe(data => {
          var lat, lng;
      //    console.log(data.json().results[0]);
          lat = data.json().results[0].geometry.location.lat;
          lng = data.json().results[0].geometry.location.lng;
      //    console.log(lat + " " + lng);

          /**
           *  These are parameters that need to be passed in
           */
          let radius = "50000";               // search radius
          let providerType = "hospital";      // facility type
          let serviceType = "mri";            // keyword. Currently ignoring this, since mocking up service&price info
          let providerQuery = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=${providerType}&key=AIzaSyBZmraWD9Qtku4ZxkM4eB8WvB7et2ML560`;
      //    console.log(providerQuery);
          this.http.get(providerQuery)
              .subscribe(data => {
                  jsonRes = data;
                  this.pushProviders(jsonRes);
              }, (err) => {
                  console.log(err);
              });
      }, (err) => {
          console.log(err);
          });      
  }

}
