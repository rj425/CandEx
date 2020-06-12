import { Component,OnInit,ViewContainerRef } from '@angular/core';
import { Request } from './request.interface';
import { Config,CandexService,ProgressBarService } from '../shared/index';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { Router,ActivatedRoute } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import * as _ from 'underscore';
import { MatSnackBar } from '@angular/material';

@Component({
  	moduleId: module.id,
  	selector: 'requests',
  	templateUrl: 'requests.component.html',
  	styleUrls: ['requests.component.css']
})
export class RequestsComponent implements OnInit{

	constructor(private candexService:CandexService,
				private router:Router,
				private route:ActivatedRoute,
				public snackBar: MatSnackBar,
				public progressBarService:ProgressBarService){}

	public title:string
	public buttonName:string
	public requestMethod:string
	public requestID:number
	public requestData:any=null
	public jsonResponse:any;
	public requestForm:FormGroup;
	public departmentData:any;
	public designationData:any;
	public skillData:any;
	public positionData:any
	public skillSet:any;
	public selectedSkill:any="";
	public templateData:any;
	public statusList=["Open","Closed","On Hold"]
	public selectedDeptObj:string=null
	public mailNotification:boolean=true

	ngOnInit(){
		this.getMasters();
		this.candexService.get(Config.SERVER+'/emailTemplates/')
							.subscribe(res=>this.templateData=res.json().results,
										error=>console.log(error))
		this.route.params.map(params=>params['requestID'])
						.subscribe(requestID=>this.requestID=requestID);

		if(this.requestID==undefined){
			this.title="Raise a Request"
			this.buttonName="Raise Request"
			this.requestMethod="POST"
		}
		else{
			this.title="Update Request"
			this.buttonName="Update Request"
			this.requestMethod="PUT"
			this.getRequest(this.requestID)

		}
		this.createForm()	
	}

	public getRequest(requestID:number){
		this.candexService.get(Config.SERVER+'/requests/'+this.requestID+'/')
							.subscribe(res=>{this.requestData=res.json(),
											this.stringToObject()
											this.skillStringToArray(),
											this.skillSet=this.requestData.skills,
											this.createForm()
										},
										error=>console.log(error))
	}

	public createForm(){
		this.requestForm=new FormGroup({
			requestStatus:new FormControl(this.requestData?this.requestData.requestStatus:'Open',Validators.required),
			experienceYears:new FormControl(this.requestData?this.requestData.experienceYears:null,Validators.required),
			experienceMonths:new FormControl(this.requestData?this.requestData.experienceMonths:null,Validators.required),
			skills:new FormControl(this.requestData?this.requestData.skills:null,Validators.required),
			position:new FormControl(this.requestData?this.requestData.position:'',Validators.required),
			designation:new FormControl(this.requestData?this.requestData.designation:'',Validators.required),
			department:new FormControl(this.requestData?this.requestData.department:'',Validators.required),
		})
	}
	
	public onSubmit(){
		this.requestForm.disable()
		this.progressBarService.setProgressBarVisibility(true)
		this.selectedDeptObj=this.requestForm.value['department']
		this.requestForm.value['department']=this.requestForm.value['department'].departmentName
		if(this.requestMethod=="POST"){
			this.requestForm.value.skills=this.skillSet
			this.candexService.post(Config.SERVER+'/requests/',this.requestForm.value)
							  .subscribe(res=>{this.jsonResponse=res.json(),
							  			this.progressBarService.setProgressBarVisibility(false),
							  			this.gotToRequestList(res.status)},
							  			error=>{console.log(error),this.snackBar.open("Request Creation Failed!",'',{duration:2000}),this.progressBarService.setProgressBarVisibility(false),this.requestForm.enable()});
		}
		else if(this.requestMethod=="PUT"){
			this.requestForm.value.skills=this.skillSet
			this.candexService.put(Config.SERVER+'/requests/'+this.requestID+'/',this.requestForm.value)
							  .subscribe(res=>{this.jsonResponse=res.json()
							  			this.progressBarService.setProgressBarVisibility(false),
							  			this.gotToRequestList(res.status)},
							  			error=>{console.log(error),this.snackBar.open("Request Updation Failed!",'',{duration:2000}),this.progressBarService.setProgressBarVisibility(false),this.requestForm.enable()});
		}
	}

	public gotToRequestList(statusCode:number){
		if(statusCode==201 || statusCode==200){	
			if(this.mailNotification==true){
				this.sendMail()			
			}
			this.router.navigate(['manageRequests'])
			statusCode==201?this.snackBar.open("Request Created Successfully!",'',{duration:2000}):this.snackBar.open("Request Updated Successfully!",'',{duration:2000})
			this.requestForm.reset();
		}
	}

	public sendMail(){
		let emailParams:any={};
		let templateObj:any;
		emailParams['templateData']=this.jsonResponse
		if(this.requestMethod==='POST')
			emailParams['templateName']='Request Creation'
		else if(this.requestMethod==='PUT')
			emailParams['templateName']='Request Updation'		
		if(this.selectedDeptObj!==null){
			emailParams['templateData']['department']=this.selectedDeptObj
			emailParams['recipients']=this.selectedDeptObj['departmentManagerEmail']
		}
		this.candexService.post(Config.SERVER+'/sendmail/',emailParams)
							.subscribe(res=>{res.status===200?this.snackBar.open("Email sent to Department Manager!",'',{duration:2000}):''},
										error=>{console.log(error),this.snackBar.open("Email Sending Failed!",'',{duration:2000})})
	}

	public getMasters(){
		this.candexService.get(Config.SERVER+'/department/')
							.subscribe(res=>{this.departmentData=res.json().results},
										error=>console.log(error))
		this.candexService.get(Config.SERVER+'/designation/')
							.subscribe(res=>{this.designationData=res.json().results},
										error=>console.log(error))
		this.candexService.get(Config.SERVER+'/skills/')
							.subscribe(res=>{this.skillData=res.json().results},
										error=>console.log(error))
		this.candexService.get(Config.SERVER+'/position/')
							.subscribe(res=>{this.positionData=res.json().results},
										error=>console.log(error))
	}

	public skillStringToArray(){
		let skills:string=this.requestData.skills
		this.selectedSkill=skills.split(',')
	}

	public addSkills(x:any){
		for(let i in x){
			if(i==='0')
				this.skillSet=x[i]
			else 
				this.skillSet=this.skillSet+","+x[i]
		}
	}

	public stringToObject(){
		for(let i=0;i<this.departmentData.length;i++){
			if(this.departmentData[i].departmentName===this.requestData.department){
				this.requestData.department=this.departmentData[i]
				break
			}
		}
	}

}
