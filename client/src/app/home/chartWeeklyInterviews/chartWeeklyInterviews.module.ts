import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { CandexService } from '../../shared/service/index';
import { ChartWeeklyInterviewsComponent } from './chartWeeklyInterviews.component';
import { CardContainerModule } from '../cardContainer/cardContainer.module';
import { KeyPipe } from './keyPipe' 

@NgModule({
  imports: [SharedModule,CardContainerModule],
  declarations: [ChartWeeklyInterviewsComponent,KeyPipe],
  exports: [ChartWeeklyInterviewsComponent],
  providers: [CandexService]
})
export class ChartWeeklyInterviewsModule{}
