
import { Injectable } from '@angular/core';
import { LocalNotifications } from '@ionic-native/local-notifications';
/*
  Generated class for the LocalNotificationsScheduleProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LocalNotificationsScheduleProvider {

  constructor(private localNotifications: LocalNotifications) { }

  checkScheduledNotifications(notifications) {
    this.localNotifications.clearAll();
    for (var i = 0; i < notifications.length; i++) {
      this.scheduleNotification(notifications[i]);
    }
  }

  scheduleNotification(notification) {
    this.localNotifications.schedule({
      id: notification.id,
      title: notification.title,
      text: notification.content,
      trigger: { at: new Date(notification.date) },
      led: 'FF0000',
      sound: null
    });
    this.localNotifications.getScheduled().then(response => {
      console.log(response);
    })
  }
}
