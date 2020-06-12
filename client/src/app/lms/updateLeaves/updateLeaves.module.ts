import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { UpdateLeavesComponent } from './updateLeaves.component';
import { UpdateLeavesRoutingModule } from './updateLeaves-routing.module';
import { CandexService } from '../../shared/service/candex.service';


@NgModule({
  imports: [CommonModule,
  			ReactiveFormsModule,
  			SharedModule,
  			UpdateLeavesRoutingModule],

  declarations: [UpdateLeavesComponent],

  exports: [UpdateLeavesComponent],

  providers:[CandexService]

})
export class UpdateLeavesModule { }