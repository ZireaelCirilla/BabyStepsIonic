import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Platform } from 'ionic-angular';
import { GlobalProvider } from "../../providers/global/global";
import { Storage } from '@ionic/storage';

/**
 * Generated class for the ContentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-content',
  templateUrl: 'content.html',
})
export class ContentPage {
  @ViewChild('myDateTime') dateTime;
  notification: Notification;
  hide: boolean = true;
  hideTitle: boolean = false;
  hideContent: boolean = false;
  onstartDate: string;

  constructor(
    private global: GlobalProvider,
    public navCtrl: NavController,
    private navParams: NavParams,
    private viewCtrl: ViewController,
    public platform: Platform,
    public storage: Storage
  ) {
    console.log(this.navParams);

    if (this.global.editMode == false) {
      this.hide = false;
    } else if (this.global.editMode == true) {
      this.hide = true;
    }

    this.notification = this.navParams.data;
    this.onstartDate = this.notification.date;

    platform.registerBackButtonAction(() => {
      this.closeModal();
    });
  }

  deleteNotification() {
    this.global.delete = true;
    this.closeModal();
  }

  closeModal() {
    if (this.notification.title != null && this.notification.title.length > 45) {
      this.hideTitle = true;
    } else if (this.notification.content != null && this.notification.content.length > 405) {
      this.hideContent = true;
    } else {
      // if(this.onstartDate == )
      // this.dateTime._picker.dismiss();
      // setTimeout(() => {
      //   console.log('Async operation has ended');
      //   this.viewCtrl.dismiss(this.notification);
      // }, 500);
      this.viewCtrl.dismiss(this.notification);
    }

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ContentPage');
  }

}

class Notification {
  key: string;
  title: string;
  content: string;
  date: string;
}