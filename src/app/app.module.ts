import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage, firebaseConfig } from '../pages/home/home';
import { NotificationServiceProvider } from '../providers/notification-service/notification-service';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { GlobalProvider } from '../providers/global/global';
import { IonicStorageModule } from '@ionic/storage';
import { SQLite } from '@ionic-native/sqlite';
import { DatabaseProvider } from '../providers/database/database';

import { AngularFireModule } from 'angularfire2';
import { AngularFireAuth } from 'angularfire2/auth';
import { LoginPage } from '../pages/login/login';
import { AuthService } from '../services/auth.service'
import { SignupPage } from '../pages/signup/signup';
import { LocalNotificationsScheduleProvider } from '../providers/local-notifications-schedule/local-notifications-schedule';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs-compat';
import { IntroPage } from '../pages/intro/intro';
import { AndroidPermissions } from '@ionic-native/android-permissions';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    SignupPage,
    IntroPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule,
    HttpModule,
    IonicStorageModule.forRoot(),
    AngularFireModule.initializeApp(firebaseConfig.fire)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    SignupPage,
    IntroPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    NotificationServiceProvider,
    GlobalProvider,
    HomePage,
    SQLite,
    DatabaseProvider,
    AngularFireAuth,
    AuthService,
    LocalNotificationsScheduleProvider,
    LocalNotifications,
    AngularFireDatabase,
    AndroidPermissions
  ]
})
export class AppModule {}
