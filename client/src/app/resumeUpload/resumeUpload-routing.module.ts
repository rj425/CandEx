import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ResumeUploadComponent } from './resumeUpload.component';

import { LoginGuard } from '../shared/index'
@NgModule({
    imports: [
      RouterModule.forChild([
        { path: 'resumeUpload', component: ResumeUploadComponent,canActivate:[LoginGuard]}
      
      ])
    ],
    exports: [RouterModule],
    providers:[LoginGuard]

  })
  export class resumeUploadRoutingModule {}