import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, ModalController, ModalOptions } from 'ionic-angular';
import { HomePage } from '../home/home';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'as-page-signup',
  templateUrl: './signup.html'
})
export class SignupPage {
  signupError: string;
  form: FormGroup;
  myModalOptions: ModalOptions = {
    enableBackdropDismiss: false
  };

  constructor(
    fb: FormBuilder,
    private navCtrl: NavController,
    public modalCtrl: ModalController,
    private auth: AuthService
  ) {
    this.form = fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      passwordRpt: ['', Validators.compose([Validators.required, Validators.minLength(6)])]
    }, {
      validator: PasswordValidation.MatchPassword 
    });
  }

  checkTerms(){
    const myModal = this.modalCtrl.create("TermsPage", this.myModalOptions);
    myModal.present();
    myModal.onDidDismiss((terms) => {
      if(terms){
        this.signup();
      } 
    });
  }

  signup() {
    let data = this.form.value;
    let credentials = {
      email: data.email,
      password: data.password
    };
    this.auth.signUp(credentials).then(
      () => {
        //this.notificationsService.postUser(data.email);
        this.navCtrl.setRoot(HomePage)},
      error => this.signupError = error.message
    );
  }
}

import {AbstractControl} from '@angular/forms';
export class PasswordValidation {

    static MatchPassword(AC: AbstractControl) {
       let password = AC.get('password').value; // to get value in input tag
       let confirmPassword = AC.get('passwordRpt').value; // to get value in input tag
        if(password != confirmPassword) {
            console.log('false');
            AC.get('passwordRpt').setErrors( {MatchPassword: true} )
        } else {
            console.log('true');
            return null
        }
    }
}
