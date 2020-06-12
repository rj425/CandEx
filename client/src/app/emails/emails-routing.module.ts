import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EmailComponent } from './emails.component';
import { LoginGuard } from '../shared/index'

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'emailTemplates', component: EmailComponent,canActivate:[LoginGuard]},
      { path: 'editEmails/:templateID', component: EmailComponent,canActivate:[LoginGuard]}
    ])
  ],
  exports: [RouterModule],
  providers:[LoginGuard]
})
export class EmailRoutingModule { }
