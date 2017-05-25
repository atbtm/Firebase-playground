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
  getProviders() {
      return new Promise(resolve => {
          this.http.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=-33.8670522,151.1957362&radius=5000&type=hospital&keyword=mri&key=AIzaSyBZmraWD9Qtku4ZxkM4eB8WvB7et2ML560')
              .subscribe(data => {
                  console.log(data.json());
              }, (err) => {
                  console.log(err);
              });
      });
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
