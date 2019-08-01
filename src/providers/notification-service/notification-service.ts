import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AuthService } from '../../services/auth.service';

/*
  Generated class for the NotificationServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class NotificationServiceProvider {

  //SET _JAVA_OPTIONS=-Xmx512M

  notifications: Array<Notification> = [];

  constructor(private db: AngularFireDatabase, private auth: AuthService) {

  }

  getNotificationList() {
    
    return this.db.list<Notification>("notifications/" + this.auth.getEmail().replace('.', ',')).valueChanges();
  }

  addNotification(notification: Notification) {
    console.log(notification);
    if(notification.date == undefined){
      notification.date = "";
    }
    var cleanNot = {
      "title": notification.title,
      "content": notification.content,
      "date": notification.date
    };
    var refKey = this.db.list('notifications/' + this.auth.getEmail().replace('.', ',')).push(cleanNot).key;
    var cleanNotUpdate = {
      "key": refKey,
      "title": notification.title,
      "content": notification.content,
      "date": notification.date
    };
    this.updateNotification(cleanNotUpdate);
    console.log(cleanNotUpdate);
    
  }

  updateNotification(notification: Notification) {
    var cleanNot = {
      "key": notification.key,
      "title": notification.title,
      "content": notification.content,
      "date": notification.date
    };
    if(notification.key != undefined){
      this.db.list('notifications/' + this.auth.getEmail().replace('.', ',')).update(notification.key, cleanNot);
    }
  }

  removeNotification(notification: Notification) {
    // console.log(notification);
    // console.log(notification.key);
    return this.db.list('notifications/' + this.auth.getEmail().replace('.', ',')).remove(notification.key);
  }
}

class Notification {
  key: string;
  title: string;
  content: string;
  date: string;
}
