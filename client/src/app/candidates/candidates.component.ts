import { Component ,OnInit} from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { Config,CandexService,ProgressBarService } from '../shared/index';
import { Router,ActivatedRoute } from '@angular/router';
import * as _ from 'underscore';
import { MatSnackBar } from '@angular/material';


@Component({
	moduleId: module.id,
  	selector: 'cand',
  	templateUrl: 'candidates.component.html',
  	styleUrls: ['candidates.component.css']
})


export class CandidateComponent implements OnInit{ 
	
constructor(private candexService:CandexService,
			private router:Router,
			public snackBar: MatSnackBar,
			public progressBarService:ProgressBarService){}

	public candidateData:any;
	public submitted:boolean;
	public events: any[]=[];
	public valid:boolean;
	public jsonResponse:any;
	public genders: string[] = ["Male","Female"];
	public graduationType:string[]=['Graduate','Post Graduate','PhD']
	public candidateForm:FormGroup;
	public hideLoading: boolean = false;
	public requestList:any=[]
	public institutionList:any=[]
	public courseList:any=[]
	public sourceList:any=[]
	public departmentList:any=[]
	public designationList:any=[]
	public resumeObj:FormData
	public selectedFileName:string='No File Choosen'
	emailParams:any={};
	candidateObj:any;

	
	ngOnInit(){
		this.createForm()
		this.getMasters()
	}

	public createForm(){
		this.candidateForm=new FormGroup({
			requestID: new FormControl(null),
			personal:new FormGroup({
				firstName:new FormControl(''),
				lastName:new FormControl(''),
				mobile:new FormControl(null,Validators.pattern('[789][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]')),
				email:new FormControl('',Validators.pattern("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")),
				gender:new FormControl(''),
				dateOfBirth:new FormControl(null),
				currentAddress:new FormControl(''),
				permanentAddress:new FormControl('')
			}),
			education:new FormArray([this.initEducation()]),
			professional:new FormGroup({
				currentEmployer:new FormControl(''),		
				currentDesignation:new FormControl(''),
				currentCTC:new FormControl(''),
				experienceYear:new FormControl(null),
				experienceMonth:new FormControl(null),
				resume:new FormControl('')
			}),
			process:new FormGroup({
				source:new FormControl(null),
				processStart:new FormControl(null),
				processAge:new FormControl(null),
				title:new FormControl(''),
				team:new FormControl(''),
				lastInterviewStatus:new FormControl('')
			})
		})
	}

	public initEducation():FormGroup{
		let currentYer=+(new Date().getFullYear())
		let educationRow=new FormGroup
				({
					institutionName:new FormControl(this.candidateData?this.candidateData.education[0].institutionName:null),
					courseName:new FormControl(this.candidateData?this.candidateData.education[0].courseName:null),
					gpa:new FormControl(this.candidateData?this.candidateData.education[0].gpa:null),
					graduationType:new FormControl(this.candidateData?this.candidateData[0].graduationType:''),
					graduationYear:new FormControl(this.candidateData?this.candidateData.education[0].graduationYear:null,[Validators.max(currentYer),Validators.min(currentYer-100)])
				})
		return educationRow
	}

	public addEducationRow(){
		let educationControl=<FormArray>this.candidateForm.controls['education']
		if(educationControl.length<5)
			educationControl.push(this.initEducation())
	}

	public removeEducationRow(index){
		let educationControl=<FormArray>this.candidateForm.controls['education']
		if(educationControl.length!=1)
			educationControl.removeAt(index)
	}

	public addResume(resumeObj:any){
		console.log(resumeObj)
		if(resumeObj[0].type==='application/pdf' ||
			resumeObj[0].type==='application/msword' || 
			resumeObj[0].type==='application/vnd.openxmlformats-officedocument.wordprocessingml.document')
		{
			this.selectedFileName=resumeObj[0].name
			this.resumeObj=new FormData()
			this.resumeObj.append('resume',resumeObj[0],resumeObj[0].name)
		}
		else{
			this.snackBar.open('Only .pdf, .doc and .docx Formats are allowed!','',{duration:2000})
			this.selectedFileName='No File Choosen'
		}
	}

	public onSubmit(){
		this.candidateForm.disable()
		this.progressBarService.setProgressBarVisibility(true)
		// Changing Date Format
		var dob=this.candidateForm.value.personal.dateOfBirth
		if(dob instanceof Date){
			dob=dob.getFullYear()+'-'+(dob.getMonth()+1)+'-'+dob.getDate()
			this.candidateForm.value.personal.dateOfBirth=dob
		}
		this.candexService.post(Config.SERVER+'/candidates/',this.candidateForm.value)
							.subscribe(res=>{this.candidateObj=res.json(),
											res.status===201?this.uploadResume()
												:(this.candidateForm.enable(),
						  				  		this.progressBarService.setProgressBarVisibility(false))
											},
						  			error=>{console.log(error),this.candidateForm.enable(),this.progressBarService.setProgressBarVisibility(false),
						  					this.snackBar.open("Candidate Creation Failed!",'',{duration:2000})})
	}

	public uploadResume(){
		if(this.resumeObj!==undefined){
			this.resumeObj.append('candidateID',this.candidateObj.candidateID)
			this.candexService.postForFile(Config.SERVER+'/resumes/',this.resumeObj)
							  .subscribe(res=>{res.status===201?
											  					(this.snackBar.open('Resume Uploaded Successfully','',{duration:2000}),
											  					this.progressBarService.setProgressBarVisibility(false),
											  					this.gotToCandidateList(res.status))
							  					:this.candidateForm.enable()},
							  			error=>{console.log(error),this.candidateForm.enable(),this.progressBarService.setProgressBarVisibility(false),
							  					this.snackBar.open('Resume Upload Failed!','',{duration:2000})})		
		}
		else
			this.gotToCandidateList(201)
	}

	public gotToCandidateList(statusCode:number){
		if(statusCode==201){
			this.progressBarService.setProgressBarVisibility(false)
			this.snackBar.open("Candidate Created Successfully!",'',{duration:2000})
			this.router.navigate(['manageCandidates'])			
			this.candidateForm.reset()
		}
	}

	public filterActiveRequests(){
		let requestList=this.requestList
		this.requestList=[]
		for(let request of requestList){
			if(request['requestStatus']=='Open')
				this.requestList.push(request)
		}
	}

	
	public getMasters(){
		this.candexService.get(Config.SERVER+'/requests/')
							.subscribe(res=>{this.requestList=res.json().results
											this.filterActiveRequests()},
										error=>console.log(error))
		this.candexService.get(Config.SERVER+'/institutions/')
							.subscribe(res=>{this.institutionList=res.json().results},
										error=>console.log(error))					
		this.candexService.get(Config.SERVER+'/courses/')
							.subscribe(res=>{this.courseList=res.json().results},
										error=>console.log(error))	
		this.candexService.get(Config.SERVER+'/sources/')
							.subscribe(res=>{this.sourceList=res.json().results},
										error=>console.log(error))
		this.candexService.get(Config.SERVER+'/department/')
							.subscribe(res=>{this.departmentList=res.json().results},
										error=>console.log(error))	
		this.candexService.get(Config.SERVER+'/designation/')
							.subscribe(res=>{this.designationList=res.json().results},
										error=>console.log(error))
	}

}
