import { NgModule } from '@angular/core';
import { RootModule, UIRouterModule } from '@uirouter/angular';

const rootModule: RootModule = {
  states: [],
  useHash: true
};

@NgModule({
  imports: [UIRouterModule.forRoot(rootModule)],
  exports: [UIRouterModule]
})
export class AppRoutingModule { }
