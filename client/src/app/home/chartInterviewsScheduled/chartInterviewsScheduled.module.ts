import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { CandexService } from '../../shared/service/index';
import { ChartInterviewsScheduledComponent } from './chartInterviewsScheduled.component';
import { CardContainerModule } from '../cardContainer/cardContainer.module';

@NgModule({
  imports: [SharedModule, CardContainerModule],
  declarations: [ChartInterviewsScheduledComponent],
  exports: [ChartInterviewsScheduledComponent],
  providers: [CandexService]
})
export class ChartInterviewsScheduledModule{}
