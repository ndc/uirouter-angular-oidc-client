import { NgModule } from '@angular/core';
import { RootModule, UIRouterModule } from '@uirouter/angular';
import { HomeComponent } from './home/home.component';

const rootModule: RootModule = {
  states: [
    {
      name: "Home",
      url: "/home",
      component: HomeComponent
    }
  ],
  useHash: true
};

@NgModule({
  imports: [UIRouterModule.forRoot(rootModule)],
  exports: [UIRouterModule]
})
export class AppRoutingModule { }
