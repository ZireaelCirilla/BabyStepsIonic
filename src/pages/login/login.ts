import { Component } from '@angular/core';
import { IonicPage, NavController, ModalController, ModalOptions } from 'ionic-angular';
import { AuthService } from '../../services/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HomePage } from '../home/home'
import { SignupPage } from '../signup/signup';
import { Storage } from '@ionic/storage';
import { GlobalProvider } from '../../providers/global/global';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
	selector: 'page-login',
	templateUrl: 'login.html',
})
export class LoginPage {

	myModalOptions: ModalOptions = {
    enableBackdropDismiss: false
  };

	loginForm: FormGroup;
	loginError: string;


	constructor(
		private navCtrl: NavController,
		public modalCtrl: ModalController,
		private auth: AuthService,
		private storage: Storage,
		private global: GlobalProvider,
		fb: FormBuilder
	) {
		this.loginForm = fb.group({
			email: ['', Validators.compose([Validators.required, Validators.email])],
			password: ['', Validators.compose([Validators.required, Validators.minLength(6)])]
		});
	}

	login() {
		let data = this.loginForm.value;

		if (!data.email) {
			return;
		}

		let credentials = {
			email: data.email,
			password: data.password
		};
		this.auth.signInWithEmail(credentials)
			.then(
				() => {
					console.log(this.auth.getEmail());

					//this.notificationsService.postUser(data.email);
					this.global.offLine = false;
					this.navCtrl.setRoot(HomePage)
					
				},
				error => this.loginError = error.message
			);
	}

	resetPassword() {
		console.log("hi!!!");
		
		const myModal = this.modalCtrl.create("ResetPasswordPage", this.myModalOptions);
    myModal.present();
    myModal.onDidDismiss(() => {
		})
	}

	offLineMode(){
		this.storage.set('toggle', false);
		this.global.offLine = true;
		this.navCtrl.setRoot(HomePage);
	}

	signup() {
		this.navCtrl.push(SignupPage);
	}

	runTimeChange($event) {
		this.loginForm.hasError('*', ['touched'])

	}

	//   loginWithGoogle() {
	//   this.auth.signInWithGoogle()
	//     .then(
	//       () => this.navCtrl.setRoot(HomePage),
	//       error => console.log(error.message)
	//     );
	// }

}

