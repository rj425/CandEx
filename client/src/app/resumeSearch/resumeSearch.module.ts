import { ResumeSearchComponent,ShowHelp} from './resumeSearch.component';
import { resumeSearchRoutingModule } from './resumeSearch-routing.module';
import { SharedModule } from '../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CandexService } from '../shared/service/candex.service';


@NgModule({
  
    imports: [
      
      CommonModule,
      resumeSearchRoutingModule,
      SharedModule
      
    ],
    declarations: [ResumeSearchComponent,ShowHelp],
    entryComponents:[ShowHelp],
    exports: [ResumeSearchComponent],
    providers:[CandexService]
    
  })
  export class resumeSearchModule { }
  
