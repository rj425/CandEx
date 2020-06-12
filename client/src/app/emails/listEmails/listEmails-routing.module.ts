import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListEmailComponent } from './listEmails.component';
import { LoginGuard } from '../../shared/index'

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'listEmails', component: ListEmailComponent,canActivate:[LoginGuard]}
    ])
  ],
  exports: [RouterModule],
  providers:[LoginGuard]
})
export class ListEmailRoutingModule { }
