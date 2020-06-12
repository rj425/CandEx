import { Component ,OnInit,Input,ViewChild } from '@angular/core';
import { Http, Response, Headers, URLSearchParams } from '@angular/http';
import * as _ from 'underscore';
import { ActivatedRoute,Router } from '@angular/router';
import { Config,CandexService } from '../../shared/index';
import { FormGroup,FormControl, FormArray, Validators,NgForm,NgModelGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material';


@Component({
    moduleId: module.id,
    selector: 'editCand',
    templateUrl: 'editCandidate.component.html',
    styleUrls: ['editCandidate.component.css'],
})

export class EditCandidateComponent implements OnInit{

	active=true
	statusCode:number=null;
	candidateID:string=null;
	candidate:any;
	jsonResponse:any=null
	selectedIndex:any;
	public genders: string[] = ["Male","Female"];
	public graduationType:string[]=['Graduate','Post Graduate','PhD']
	public institutionList:any[]
	public courseList:any[]
	public sourceList:any[]
	public departmentList:any[]
	public designationList:any[]
	public requestList:any[]
	public requestIDList:number[]=[]
	public candidateIDForForm:any

	public candidatePersonalForm:FormGroup
	public candidateEducationForm:FormGroup
	public candidateProfessionalForm:FormGroup
	public candidateProcessForm:FormGroup
	public candidateOfferForm:FormGroup
	public candidateCostForm:FormGroup
	public showCandidateOfferForm:boolean
	public candidateOtherForm:FormGroup
	public selectedFileName:string='No File Choosen'
	public resumeObj:any
	public uploadedResumeName:string

	constructor(private candexService:CandexService,
				private router:Router,
				private route:ActivatedRoute,
				public snackBar: MatSnackBar){}

	ngOnInit(){
		this.route.params.map(params=>params['candidateID'])
						 .subscribe(candidateID=>this.candidateID=candidateID)
		this.route.params.map(params=>params['selectedIndex'])
						 .subscribe(selectedIndex=>this.selectedIndex=selectedIndex)
		this.getMasters()
		this.getCandidateInfo()
	}

	public getMasters(){
		this.candexService.get(Config.SERVER+'/requests/')
							.subscribe(res=>{this.requestList=res.json().results,
											 this.requestList.forEach(request=>{
												this.requestIDList.push(request['requestID'])
											})},
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

	getCandidateInfo(){
		this.candexService.get(Config.SERVER+'/candidates/'+this.candidateID+'/')
						  .subscribe(
						  			res=>{this.candidate=this.changeAllDatesFormat(res.json())
						  				this.createForm(),
						  				this.candidateIDForForm='CAND-'+this.candidate.candidateID,
						  				this.getUploadedResumeName()},
						  			error=>console.log(error))
	}

	public getUploadedResumeName(){
		if(this.candidate.resume!==null){
			let resumeURL:string=this.candidate.resume.resume
			this.uploadedResumeName=resumeURL.slice((resumeURL.indexOf('resumes')+8))
		}
	}

	public convertDateStringToDate(string){
		var date:Date=new Date(string)
		return date
	}

	public getTimeStringFromDate(date:Date):string{
		var hr:any = date.getHours();
		var min:any = date.getMinutes();
		if (hr < 10) {
		    hr = "0" + hr;
		}
		if (min < 10) {
		    min = "0" + min;
		}
		return hr+':'+min
	}

	public changeAllDatesFormat(candidate){
		if(candidate.personal.dateOfBirth!==null)
			candidate.personal.dateOfBirth=this.convertDateStringToDate(candidate.personal.dateOfBirth)
		if(candidate.process.processStart!==null){
			let processStart:Date=new Date(candidate.process.processStart)
			let processStartDate=this.convertDateStringToDate(processStart.getUTCFullYear()+'-'+(processStart.getMonth()+1)+'-'+processStart.getDate())
			candidate.process.processStartDate=processStartDate
			candidate.process.processStartTime=this.getTimeStringFromDate(processStart)
		}
		if(candidate.offer!==null){
			if(candidate.offer.joiningDate!==null)
				candidate.offer.joiningDate=this.convertDateStringToDate(candidate.offer.joiningDate)

			if(candidate.offer.offerDate!==null)
				candidate.offer.offerDate=this.convertDateStringToDate(candidate.offer.offerDate)
		}
		return candidate
	}

	createForm(){
		this.candidatePersonalForm=new FormGroup({
				candidateID:new FormControl(this.candidateID),
				firstName:new FormControl(this.candidate?(this.candidate.personal?(this.candidate.personal.firstName?(this.candidate.personal.firstName):''):''):''),
				lastName:new FormControl(this.candidate?(this.candidate.personal?(this.candidate.personal.lastName?(this.candidate.personal.lastName):''):''):''),
				mobile:new FormControl(this.candidate?this.candidate.personal.mobile:null,Validators.pattern('[789][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]')),
				email:new FormControl(this.candidate?this.candidate.personal.email:'',Validators.pattern("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")),
				gender:new FormControl(this.candidate?this.candidate.personal.gender:''),
				dateOfBirth:new FormControl(this.candidate?this.candidate.personal.dateOfBirth:null),
				currentAddress:new FormControl(this.candidate?this.candidate.personal.currentAddress:''),
				permanentAddress:new FormControl(this.candidate?this.candidate.personal.permanentAddress:'')
		})
		this.candidatePersonalForm.disable()
		this.candidateEducationForm=new FormGroup({
			education:new FormArray(this.initEducation(this.candidate?this.candidate.education.length:0))
		})
		this.candidateEducationForm.disable()
		this.candidateProfessionalForm=new FormGroup({
				candidateID:new FormControl(this.candidateID),
				currentEmployer:new FormControl(this.candidate?this.candidate.professional.currentEmployer:''),
				currentDesignation:new FormControl(this.candidate?this.candidate.professional.currentDesignation:''),
				currentCTC:new FormControl(this.candidate?this.candidate.professional.currentCTC:''),
				experienceYear:new FormControl(this.candidate?this.candidate.professional.experienceYear:null),
				experienceMonth:new FormControl(this.candidate?this.candidate.professional.experienceMonth:null),
		})
		this.candidateProfessionalForm.disable()
		this.candidateProcessForm=new FormGroup({
				candidateID:new FormControl(this.candidateID),
				source:new FormControl(this.candidate?this.candidate.process.source:''),
				processStartDate:new FormControl(this.candidate?this.candidate.process.processStartDate:null),
				processStartTime:new FormControl(this.candidate?this.candidate.process.processStartTime:null),
				title:new FormControl(this.candidate?this.candidate.process.title:null),
				team:new FormControl(this.candidate?this.candidate.process.team:null),
				lastInterviewStatus:new FormControl(this.candidate?this.candidate.process.lastInterviewStatus:'')
		})
		this.candidateProcessForm.disable()
		if(this.candidate.offer!==null){
			this.showCandidateOfferForm=true
			this.candidateOfferForm=new FormGroup({
					candidateID:new FormControl(this.candidateID),
					joiningDate:new FormControl(this.candidate?(this.candidate.offer?this.candidate.offer.joiningDate:null):null),
					offerDate:new FormControl(this.candidate?(this.candidate.offer?this.candidate.offer.offerDate:null):null),
					offerStatus:new FormControl(this.candidate?(this.candidate.offer?this.candidate.offer.offerStatus:null):null)		
			})
			this.candidateOfferForm.disable()
			this.candidateCostForm=new FormGroup({
				candidateID:new FormControl(this.candidateID),
				relocationCost:new FormControl(this.candidate?(this.candidate.candidateCost?this.candidate.candidateCost.relocationCost:null):null),
				agencyCost:new FormControl(this.candidate?(this.candidate.candidateCost?this.candidate.candidateCost.agencyCost:null):null),
				referralCost:new FormControl(this.candidate?(this.candidate.candidateCost?this.candidate.candidateCost.referralCost:null):null),
				settlingCost:new FormControl(this.candidate?(this.candidate.candidateCost?this.candidate.candidateCost.settlingCost:null):null),
				salary:new FormControl(this.candidate?(this.candidate.candidateCost?this.candidate.candidateCost.salary:null):null),	
				joiningBonus:new FormControl(this.candidate?(this.candidate.candidateCost?this.candidate.candidateCost.joiningBonus:null):null)	
			})
			this.candidateCostForm.disable()
		}
		else
			this.showCandidateOfferForm=false
		this.candidateOtherForm=new FormGroup({
			requestID:new FormControl(this.candidate.requestID)
		})
		this.candidateOtherForm.disable()
	}

	public initEducation(length:number):FormGroup[]{
		let educationArray:FormGroup[]=[]
		let date=new Date()
		let currentYear=date.getFullYear()
		for(let i=0;i<length;i++)
		{
			educationArray.push(new FormGroup
				({
					educationID:new FormControl(this.candidate?this.candidate.education[i].educationID:null),
					candidateID:new FormControl(this.candidate?this.candidate.candidateID:null),
					institutionName:new FormControl(this.candidate?
									(this.candidate.education[i].institutionName==null?null:this.candidate.education[i].institutionName):null),
					courseName:new FormControl(this.candidate?
									(this.candidate.education[i].courseName==null?null:this.candidate.education[i].courseName):null),
					gpa:new FormControl(this.candidate?this.candidate.education[i].gpa:null),
					graduationYear:new FormControl(this.candidate?this.candidate.education[i].graduationYear:null,[Validators.max(currentYear),Validators.min(currentYear-100)]),
					graduationType:new FormControl(this.candidate?this.candidate.education[i].graduationType:'')
				})
			)
		}
		return educationArray
	}

	public addEducationRow(){
		let educationControl=<FormArray>this.candidateEducationForm.controls['education']
		educationControl.push(new FormGroup
				({
					educationID:new FormControl(null),
					candidateID:new FormControl(this.candidate?this.candidate.candidateID:null),
					institutionName:new FormControl(null),
					courseName:new FormControl(null),
					gpa:new FormControl(null),
					graduationYear:new FormControl(null),
					graduationType:new FormControl('')
				})
			)
	}

	public removeEducationRow(index:number){
		let educationControl=<FormArray>this.candidateEducationForm.controls['education']
		let educationID=educationControl.value[index].educationID
		if(educationID!==null){
			this.candexService.delete(Config.SERVER+'/candidateEducation/'+educationID)
							  .subscribe(res=>res.status==204?(this.snackBar.open('Row Deleted!','',{duration:2000}),
							  									this.candidate.education.splice(index,1)):null,
							  			error=>{this.snackBar.open("Row Deletion Failed!",'',{duration:2000})})
		}
		educationControl.removeAt(index)
	}

	public onSubmit(form:FormGroup,disableForm:boolean){
		let extendedURL:string;
		if(form===this.candidatePersonalForm){
			if(form.value.dateOfBirth instanceof Date){
				let dob:Date=form.value.dateOfBirth
				form.value.dateOfBirth=dob.getFullYear()+'-'+(dob.getMonth()+1)+'-'+dob.getDate()
			}
			extendedURL='/candidatePersonal/'+this.candidate.personal.personalID+'/'
		}
		else if(form===this.candidateEducationForm){
			extendedURL='/candidateEducation/'
			this.candexService.post(Config.SERVER+extendedURL,form.value)
							  .subscribe(res=>{this.updateCandidateInformation(form,res.json()),
							  				   res.status==201?(this.snackBar.open('Fields Updated Succesfully','',{duration:2000}),
							  				   					disableForm===true?this.disableForm(form):null):null},
							  			error=>{this.snackBar.open("Fields Updation Failed!",'',{duration:2000})})
			return
		}
		else if(form==this.candidateProfessionalForm){
			extendedURL='/candidateProfessional/'+this.candidate.professional.professionalID+'/'
		}
		else if(form==this.candidateProcessForm){
			if(form.value.processStartDate instanceof Date){
				let processStart:Date=form.value.processStartDate
				processStart.setHours(form.value.processStartTime.split(':')[0])
				processStart.setMinutes(form.value.processStartTime.split(':')[1])
				delete form.value['processStartDate']
				delete form.value['processStartTime']
				form.value.processStart=processStart.toISOString()
			}
			extendedURL='/candidateProcess/'+this.candidate.process.processID+'/'
		}
		else if(form==this.candidateOfferForm){
			if(form.value.joiningDate instanceof Date){
				let dob:Date=form.value.joiningDate
				form.value.joiningDate=dob.getFullYear()+'-'+(dob.getMonth()+1)+'-'+dob.getDate()
			}
			if(form.value.offerDate instanceof Date){
				let dob:Date=form.value.offerDate
				form.value.offerDate=dob.getFullYear()+'-'+(dob.getMonth()+1)+'-'+dob.getDate()
			}

			extendedURL='/candidateOffer/'+this.candidate.offer.offerID+'/'
		}
		else if(form==this.candidateCostForm){
			if(this.candidate.candidateCost==null ){
				this.candexService.post(Config.SERVER+'/candidateCost/',form.value)
								  .subscribe(res=>{this.updateCandidateInformation(form,res.json()),
								  				   res.status==201?(this.snackBar.open('Fields Updated Succesfully','',{duration:2000}),
								  				   					disableForm===true?this.disableForm(form):null):null},
								  			error=>{this.snackBar.open("Fields Updation Failed!",'',{duration:2000})})
				return
			}else{
				let candidateCostID=this.candidate.candidateCost.id
				extendedURL='/candidateCost/'+this.candidate.candidateCost.id+'/'
			}
			
			
		}
		else if(form==this.candidateOtherForm){
			this.candexService.put(Config.SERVER+'/candidates/'+this.candidateID+'/',form.value)
							  .subscribe(res=>{this.candidate=res.json(),
							  					this.statusCode=res.status,
							  					this.statusCode===200?(this.snackBar.open(this.candidate.personal['firstName']+' has been mapped to REQ-'+this.candidate.requestID+'.','',{duration:2000}),
							  											this.uploadResume(form,disableForm)):null
							  				  })
			return
		}

		this.candexService.put(Config.SERVER+extendedURL,form.value)
						  .subscribe(res=>{ this.updateCandidateInformation(form,res.json()),
						  					this.statusCode=res.status,
						  					this.statusCode==200?(this.snackBar.open('Fields Updated Succesfully','',{duration:2000}),
						  										  disableForm===true?this.disableForm(form):null)
						  										:null	 	
						  				  },
						  			error=>{console.log(error),
						  					this.snackBar.open("Fields Updation Failed!",'',{duration:2000})
						  					}) 
	}

	public uploadResume(form:FormGroup,disableForm:boolean){
		let resumeID:number=null
		if(this.candidate.resume!==null)
			resumeID=this.candidate.resume['resumeID']
		if(this.resumeObj!==undefined){
			if(resumeID!==null){
				this.resumeObj.append('candidateID',this.candidateID)
					this.candexService.putForFile(Config.SERVER+'/resumes/'+resumeID+'/',this.resumeObj)
									  .subscribe(res=>{res.status===200?(this.snackBar.open('Resume Updated Successfully','',{duration:2000}),
									  									 this.updateCandidateInformation(form,res.json())):null},
									  			error=>{console.log(error),
									  					this.snackBar.open('Resume Upload Failed!','',{duration:2000})})		
			}
			else{
				this.resumeObj.append('candidateID',this.candidateID)
					this.candexService.postForFile(Config.SERVER+'/resumes/',this.resumeObj)
									  .subscribe(res=>{res.status===201?(this.snackBar.open('Resume Added Successfully','',{duration:2000}),
									  									 this.updateCandidateInformation(form,res.json())):null},
									  			error=>{console.log(error),
									  					this.snackBar.open('Resume Upload Failed!','',{duration:2000})})		

			}
		}
		disableForm===true?this.disableForm(form):null
	}

	public updateCandidateInformation(form,jsonResponse){
		if(form===this.candidatePersonalForm)
			this.candidate.personal=jsonResponse
		else if(form===this.candidateEducationForm)
			this.candidate.education=jsonResponse.results
		else if(form===this.candidateProfessionalForm)
			this.candidate.professional=jsonResponse
		else if(form===this.candidateProcessForm)
			this.candidate.process=jsonResponse
		else if(form===this.candidateOfferForm){
			console.log(jsonResponse)
			this.candidate.offer=jsonResponse
		}
		else if(form===this.candidateOtherForm){
			this.candidate.resume=jsonResponse
			this.getUploadedResumeName()
		}
		this.candidate=this.changeAllDatesFormat(this.candidate)		
	}

	public enableForm(form:FormGroup){
		form.enable()
	}

	public disableForm(form:FormGroup){
		form.disable()
	}

	public cancelEditMode(form:FormGroup){
		if(form===this.candidatePersonalForm){
			for(var key in form.controls)
				form.controls[key].setValue(this.candidate.personal[key])	
		}
		else if(form===this.candidateEducationForm){
			let formArray=<FormArray>this.candidateEducationForm.controls['education']
			let extraRows=formArray.value.length-this.candidate.education.length
			//Removing the extra rows
			for(let i=extraRows;i>0;i--)
				formArray.removeAt(i)
			//Rolling back the other rows
			for(let i=0;i<formArray.controls.length;i++){
					for(var key in formArray.controls[i]['controls'])
						formArray.controls[i]['controls'][key].setValue(this.candidate.education[i][key])
			}
		}
		else if(form===this.candidateProfessionalForm)
		{
			for(let key in form.controls)
				form.controls[key].setValue(this.candidate.professional[key])
		}
		else if(form===this.candidateProcessForm){
			for(let key in form.controls)
				form.controls[key].setValue(this.candidate.process[key])
		}
		else if(form===this.candidateOfferForm){
			for(let key in form.controls)
				form.controls[key].setValue(this.candidate.offer[key])
		}
		else if(form===this.candidateCostForm){
			for(let key in form.controls)
				form.controls[key].setValue(this.candidate.candidateCost[key])
		}
		else if(form===this.candidateOtherForm)
			form.controls['requestID'].setValue(this.candidate.requestID)
		this.disableForm(form)
	}

	public resetForm(form:FormGroup){
		if(form===this.candidatePersonalForm){
			form.controls['candidateID'].setValue(this.candidateID)
		 	form.controls['firstName'].setValue('')
		 	form.controls['lastName'].setValue('')
		 	form.controls['gender'].setValue('')
		 	form.controls['email'].setValue('')
		 	form.controls['currentAddress'].setValue('')
		 	form.controls['permanentAddress'].setValue('')
		 	form.controls['mobile'].setValue(null)
		 	form.controls['dateOfBirth'].setValue(null)	
		 }
		else if(form===this.candidateEducationForm){
			let formArray:any[]=form.controls['education']['controls']
			formArray.forEach((formgroup:FormGroup)=>{
				formgroup.controls['candidateID'].setValue(this.candidateID)
				formgroup.controls['institutionName'].setValue(null)
				formgroup.controls['courseName'].setValue(null)
				formgroup.controls['gpa'].setValue(null)
				formgroup.controls['graduationType'].setValue('')
				formgroup.controls['graduationYear'].setValue(null)
			})
		}
		else if(form===this.candidateProfessionalForm){
			form.controls['currentEmployer'].setValue('')
			form.controls['currentDesignation'].setValue('')
			form.controls['currentCTC'].setValue(null)
			form.controls['experienceYear'].setValue(null)
			form.controls['experienceMonth'].setValue(null)
		}
		else if(form===this.candidateProcessForm){
			form.controls['source'].setValue(null)
			form.controls['processStartDate'].setValue(null)
			form.controls['processStartTime'].setValue(null)
			form.controls['title'].setValue(null)
			form.controls['team'].setValue(null)
			form.controls['lastInterviewStatus'].setValue('')
		}
		else if(form===this.candidateOfferForm){
			form.controls['joiningDate'].setValue(null)
			form.controls['offerDate'].setValue(null)
		}else if(form===this.candidateCostForm){
			form.controls['settlingCost'].setValue(null)
			form.controls['joiningBonus'].setValue(null)
			form.controls['salary'].setValue(null)
			form.controls['agencyCost'].setValue(null)
			form.controls['referralCost'].setValue(null)
			form.controls['relocationCost'].setValue(null)
		}
		else if(form===this.candidateOtherForm){
			form.controls['requestID'].setValue(null)
		}
	}

	public addResume(resumeObj:any){
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

}



