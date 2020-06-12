import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CandidateofferletterComponent } from './candidateOfferLetter.component';
import { LoginGuard } from '../../shared/index'
@NgModule({
    imports: [
      RouterModule.forChild([
        { path: 'candidateOfferLetter', component: CandidateofferletterComponent,canActivate:[LoginGuard]}
      
      ])
    ],
    exports: [RouterModule],
    providers:[LoginGuard]

  })
  export class CandidateofferletterRoutingModule {}