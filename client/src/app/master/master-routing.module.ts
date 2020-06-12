import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MasterComponent } from './master.component';
import { LoginGuard } from '../shared/index'

@NgModule({
	imports:[
		RouterModule.forChild([
			{path:'master',component: MasterComponent,canActivate:[LoginGuard]}
		])
	],
	exports: [RouterModule],
	providers:[LoginGuard]
})

export class MasterRoutingModule{}