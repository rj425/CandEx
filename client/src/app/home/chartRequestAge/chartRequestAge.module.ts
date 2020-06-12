import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { CandexService } from '../../shared/service/index';
import { ChartRequestAgeComponent } from './chartRequestAge.component';
import { CardContainerModule } from '../cardContainer/cardContainer.module';
import { NvD3Module } from 'ng2-nvd3';
import 'd3';
import 'nvd3';

@NgModule({
  imports: [CommonModule, SharedModule,CardContainerModule,NvD3Module],
  declarations: [ChartRequestAgeComponent],
  exports: [ChartRequestAgeComponent],
  providers: [CandexService]
})
export class ChartRequestAgeModule { }
