import { NgModule } from '@angular/core';
import { RootModule, UIRouterModule, Transition, StateService, TargetState, UrlRuleHandlerFn, StateDeclaration } from '@uirouter/angular';
import { HomeComponent } from './home/home.component';

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
        return trans.router.stateService.go("Home");
      }
    }
  ],
  config: (uiRouter, injector, statesModule) => {
    let otherwiseHandler: UrlRuleHandlerFn = (matchvalue, url, router) => {
      return "/home";
    };
    uiRouter.urlService.rules.otherwise(otherwiseHandler);
  },
  useHash: true
};

@NgModule({
  imports: [UIRouterModule.forRoot(rootModule)],
  exports: [UIRouterModule]
})
export class AppRoutingModule { }
