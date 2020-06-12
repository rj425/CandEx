import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AnnualHolidaysComponent } from './annualHolidays.component';
import { LoginGuard } from '../../shared/index'

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'annualHolidays', component: AnnualHolidaysComponent,canActivate:[LoginGuard] }
      
    ])
  ],
  exports: [RouterModule],
  providers:[LoginGuard]
})
export class AnnualHolidaysRoutingModule { }