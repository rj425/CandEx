import { ChartContainerModule } from '../chartContainer/chartContainer.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { CandexService } from '../../shared/service/index';
import { ChartEducationComponent } from './chartEducation.component';
import { NvD3Module } from 'ng2-nvd3';
import 'd3';
import 'nvd3';

@NgModule({
  imports: [CommonModule, SharedModule,ChartContainerModule,NvD3Module],
  declarations: [ChartEducationComponent],
  exports: [ChartEducationComponent],
  providers: [CandexService]
})
export class ChartEducationModule { }
