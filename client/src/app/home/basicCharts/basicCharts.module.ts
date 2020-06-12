import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { CandexService } from '../../shared/service/index';
import { BasicChartsComponent } from './basicCharts.component';
import { ChartContainerModule } from '../chartContainer/chartContainer.module';
import { CardContainerModule } from '../cardContainer/cardContainer.module' 
import { KeyPipe } from './keyPipe' 

@NgModule({
  imports: [CommonModule, SharedModule,ChartContainerModule,CardContainerModule],
  declarations: [BasicChartsComponent,KeyPipe],
  exports: [BasicChartsComponent],
  providers: [CandexService]
})
export class BasicChartsModule { }
