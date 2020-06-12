import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ResumeSearchComponent } from './resumeSearch.component';
import { LoginGuard } from '../shared/index'
@NgModule({
	imports: [
    	RouterModule.forChild([
    		{ path: 'resumeSearch', component: ResumeSearchComponent,canActivate:[LoginGuard]}
      	])
  	],
    exports: [RouterModule],
    providers:[LoginGuard]
})
export class resumeSearchRoutingModule { }