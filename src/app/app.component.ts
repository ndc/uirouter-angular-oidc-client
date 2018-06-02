import { Component, OnInit } from '@angular/core';
import { VeApiService } from './ve-api/ve-api.service';
import { StateService } from '@uirouter/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(
    private api: VeApiService,
    private state: StateService
  ) { }

  ngOnInit() {
    let redirectUri = this.state.href("OIDCRedirect", null, { absolute: true });
    this.api.InitiateIS3({
      authority: "https://demo.identityserver.io",
      client_id: "native.hybrid",
      redirect_uri: redirectUri,
      response_type: "code",
      scope: "openid profile api"
    });
  }

}
