import { Component,OnInit,ViewContainerRef } from '@angular/core';
import { Http,Headers } from '@angular/http';
import { CandexService,Config } from '../../shared/index';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { Router,ActivatedRoute,Params} from '@angular/router'
import { MatSnackBar } from '@angular/material';



@Component({
  moduleId: module.id,
  selector: 'candidateFeedback',
  templateUrl: 'candidateFeedback.component.html',
  styleUrls: ['candidateFeedback.component.css']
  
})
export class CandidateFeedbackComponent implements OnInit{

	feedbackForm:any;
	private authorizationHeader:Headers=null;
	jsonResponse:any;
	candidateID:any;
	showFeedbackForm:any;
	secretKey:any;
	feedbackID:any;
	showError:any=true;
	feedbackObject:any;
	feedbackSumitted:any=null;

	constructor(public candexService:CandexService,
				private router:Router,
				private route:ActivatedRoute,
				public snackBar: MatSnackBar){}

	
	ngOnInit(){
		this.feedbackForm=new FormGroup	({
			candidateID:new FormControl('',Validators.required), 
			feedback:new FormControl('',Validators.required	),
			status:new FormControl('')

		})
		
		this.route.queryParams.subscribe(params=>{
							   		this.candidateID=params['candidateID'],
							   		this.feedbackID=params['feedbackID'],
							   		this.secretKey=params['secretKey']
							   })

		this.candexService.postForAuthToken(Config.SERVER+'/authToken/',{'username':'panelMembers','password':'panel123'})
						   .subscribe(res=>{this.authorizationHeader=this.candexService.createAuthorizationHeader(res.json().token),
						   					this.getFeedbackObject()},
						   			  error=>console.log(error))

	}

	getFeedbackObject(){
		this.candexService.get(Config.SERVER+'/candidateFeedback/'+this.feedbackID+'/',undefined,this.authorizationHeader)
							  .subscribe(res=>{this.feedbackObject=res.json(),
							  		console.log(this.feedbackObject)
							  		this.verifyKey()},
							  			error=>console.log(error));
	}

	verifyKey(){
		if(this.feedbackObject!=undefined){
			if(this.feedbackObject.secretKey==this.secretKey){
				this.showError=false;
				if(this.feedbackObject.status=='Submitted'){
					this.feedbackSumitted=true;
					this.feedbackForm.controls['feedback'].setValue(this.feedbackObject['feedback'])
					this.feedbackForm.controls['feedback'].disable()
				}

			}
		}
	}

	
	onSubmit(){
		this.feedbackForm.controls['candidateID'].setValue(this.candidateID)
		this.feedbackForm.controls['status'].setValue('Submitted')
		this.candexService.put(Config.SERVER+'/candidateFeedback/'+this.feedbackID+'/',this.feedbackForm.value,this.authorizationHeader)
							  .subscribe(res=>{this.jsonResponse=res.json(),
							  			this.checkStatus(res.status)
							  		},
							  			error=>{console.log(error),this.snackBar.open("Feedback Submission Failed!",'',{duration:2000})});


	}

	checkStatus(statusCode:any){
		if(statusCode==200||statusCode==204){
			this.snackBar.open("Submission successful.Thank you for your feedback",'',{duration:2000})
			this.feedbackForm.disable()
			this.feedbackSumitted=true;
		}
	}

}