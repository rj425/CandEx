import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-offerLetterAttachC',
  templateUrl: './offerLetterAttachC.component.html',
  styleUrls: ['./offerLetterAttachC.component.css']
})
export class OfferLetterAttachCComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  @Input() offerLetterForm:any;
}
