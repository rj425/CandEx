import { Component, OnInit, Input,OnChanges } from '@angular/core';
import { CandidateofferletterComponent } from '../candidateOfferLetter.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  moduleId: module.id,
  selector: 'app-offerLetterAttachA',
  templateUrl: './offerLetterAttachA.component.html',
  styleUrls: ['./offerLetterAttachA.component.css'],
  
})
export class OfferLetterAttachAComponent implements OnChanges  {

  ngOnChanges(changes){   
  }

  ngOnInit(){   
  }
  @Input() offerLetterForm:any;
  @Input() salaryBreakDown:any;
}
