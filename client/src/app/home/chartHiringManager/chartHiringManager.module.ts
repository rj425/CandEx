import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { CandexService } from '../../shared/service/index';
import { ChartHiringManagerComponent } from './chartHiringManger.component';
import { ChartContainerModule } from '../chartContainer/chartContainer.module';
import { NvD3Module } from 'ng2-nvd3';
import 'd3';
import 'nvd3';

@NgModule({
  imports: [CommonModule, SharedModule,ChartContainerModule,NvD3Module],
  declarations: [ChartHiringManagerComponent],
  exports: [ChartHiringManagerComponent],
  providers: [CandexService]
})
export class ChartHiringManagerModule { }
