import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { CandexService } from '../../shared/service/index';
import { ChartCostPerHireComponent } from './chartCostPerHire.component';
import { CardContainerModule } from '../cardContainer/cardContainer.module';
import { NvD3Module } from 'ng2-nvd3';
import 'd3';
import 'nvd3';

@NgModule({
  imports: [CommonModule, SharedModule,CardContainerModule,NvD3Module],

  declarations: [ChartCostPerHireComponent],
  exports: [ChartCostPerHireComponent],
  providers: [CandexService]
})
export class ChartCostPerHireModule { }
