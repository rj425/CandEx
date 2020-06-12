import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UpdateLeavesComponent } from './updateLeaves.component';
import { LoginGuard } from '../../shared/index'

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'updateLeaves', component: UpdateLeavesComponent,canActivate:[LoginGuard] }
      
    ])
  ],
  exports: [RouterModule],
  providers:[LoginGuard]
})
export class UpdateLeavesRoutingModule { }