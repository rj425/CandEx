import { NgModule } from '@angular/core';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { SharedModule } from '../shared/shared.module';
import { CandexService } from '../shared/service/index';

import { ChartWeeklyInterviewsModule } from './chartWeeklyInterviews/chartWeeklyInterviews.module';
import { ChartFutureStartsModule } from './chartFutureStarts/chartFutureStarts.module';
import { ChartRequestsModule } from './chartRequests/chartRequests.module';
import { ChartMixModule } from './chartMix/chartMix.module';
import { ChartHiringManagerModule } from './chartHiringManager/chartHiringManager.module';
import { ChartRecruitersModule } from './chartRecruiters/chartRecruiters.module';
import { ChartCostPerHireModule } from './chartCostPerHire/chartCostPerHire.module'
import { ChartEmployerModule } from './chartEmployer/chartEmployer.module'
import { ChartEducationModule } from './chartEducation/chartEducation.module'
import { BasicChartsModule } from './basicCharts/basicCharts.module'
import { ChartInterviewsScheduledModule } from './chartInterviewsScheduled/chartInterviewsScheduled.module'
import { ChartContainerModule } from './chartContainer/chartContainer.module'
import { ChartRequestAgeModule } from './chartRequestAge/chartRequestAge.module';
import { CardContainerModule } from './cardContainer/cardContainer.module' 

@NgModule({

  imports: [HomeRoutingModule,
  			SharedModule,
  			ChartContainerModule,
        CardContainerModule,
        ChartWeeklyInterviewsModule,
        ChartFutureStartsModule,
        ChartRecruitersModule,
        ChartRequestsModule,
        ChartMixModule,
        ChartHiringManagerModule,
        ChartCostPerHireModule,
        ChartEmployerModule,
        BasicChartsModule,
        ChartInterviewsScheduledModule,
        ChartEducationModule,
        ChartRequestAgeModule],
        
  declarations: [HomeComponent],
  exports: [HomeComponent],
  providers: [CandexService]

})
export class HomeModule { }
