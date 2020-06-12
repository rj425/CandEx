import { ResumeUploadComponent,ShowFileDetails,ShowErrorDetails} from './resumeUpload.component';
import { resumeUploadRoutingModule } from './resumeUpload-routing.module';
import { SharedModule } from '../shared/shared.module';
import { NgModule } from '@angular/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { CandexService } from '../shared/service/candex.service';
import { RouterService} from '../shared/service/router.service';
import { FormsModule } from '@angular/forms';
import { NvD3Module } from 'ng2-nvd3';
import 'd3';
import 'nvd3';
@NgModule({
  
    imports: [
      CommonModule,
      resumeUploadRoutingModule,
      SharedModule,
      FormsModule,
      MatPaginatorModule,NvD3Module
    ],
    declarations: [ResumeUploadComponent,ShowFileDetails,ShowErrorDetails],
    entryComponents:[ShowFileDetails,ShowErrorDetails],
    exports: [ResumeUploadComponent,MatPaginatorModule],
    providers:[CandexService,RouterService]
    
  })
  export class resumeUploadModule { }
  