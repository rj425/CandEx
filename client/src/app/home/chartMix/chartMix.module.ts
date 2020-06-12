import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { CandexService } from '../../shared/service/index';
import { ChartMixComponent } from './chartMix.component';
import { ChartContainerModule } from '../chartContainer/chartContainer.module';
import { NvD3Module } from 'ng2-nvd3';
import 'd3';
import 'nvd3';

@NgModule({
	imports: [SharedModule,ChartContainerModule,NvD3Module],
	declarations: [ChartMixComponent],
	exports: [ChartMixComponent],
	providers: [CandexService]
})
export class ChartMixModule { }
