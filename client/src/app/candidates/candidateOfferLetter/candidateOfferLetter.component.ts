import { Component, OnInit, Input } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 
import { MatFormFieldModule} from '@angular/material';
import { SalaryBreakDown}  from './salaryBreakDown';
import {Location} from '@angular/common';
import { DatePipe } from '@angular/common/src/pipes';



@Component({
  moduleId: module.id,
  selector: 'app-candidateOfferLetter',
  templateUrl: './candidateOfferLetter.component.html',
  styleUrls: ['./candidateOfferLetter.component.css'],
  
})



 export  class CandidateofferletterComponent implements OnInit {
  salaryBreakDown: any;
  firstName: any;
  offerAcceptanceDate: any;
  maxDate=new Date();
  permanentAddress1: any;
  permanentAddress2: any;
  permanentAddress3: any;
  permanentAddress4: any;
  lastName:any;
  fatherName:any;
  age:any;
  relation:any;
  mobile:any;
  country:any;
  dateOfBirth:any;
  permanentAddress:any;
  jobTitle:any;
  offerDate:any;
  startDate:any;
  annualIncome:any;
  annualIncentive:any;
  showAll=false;
  showOfferLetter=false;
  showAttachmentA=false;
  showAttachmentB=false;
  showAttachmentC=false;
  public signatures={
    "Sathya":undefined,
    "Melinda":undefined
  }
  public selectedValue=undefined
  constructor( public router:Router, public route: ActivatedRoute) {
    
   } 

  public offerletterForm:FormGroup; 
  
  ngOnInit() {
    console.log("ON NGONIT",this.signatures)
    this.createForm()
 }

  public createForm(){
		    this.offerletterForm=new FormGroup({
      
        personal:new FormGroup({
        firstName:new FormControl(null,[Validators.required,Validators.pattern('[a-zA-Z \-\']+')]),
        lastName:new FormControl('',[Validators.required,Validators.pattern('[a-zA-Z \-\']+')]),
        permanentAddress1:new FormControl('',Validators.required),
        permanentAddress2:new FormControl('',[Validators.required,Validators.pattern('[a-zA-Z\-\']+')]),
        permanentAddress3:new FormControl('',[Validators.required,Validators.pattern('[a-zA-Z \-\']+')]),
        permanentAddress4:new FormControl(null,[Validators.required,Validators.pattern('[0-9][0-9][0-9][0-9][0-9][0-9]')])
      }),
        costoffer:new FormGroup({
        jobTitle:new FormControl('',[Validators.required,Validators.pattern('^[a-zA-Z \-\']+')]),
        supervisorTitle:new FormControl('',[Validators.required,Validators.pattern('^[a-zA-Z \-\']+')]),
        offerDate:new FormControl(null,Validators.required),
        offerAcceptanceDate:new FormControl(null,Validators.required),
        startDate:new FormControl(null,Validators.required),
        noticePeriod:new FormControl(null,Validators.required),
        annualIncome:new FormControl(null,Validators.required),
        annualIncentive:new FormControl(null,Validators.required)
      })

    })
   /**
    * name
    */
}
public onSubmit(){
    this.offerletterForm.disable()
    this.showAll=true;
    this.showOfferLetter=true;
    this.showAttachmentB=false;
    this.showAttachmentC=false;
    this.showAttachmentA=false;

    // Changing Date Format
    var dob=this.offerletterForm.value.personal.dateOfBirth
    var ofd=this.offerletterForm.value.costoffer.offerDate
    var ofad=this.offerletterForm.value.costoffer.offerAcceptanceDate
    var sd=this.offerletterForm.value.costoffer.startDate   
    let x= new SalaryBreakDown(this.offerletterForm.value.costoffer.annualIncome,this.offerletterForm.value.costoffer. annualIncentive);
    this.salaryBreakDown=x.salaryBreakdown;
     
}

onPrint():void{
    let printContents, popupWin,foot,head;
    printContents = document.getElementById('maincontainer').innerHTML;

    popupWin = document.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
      <body onload="window.print();window.close()">
        ${printContents}
      </body>
      </html>`
    );
 
  popupWin.document.close();
}

createMapping(file){
    var reader= new FileReader();
     reader.readAsDataURL(file[0])
     var imageSource:string;
     reader.onload=(e:any)=>{
      this.signatures[this.selectedValue]=e.target.result;
      console.log("CREATe MAPPOMG",this.signatures)
      }
    }
  
    
goToGenerateOfferletter(){

    this.showAll=false;
    this.showOfferLetter=false;
    this.offerletterForm.enable();
}

goToShowAttachmentA(){

   this.showOfferLetter=false;
   this.showAttachmentA=true;
   this.showAttachmentB=false;
   this.showAttachmentC=false;
}


goToShowAttachmentB(){

   this.showOfferLetter=false;
   this.showAttachmentA=false;
   this.showAttachmentB=true;
   this.showAttachmentC=false;
  
}

goToShowAttachmentC(){

   this.showOfferLetter=false;
   this.showAttachmentA=false;
   this.showAttachmentB=false;
   this.showAttachmentC=true;
}

goToShowOfferLetter(){
  
  this.showOfferLetter=true;
  this.showAttachmentA=false;
  this.showAttachmentB=false;
  this.showAttachmentC=false;
}
}

