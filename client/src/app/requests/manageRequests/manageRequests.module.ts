import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CandexService } from '../../shared/service/candex.service';
import { ManageRequestsComponent } from './manageRequests.component';
import { ManageRequestsRoutingModule } from './manageRequests-routing.module';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [CommonModule, ManageRequestsRoutingModule,SharedModule],
  declarations: [ManageRequestsComponent],
  exports: [ManageRequestsComponent],
  providers:[CandexService]
})
export class ManageRequestsModule {}
