import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserManagerSettings, UserManager, User } from 'oidc-client';

@Injectable({
  providedIn: 'root'
})
export class VeApiService {

  constructor(
    private http: HttpClient
  ) {
    let currentUrl = window.location.href;
    let config: UserManagerSettings = {
      authority: "http://kx-main.kana-test.com/ApiGeneral/Identity/openid/connect/authorize",
      client_id: "default_trusted_client",
      redirect_uri: currentUrl,
      response_type: "code",
      scope: "openid verint_express_agent_api",
      post_logout_redirect_uri: currentUrl
    };
    this.IS3UserManager = new UserManager(config);

    // get from localstorage

    this.IS3UserManager.getUser().then(user => {
      if (!!user) {
        this.IS3User = user;
      } else {
        this.IS3User = null;
      }
    });
  }

  private IS3UserManager: UserManager;
  private IS3User: User;

  getIS3UserProfile() {
    return this.IS3User.profile;
  }

  isLoggedIn() {
    return !!this.IS3User;
  }

}
