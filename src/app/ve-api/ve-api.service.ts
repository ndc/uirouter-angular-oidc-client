import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserManager, UserManagerSettings, User } from 'oidc-client';

@Injectable({
  providedIn: 'root'
})
export class VeApiService {

  constructor(
    private http: HttpClient
  ) { }

  private OidcManager: UserManager;
  private OidcUser: User;

  InitializeOidc(settings: UserManagerSettings) {
    this.OidcManager = new UserManager(settings);

    // if login using redirect, check sessionStorage for value and process if available
    let signInRedirect = sessionStorage.getItem("OidcRedirect");

    if (!!signInRedirect) {
      // process hash fragment from OP saved in sessionStorage
      return this.OidcManager.signinRedirectCallback(signInRedirect).then(user => {
        this.OidcUser = user;

        // clean up
        sessionStorage.removeItem("OidcRedirect");
        this.OidcManager.clearStaleState();
      });
    } else {
      // check existing authentication if available (oidc-client uses sessionStorage)
      return this.OidcManager.getUser().then(user => {
        if (!!user) {
          this.OidcUser = user;
        }
      });
    }
  }

  IsLoggedIn() {
    return !!this.OidcUser;
  }

  GetOidcUser() {
    return this.OidcUser;
  }

  // if OP doesn't mangle redirect URL and we are using routing system to capture hash fragment so not using sessionStorage
  ProcessOidcRedirect(valueStr: string) {
    return this.OidcManager.signinRedirectCallback(valueStr).then(user => {
      this.OidcUser = user;
      this.OidcManager.clearStaleState();
      return user;
    });
  }

  StartSignInWithRedirect() {
    let prmse = this.OidcManager.signinRedirect({}).then(args => false);
    return prmse;
  }

  // simplest way is using pop up: doesn't have to remember original target, doesn't need separate HTML to capture hash fragment
  StartSignInWithPopUp() {
    let prmse = this.OidcManager.signinPopup({}).then((user: User) => {
      if (!!user) {
        this.OidcUser = user;
        return true;
      } else {
        return false;
      }
    });
    return prmse;
  }

}
