import { Component } from '@angular/core';
import { IonicPage, NavController, ViewController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

/**
 * Generated class for the ResetPasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-reset-password',
  templateUrl: 'reset-password.html',
})
export class ResetPasswordPage {

  resetForm: FormGroup;

  constructor(public navCtrl: NavController, private auth: AuthService, 
    private viewCtrl: ViewController,
		fb: FormBuilder) {
      console.log("hooo");
      
      this.resetForm = fb.group({
        email: ['', Validators.compose([Validators.required, Validators.email])]
      });
  }

  sendEmail(){
    let data = this.resetForm.value;
    var auth = this.auth.afAuth.auth;
		var emailAddress = data.email;
		auth.sendPasswordResetEmail(emailAddress).then(function () {
      // Email sent.
      this.closeModal();
		}).catch(function (error) {
			// An error happened.
		});
  }

  closeModal(){
    this.viewCtrl.dismiss();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ResetPasswordPage');
  }

}
