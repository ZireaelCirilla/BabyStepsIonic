import { Injectable } from '@angular/core';
//import { Storage } from '@ionic/storage';
/*
  Generated class for the GlobalProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class GlobalProvider {

  public editMode: boolean = false;
  public update = false;
  public cloud = false;
  public delete = false;
  public offLine = false;

}
