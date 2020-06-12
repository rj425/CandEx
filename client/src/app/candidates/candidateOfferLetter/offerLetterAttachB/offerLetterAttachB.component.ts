import { Component, OnInit, Input } from '@angular/core';


@Component({
  selector: 'app-offerLetterAttachB',
  templateUrl: './offerLetterAttachB.component.html',
  styleUrls: ['./offerLetterAttachB.component.css']
})
export class OfferLetterAttachBComponent implements OnInit {

  constructor(){}

  ngOnInit(){
  
  }
  @Input() offerLetterForm:any;
  @Input() signatures:any;
  
}
