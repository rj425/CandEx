import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { CandexService } from '../../shared/service/candex.service'
import { CandexListComponent} from './candexList.component';
import { DialogOverviewExampleDialog } from './candexList.component';
import { KeysPipe } from './keyValue.pipe'
import { ValuePipe } from './value.pipe';


@NgModule({
	imports:[CommonModule , FormsModule, ReactiveFormsModule,SharedModule],
	declarations:[CandexListComponent,KeysPipe,ValuePipe,DialogOverviewExampleDialog],
	entryComponents: [DialogOverviewExampleDialog],
	exports:[CandexListComponent],
	providers:[CandexService]
})

export class CandexListModule{}