import { ChartContainerModule } from '../chartContainer/chartContainer.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { CandexService } from '../../shared/service/index';
import { ChartRequestsComponent } from './chartRequests.component';
import { NvD3Module } from 'ng2-nvd3';
import 'd3';
import 'nvd3';

@NgModule({
  imports: [CommonModule, SharedModule,ChartContainerModule,NvD3Module],
  declarations: [ChartRequestsComponent],
  exports: [ChartRequestsComponent],
  providers: [CandexService]
})
export class ChartRequestsModule { }
