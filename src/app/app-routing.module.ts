import { NgModule, Injector } from '@angular/core';
import { RootModule, UIRouterModule, Transition, TargetState, UIRouter, StatesModule, StateDeclaration, UrlRuleHandlerFn, UrlParts, TransitionService, StateService, HookMatchCriteria, TransitionHookFn } from '@uirouter/angular';
import { HomeComponent } from './home/home.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { VeApiService } from './ve-api/ve-api.service';

const rootModule: RootModule = {
  states: [
    {
      name: "Home",
      url: "/home",
      component: HomeComponent
    },
    {
      name: "OIDCRedirect",
      url: "/oidcredirect/*oidcvalues",
      resolve: [
        {
          token: "OidcUser",
          deps: [Transition, VeApiService],
          resolveFn: (trans: Transition, api: VeApiService) => {
            // capture hash fragment from OP
            let valueStr: string = trans.params().oidcvalues;

            return api.ProcessOidcRedirect(valueStr);
          }
        }
      ],
      onEnter: (trans: Transition, state: StateDeclaration) => {
        // wait for oidc-client to finish processing OP's hash fragment
        return trans.injector().getAsync("OidcUser").then(user => {
          // recall the original target before user is asked to authenticate
          let originalTarget = JSON.parse(sessionStorage.getItem("OriginalTarget"));
          let target = trans.router.stateService.target(originalTarget.name, originalTarget.params);

          // clean up temporary storage
          sessionStorage.removeItem("OriginalTarget");

          // redirect to original target
          return target;
        });
      }
    },
    {
      name: "Profile",
      url: "/profile",
      component: UserProfileComponent,
      resolve: [
        {
          token: "OidcProfile",
          deps: [VeApiService],
          resolveFn: (api: VeApiService) => {
            let userStr = JSON.stringify(api.GetOidcUser());
            return userStr;
          }
        }
      ],
      data: {
        requiresAuth: true
      }
    }
  ],
  config: (uiRouter, injector, statesModule) => {
    let otherwiseHandler: UrlRuleHandlerFn = (matchValue: any, url: UrlParts, router: UIRouter) => {
      return "/home";
    };
    uiRouter.urlService.rules.otherwise(otherwiseHandler);

    let api = injector.get(VeApiService);

    // if OP doesn't mangle the redirect URL that we gave it, we can capture inside the routing system
    let redirectUriUsingRouting = window.location.href.split("#")[0] + "#/oidcredirect/";

    // if OP mangles the redirect URL that we gave it, we need a separate HTML page to capture the hash fragment
    let redirectUriUsingOutside = window.location.href.split("#")[0] + "assets/oidcredirect.html";

    // provide settings to oidc-client and ask it to read existing authentication if available
    InitializeOidc(api, redirectUriUsingRouting).then(() => {
      // adding authorization guard must be done after oidc-client is ready
      requiresAuthHook(uiRouter.transitionService, api, uiRouter.stateService);
    });
  },
  useHash: true
};

export function InitializeOidc(api: VeApiService, oidcRedirectUri: string) {
  return api.InitializeOidc({
    authority: "https://demo.identityserver.io",
    client_id: "implicit",
    redirect_uri: oidcRedirectUri,
    response_type: "id_token token",
    scope: "openid profile email api"
  });
}

export function requiresAuthHook(trans: TransitionService, api: VeApiService, state: StateService) {
  // if a route has 'data' and the data contains requiresAuth that is truthy ...
  const requiresAuthCriteria: HookMatchCriteria = {
    to: (state) => !!state.data && !!state.data.requiresAuth
  };

  // ... then check if user is logged in. If not ...
  const redirectToLogin: TransitionHookFn = (transition) => {
    if (!api.IsLoggedIn()) {
      // memorize original target in sessionStorage before asking user to authenticate
      let originalTarget = {
        name: transition.targetState().name(),
        params: transition.targetState().params()
      }
      let originalTargetStr = JSON.stringify(originalTarget);
      sessionStorage.setItem("OriginalTarget", originalTargetStr);

      // redirect to login page
      return api.StartSignInWithRedirect();

      // or use pop up to login
      return api.StartSignInWithPopUp();
    }
  };

  // activate this rule
  trans.onBefore(requiresAuthCriteria, redirectToLogin, { priority: 10 });
}

@NgModule({
  imports: [UIRouterModule.forRoot(rootModule)],
  exports: [UIRouterModule]
})
export class AppRoutingModule { }
