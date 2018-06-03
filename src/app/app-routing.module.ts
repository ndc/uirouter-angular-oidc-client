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
      url: "/oidcredirect",
      onEnter: (trans: Transition, state: StateDeclaration) => {
        trans.router.stateService.go("Home");
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
    InitializeOidc(api).then(() => {
      requiresAuthHook(uiRouter.transitionService, api, uiRouter.stateService);
    });
  },
  useHash: true
};

export function InitializeOidc(api: VeApiService) {
  let redirectUri = window.location.href.split("#")[0]
    + "assets/oidcredirect.html";
  return api.InitializeOidc({
    authority: "https://demo.identityserver.io",
    client_id: "implicit",
    redirect_uri: redirectUri,
    response_type: "id_token token",
    scope: "openid profile email api"
  });
}

export function requiresAuthHook(trans: TransitionService, api: VeApiService, state: StateService) {
  const requiresAuthCriteria: HookMatchCriteria = {
    to: (state) => !!state.data && !!state.data.requiresAuth
  };

  const redirectToLogin: TransitionHookFn = (transition) => {
    if (!api.IsLoggedIn()) {
      let target = state.href(
        transition.targetState().name(),
        transition.targetState().params(),
        { absolute: true });
      return api.StartSignIn(target);
    }
  };

  trans.onBefore(requiresAuthCriteria, redirectToLogin, { priority: 10 });
}

@NgModule({
  imports: [UIRouterModule.forRoot(rootModule)],
  exports: [UIRouterModule]
})
export class AppRoutingModule { }
