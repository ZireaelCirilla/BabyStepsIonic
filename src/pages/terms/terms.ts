import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the TermsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-terms',
  templateUrl: 'terms.html',
})
export class TermsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController) {
  }

  closeModal(){
    this.viewCtrl.dismiss();
  }
  agreedTerms(){
    this.viewCtrl.dismiss(true);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TermsPage');
  }

}
