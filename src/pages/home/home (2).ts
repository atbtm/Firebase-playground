import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { FirebaseListObservable, AngularFireDatabase } from 'angularfire2/database';
import { Http } from '@angular/http';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  songs: FirebaseListObservable<any>;
  constructor(public navCtrl: NavController, public alertCtrl: AlertController, afdb: AngularFireDatabase, public http: Http) {
      this.songs = afdb.list('/songs');
      
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
              this.http.get(providerQuery)
                  .subscribe(data => {

                      console.log("#providerQ: " + providerQuery)
                      console.log(data.json());
                      return data;
                  }, (err) => {
                      console.log(err);
                  });


          }, (err) => {
              console.log(err);
          });
      this.showProviders(jsonRes);
      
      
  }
  showProviders(data) {
      console.log(`###PRINGTING data: `);
      console.log(data );
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
