import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { EmployeeDetailsComponent } from './employeeDetails.component';
import { EmployeeDetailsRoutingModule } from './employeeDetails-routing.module';
import { CandexService } from '../../shared/service/candex.service';


@NgModule({
  imports: [CommonModule,
  			ReactiveFormsModule,
  			SharedModule,
  			EmployeeDetailsRoutingModule],

  declarations: [EmployeeDetailsComponent],

  exports: [EmployeeDetailsComponent],

  providers:[CandexService]

})
export class EmployeeDetailsModule { }