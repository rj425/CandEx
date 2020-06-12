import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListUserComponent } from './listUsers.component';
import { LoginGuard } from '../../shared/index'

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'listUsers', component: ListUserComponent,canActivate:[LoginGuard]}
    ])
  ],
  exports: [RouterModule],
  providers:[LoginGuard]
})
export class ListUserRoutingModule { }
