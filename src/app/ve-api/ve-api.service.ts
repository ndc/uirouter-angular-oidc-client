import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserManagerSettings, UserManager, User } from 'oidc-client';

@Injectable({
  providedIn: 'root'
})
export class VeApiService {

  constructor(
    private http: HttpClient
  ) { }

  private IS3UserManager: UserManager;
  private IS3User: User;

  InitiateIS3(settings: UserManagerSettings) {
    this.IS3UserManager = new UserManager(settings);
  }

  async IsLoggedIn() {
    if (!!this.IS3User) {
      return true;
    }

    let user = await this.IS3UserManager.getUser();

    if (!!user) {
      this.IS3User = user;
      return true;
    }

    this.IS3User = null;
    return false;
  }

  GetIS3UserProfile() {
    return this.IS3User.profile;
  }

  async StartSignInMainWindow() {
    let parms = {
      redirect_uri: null,
      display: null,
      popupWindowFeatures: null,
      popupWindowTarget: null
    };
    let a = await this.IS3UserManager.signinPopup();
    return a;
  }

}
