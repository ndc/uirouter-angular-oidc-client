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

    let signInRedirect = sessionStorage.getItem("OidcRedirect");
    if (!!signInRedirect) {
      return this.OidcManager.signinRedirectCallback(signInRedirect).then(user => {
        this.OidcUser = user;
        sessionStorage.removeItem("OidcRedirect");
        this.OidcManager.clearStaleState();
      });
    } else {
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

  StartSignIn(target: string) {
    let prmse = this.OidcManager.signinRedirect({}).then((response) => false);
    return prmse;
  }

}
