import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { AnnualHolidaysComponent } from './annualHolidays.component';
import { AnnualHolidaysRoutingModule } from './annualHolidays-routing.module';
import { CandexService } from '../../shared/service/candex.service';


@NgModule({
  imports: [CommonModule,
  			ReactiveFormsModule,
  			SharedModule,
  			AnnualHolidaysRoutingModule],

  declarations: [AnnualHolidaysComponent],

  exports: [AnnualHolidaysComponent],

  providers:[CandexService]

})
export class AnnualHolidaysModule { }