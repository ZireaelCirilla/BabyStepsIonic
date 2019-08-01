import { Component } from '@angular/core';
import { ModalController, NavController, ModalOptions, Platform } from 'ionic-angular';
import { NotificationServiceProvider } from '../../providers/notification-service/notification-service';
import { GlobalProvider } from "../../providers/global/global";
import { DatabaseProvider } from '../../providers/database/database';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { AuthService } from '../../services/auth.service'
import { LoginPage } from '../login/login';
import { Storage } from '@ionic/storage';
import { LocalNotificationsScheduleProvider } from '../../providers/local-notifications-schedule/local-notifications-schedule';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  myModalOptions: ModalOptions = {
    enableBackdropDismiss: false
  };

  notifications: Array<Notification> = [];
  public cloud: boolean;
  hide: boolean;
  labelCloudStorage: boolean;
  labelNoCloudStorage: boolean;

  constructor(public modalCtrl: ModalController,
    public navCtrl: NavController,
    private notificationsService: NotificationServiceProvider,
    private global: GlobalProvider,
    private platform: Platform,
    private databaseProvider: DatabaseProvider,
    private sqlite: SQLite,
    private auth: AuthService,
    private storage: Storage,
    private localNotifications: LocalNotificationsScheduleProvider
  ) {
    this.platform.ready().then((readySource) => {
      console.log('Platform ready from', readySource);
      // Platform now ready, execute any required native code
      console.log("HIII AGAIN");
      this.sqlite.create({
        name: 'data.db',
        location: 'default'
      })
        .then((db: SQLiteObject) => {
          this.databaseProvider.setDatabase(db);
          console.log("ABIERTO");
          this.databaseProvider.createTable();
          this.storage.get('toggle').then(toggle => {
            //console.log("TOGGLE IS " + toggle);
            if (toggle != false) {
              this.labelNoCloudStorage = false;
              this.labelCloudStorage = true;
              this.cloud = true;
              this.global.cloud = true;
              this.hide = true;
              this.getNotifications();
            } else if (toggle == false) {
              if (this.global.offLine == true) {
                console.log("HI");

                this.labelNoCloudStorage = true;
                this.labelCloudStorage = false;
                this.global.cloud = false;
                this.hide = false;
              } else {
                console.log("NOT HI");
                this.labelNoCloudStorage = false;
                this.labelCloudStorage = true;
                this.cloud = false;
                this.global.cloud = false;
                this.hide = false;
              }

              this.getNotificationsFromStorage();
            }
          })
        })
        .catch(e => console.log(e));
    });
  }

  getNotificationsFromStorage() {
    this.databaseProvider.getAll().then(data => {
      this.notifications = data;
      this.localNotifications.checkScheduledNotifications(this.notifications);
      console.log("checking scheduled");
    });
    if (this.global.update == true) {
      this.getNotificationsFromStorage();
    }
  }

  getNotifications() {
    // CARGAR NOTIFICACIONES HASTA QUE LA RESPUESTA DEL SERVIDOR SEA DIFERENTE AL ARRAY LOCAL
    console.log("cargando de firebase");

    this.notificationsService.getNotificationList().subscribe((data: Array<Notification>) => {
      this.notifications = data;
      this.localNotifications.checkScheduledNotifications(this.notifications);
      console.log("checking scheduled");
    });;
  }

  showNotificationModal(notification) {
    if (notification != undefined) {
      this.global.editMode = true;
    } else {
      this.global.editMode = false;
    }
    // CREAR MODAL ---------------------------------------------------------------------------------
    const myModal = this.modalCtrl.create("ContentPage", notification, this.myModalOptions);
    myModal.present();
    myModal.onDidDismiss((notification: Notification) => {
      // MODO LOCAL ---------------------------------------------------------------------------------
      if (this.global.cloud == false) {
        if (this.global.editMode == true) {
          //BORRAR DATO ----------------------------------------------------------------------------
          if (this.global.delete == true) {
            this.databaseProvider.delete(notification);
            this.global.delete = false;
            //ACTUALIZAR DATO------------------------------------------------------------------------
          } else if (this.global.delete == false) {
            this.databaseProvider.update(notification);
          }
          //GUARDAR DATO ----------------------------------------------------------------------------
        } else if (this.global.editMode == false && notification.title != null && notification.content != null) {
          console.log("CREATE BEFORE ENTER");
          this.databaseProvider.create(notification);
        }
        this.getNotificationsFromStorage();
        setTimeout(() => {
          console.log('Async operation has ended');
          this.global.update = false;
        }, 2000);
        // MODO NUBE ----------------------------------------------------------------------------------
      } else if (this.global.cloud == true) {
        console.log("edit mode: " + this.global.editMode);
        console.log("delete mode: " + this.global.delete);
        // MODO EDITAR ------------------------------------------------------------------
        if (this.global.editMode == true && this.global.delete == false) {
          //AÑADIR FIREBASE AQUI
          console.log("EDITING");

          this.notificationsService.updateNotification(notification);
          this.global.update = true;
          // MODO AÑADIR ------------------------------------------------------------------
        } else if (this.global.delete == false && this.global.editMode == false) {
          for (var i = 0; i < this.notifications.length; i++) {
            if (notification.title == null || notification.content == null || notification == this.notifications[i]) {
              return;
            }
          }
          //AÑADIR FIREBASE AQUI
          console.log("ADDING NOTIFICATION");

          this.notificationsService.addNotification(notification);

          this.global.update = true;
        } else if (this.global.delete == true && this.global.editMode == true) {
          //BORRANDO
          console.log("BORRANDO");

          this.notificationsService.removeNotification(notification).then(res => {
            this.global.delete = false;
          });
        }
        this.getNotifications();
      }
    });
  }

  doRefresh(refresher) {
    // REFRESCAR LOCAL --------------------------------------------------------------------
    if (this.global.cloud == false) {
      refresher.complete();
      // REFRESCAR NUBE --------------------------------------------------------------------
    } else if (this.global.cloud == true) {
      this.notifications = [];
      this.global.update = false;
      this.getNotifications();
      refresher.complete();
      setTimeout(() => {
        console.log('Async operation has ended');
        refresher.complete();
      }, 2000);
    }

  }

  logout() {
    this.auth.signOut();
    this.navCtrl.setRoot(LoginPage);
  }

  onToggle($event) {
    console.log($event.checked);
    if ($event.checked == true) {
      this.global.cloud = true;
      this.storage.set('toggle', true);
      this.hide = true;
      this.getNotifications();
    } else if ($event.checked == false) {
      this.global.cloud = false;
      this.storage.set('toggle', false);
      this.hide = false;
      this.getNotificationsFromStorage();
    }
  }
}

class Notification {
  key: string;
  title: string;
  content: string;
  date: string;
}

export const firebaseConfig = {
  fire: {
    apiKey: "your-api-key-here",
    authDomain: "your-firebase-app.firebaseapp.com",
    databaseURL: "https://your-firebase-database.firebaseio.com",
    projectId: "yout-project-id",
    storageBucket: "your-storage-bucket.appspot.com",
    messagingSenderId: "your-messaging-id"
  }
};