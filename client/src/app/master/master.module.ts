import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MasterComponent } from './master.component';
import { SharedModule } from '../shared/shared.module';
import { MasterRoutingModule } from './master-routing.module';
import { CandexService } from '../shared/service/candex.service'
import { CandexListModule } from './candexList/candexList.module';


@NgModule({
	imports:[CommonModule, 
			MasterRoutingModule , 
			FormsModule, 
			ReactiveFormsModule,
			SharedModule,
			CandexListModule],

	declarations:[MasterComponent],

	exports:[MasterComponent],
	
	providers:[CandexService]
})

export class MasterModule{}