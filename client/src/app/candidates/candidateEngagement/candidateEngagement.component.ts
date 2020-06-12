import { Component,OnInit,ViewContainerRef } from '@angular/core';
import { CandexService } from '../../shared/service/candex.service';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { Router,ActivatedRoute } from '@angular/router'
import { Config } from '../../shared/index'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import * as _ from 'underscore';
import { MatSnackBar } from '@angular/material';

@Component({
  	moduleId: module.id,
  	selector: 'candidateEngagement',
  	templateUrl: 'candidateEngagement.component.html',
  	styleUrls: ['candidateEngagement.component.css']
})
export class CandidateEngagementComponent implements OnInit{
	engagementForm:FormGroup=null
	candidate:any=null
	candidateID:any
	formCreated:any=false;
	actionList:any=[];
	noticePeriod:any;
	statusList=[{key:'Taken',value:true},{key:'Not Taken',value:false}]

	constructor(private candexService:CandexService,
				private router:Router,
				private route:ActivatedRoute,
				public snackBar: MatSnackBar){}

	ngOnInit(){
		this.formCreated=false;
		this.route.params.map(params=>params['candidateID'])
						 .subscribe(candidateID=>this.candidateID=candidateID)
		this.getCandidateInfo()
	}

	getCandidateInfo(){
		this.candexService.get(Config.SERVER+'/candidates/'+this.candidateID+'/')
						  .subscribe(
						  			res=>{this.candidate=res.json(),
				  						this.getActionList()},
						  			error=>console.log(error))
	}

	getActionList(){
		this.candexService.get(Config.SERVER+'/engagementActions/')
						  .subscribe(
						  			res=>{this.actionList=res.json().results,
							  			  this.calculateNoticePeriod()},
						  			error=>console.log(error))
	}

	calculateNoticePeriod(){
		if(this.candidate.offer.joiningDate!=null && this.candidate.offer.offerDate!=null){
			let joiningDate:any=new Date(this.candidate.offer.joiningDate)
			let offerDate:any=new Date(this.candidate.offer.offerDate)
			let noticePeriod=Math.abs(joiningDate-offerDate)
			this.noticePeriod=noticePeriod/(60*60*24*1000)
		}
		this.createForm()
	}

	createForm(){
		this.engagementForm=new FormGroup({
			engagements:new FormArray(this.initAction(this.candidate?this.candidate.engagements.length:0))
		})
		this.formCreated=true
	}

	public initAction(length:number):FormGroup[]{
		let actionArray:FormGroup[]=[]
		if(length==0){
			actionArray.push(new FormGroup({
								candidateID:new FormControl(this.candidate.candidateID),
								engagementID:new FormControl(null),
								responsibilityHolder:new FormControl('',[Validators.pattern("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?"),Validators.required]),
								action:new FormControl(null,Validators.required),
								dueDate:new FormControl(null,Validators.required),
								status:new FormControl(false,Validators.required)					
								}))
		}else{
			for(let i=0;i<length;i++){
				let action=null
				for(let obj of this.actionList){
					if(obj['actionID']==this.candidate.engagements[i].action['actionID'])
						action=obj
				}
				actionArray.push(new FormGroup({
								candidateID:new FormControl(this.candidate?this.candidate.candidateID:null),
								engagementID:new FormControl(this.candidate?this.candidate.engagements[i].engagementID:null),
								responsibilityHolder:new FormControl(this.candidate?this.candidate.engagements[i].responsibilityHolder:null,[Validators.pattern("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?"),Validators.required]),
								action:new FormControl(action,Validators.required),
								dueDate:new FormControl(this.candidate?this.candidate.engagements[i].dueDate:null,Validators.required),				
								status:new FormControl(this.candidate?this.candidate.engagements[i].status:false,Validators.required)					
								})
				)
			}
		}
		return actionArray
	}

	public addAction(){
		let actionControl=<FormArray>this.engagementForm.controls['engagements'];
		actionControl.push(new FormGroup({
								candidateID:new FormControl(this.candidate.candidateID),
								engagementID:new FormControl(null),
								responsibilityHolder:new FormControl('',[Validators.pattern("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?"),Validators.required]),
								action:new FormControl(null,Validators.required),
								dueDate:new FormControl(null,Validators.required),
								status:new FormControl(false,Validators.required)										
								})
						)
	}

	public removeAction(i:number){
		let actionControl=<FormArray>this.engagementForm.controls['engagements'];
		if(actionControl.at(i).value.engagementID!=null){
			this.deleteAction(actionControl.at(i).value)
		}
		//IF ENAGAGEMNT-ID=NULL FOR SOME THEN DON'T CALL DELETE METHOD ELSE DO
		actionControl.removeAt(i);
	}

	deleteAction(actionObject:any){
		this.candexService.delete(Config.SERVER+'/candidateEngagement/'+actionObject.engagementID+'/')
								.subscribe(
									res=>{res.json(),
										res.status==204?this.snackBar.open('Event Deleted Successfully','',{duration:2000}):null},
						  			error=>console.log(error))
	}

	submitForm(){
		var valueArray=this.engagementForm.value['engagements']
		for (var i=0; i<valueArray.length;i++) {
			var dueDate=valueArray[i]['dueDate']
			if(dueDate instanceof Date){
				dueDate=dueDate.getFullYear()+'-'+(dueDate.getMonth()+1)+'-'+dueDate.getDate()
				valueArray[i]['dueDate']=dueDate
			}
		}
		this.candexService.post(Config.SERVER+'/candidateEngagement/',this.engagementForm.value)
								.subscribe(
									res=>{res.json(),
										res.status==201?this.snackBar.open("Events added successfully",'',{duration:2000}):null},
									error=>console.log(error))
	}

}
