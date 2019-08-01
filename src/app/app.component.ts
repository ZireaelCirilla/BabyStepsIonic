import { Component } from '@angular/core';
import { Platform, LoadingController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

//import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { AuthService } from '../services/auth.service';
import { HomePage } from '../pages/home/home';
import { IntroPage } from '../pages/intro/intro';
import { Storage } from '@ionic/storage';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { GlobalProvider } from '../providers/global/global';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = LoginPage;
  loader: any;

  constructor(platform: Platform, statusBar: StatusBar, private global: GlobalProvider, private androidPermissions: AndroidPermissions, public loadingCtrl: LoadingController, splashScreen: SplashScreen, private auth: AuthService, public storage: Storage) {
    this.presentLoading();
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleLightContent()
      splashScreen.hide();
      this.storage.get('introShown').then((result) => {
        
        if (result) {
          this.auth.afAuth.authState
            .subscribe(
              user => {
                if (user) {
                  this.rootPage = HomePage;
                  
                } else {
                  this.rootPage = LoginPage;
                  
                }
              },
              () => {
                this.rootPage = LoginPage;
              }
            );
        } else {
          this.rootPage = IntroPage;
        }
        this.loader.dismiss();
      });

    });

    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.INTERNET).then(
      result => console.log('Has permission?',result.hasPermission),
      err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.INTERNET)
    );
    
    this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.INTERNET]);

  }

  presentLoading() {

    this.loader = this.loadingCtrl.create({
      content: "Authenticating..."
    });

    this.loader.present();

  }

  // login() {
  //   this.auth.signOut();
  //   this.nav.setRoot(LoginPage);
  // }
  // logout() {
  //   this.menu.close();
  //   this.auth.signOut();
  //   this.nav.setRoot(HomePage);
  // }
}

