import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { LoginGuard } from '../shared/index'

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'dashboard', component: HomeComponent,canActivate:[LoginGuard]}
    ])
  ],

  exports: [RouterModule],

  providers:[LoginGuard]

})
export class HomeRoutingModule { }
