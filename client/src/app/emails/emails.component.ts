import { Component,OnInit,ViewContainerRef,Input,Output } from '@angular/core';
import { CandexService } from '../shared/service/candex.service';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { Router, NavigationEnd, NavigationStart, ActivatedRoute,Params} from '@angular/router'
import { Config } from '../shared/index';
import { TinyMCEComponent } from '../shared/htmlEditor/tinyMce';
import { MatSnackBar } from '@angular/material';

@Component({
  moduleId: module.id,
  selector: 'email',
  templateUrl: 'emails.component.html',
  styleUrls: ['emails.component.css'],
  
})
export class EmailComponent implements OnInit{

	public status:number;
	
	constructor(public candexService:CandexService,private router:Router,private route:ActivatedRoute,private snackBar:MatSnackBar){}

	public submitted:boolean;
	public events: any[]=[];
	public valid:boolean;
	public jsonResponse:any;
	public templateID:number;

	public emails: any;
  	public errorMessage: string;
	pagetitle:string;
	buttonText:string;
	public requestMethod:string
	public emailBodyData:any;
	
	
	emailForm:FormGroup;
	@Input() emailBodyContent:any;

 
	ngOnInit(){

		this.route.params.map(params=>params['templateID'])
    					.subscribe(templateID => this.templateID = templateID);
    	if(this.templateID==undefined){
    		this.pagetitle="Create a New Template"
			this.buttonText="Create"
			this.requestMethod="POST"
			this.jsonResponse=true;
    	}else{
			this.pagetitle="Edit Email Template"
			this.buttonText="Save Changes"
			this.requestMethod="PUT"
			this.getEmailTemplate(this.templateID)
		}
		this.createForm()	
	}

	public createForm(){

		this.emailForm = new FormGroup({
		templateName:new FormControl(this.emails?this.emails.templateName:'',Validators.required),
		emailSubject:new FormControl(this.emails?this.emails.emailSubject:'',Validators.required),
		})
		if(this.requestMethod==='PUT')
			this.emailForm.controls['templateName'].disable()
	}

	keyUpHandlerFunction(value){
		 	this.emailBodyData=value
	}

	public onSubmit(){
		this.emailForm.value['emailBody']=this.emailBodyData
		if(this.requestMethod=='POST'){

			this.candexService.post(Config.SERVER+'/emailTemplates/',this.emailForm.value)
				  .subscribe(res=>{this.jsonResponse=res.json().results,
				  			this.goToList(res.status),
				  			this.status=res.status,
				  			this.createForm()},
				  			error=>{console.log(error),this.snackBar.open("Template Creation Failed!",'',{duration:2000})});
		
		}else if(this. requestMethod=='PUT'){
			this.emailForm.value['emailBody']=this.emailBodyData
			this.emailForm.value['templateName']=this.emails.templateName
			this.candexService.put(Config.SERVER+'/emailTemplates/'+this.templateID+'/',this.emailForm.value)
					  .subscribe(res=>{this.jsonResponse=res.json().results,
					  			this.goToList(res.status),
					  			console.log(res)},
					  			error=>{console.log(error),this.snackBar.open("Template Creation Failed!",'',{duration:2000})});
			
			
		}
	}

	public getEmailTemplate(templateID:number){
		console.log("inside getEmail()")
		this.candexService.get(Config.SERVER+'/emailTemplates/'+templateID+'/')
                      .subscribe(res => {this.emails=res.json(),
                      					this.emailBodyData=this.emails.emailBody,
                        				this.createForm()
                        			},
                        error => console.log(error),
                      );

	}

	public goToList(statusCode:number){
		if(statusCode==200 || statusCode== 201){
			if(statusCode==200)
				this.snackBar.open("Template Created Successfully!",'',{duration:2000})
			else
				this.snackBar.open("Template Updated Successfully!",'',{duration:2000})
			this.router.navigate(['listEmails'])
			this.emailForm.reset()
		}

	}

}
