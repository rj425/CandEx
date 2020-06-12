import { Component,OnInit,OnChanges } from '@angular/core';
import { Http,Headers } from '@angular/http';
import { Config,CandexService,CompareDateTime } from '../../../shared/index';
import { FormGroup,FormControl,Validators } from '@angular/forms';
import { ActivatedRoute,Router,Params } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { Md2Toast } from 'md2/toast/toast';


@Component({
	moduleId:module.id,
	selector:'panellistFeedback',
	templateUrl:'panellistFeedback.component.html',
	styleUrls:['panellistFeedback.component.css']
})
export class PanellistFeedbackComponent implements OnInit{

	public disableButton:boolean=false
	public jsonResponse:any=null
	public candidateID:number=null
	public levelID:number=null
	public roundID:number=null
	public panellistID:number=null
	public secretKey:string=null
	public authorizationHeader:Headers=null
	public candidateData:any=null
	public levelData:any=null
	public roundData:any=null
	public panellistData:any=null
	public feedbackForm:FormGroup=null
	public notesForm:FormGroup=null
	public showFeedbackForm:boolean=null
	public showNotesForm:boolean=null
	public decisionOptions:Array<any>=[{value:'Not Recommended - Explain Below'},
										{value:'Recommend Hire'},
										{value:'Recommend - But No Immediate Need'},
										{value:'Other - Explain Below'}]
	public hideNowButton:any=false
	public showInformationMessage:boolean=false
	public invalidURL:boolean=false
	public resumeAvailable:boolean
	public resumeFormat:string
	public getNotes:boolean=false
	public getFeedback:boolean=false
	public selectedTabIndex:number=0

	constructor(public _route:ActivatedRoute,
				public _candexService:CandexService,
				public snackBar: MatSnackBar,
				public toast:Md2Toast){}

	ngOnInit(){
		this._route.queryParams.map(params=>params)
							   .subscribe(params=>{
							   		this.candidateID=+params['candidateID'],
							   		this.levelID=+params['levelID'],
							   		this.roundID=+params['roundID'],
							   		this.panellistID=+params['panellistID']
							   		this.secretKey=params['secretKey']
							   })		   
	 	this.getAuthToken()
	}

	public getAuthToken(){
		this._candexService.postForAuthToken(Config.SERVER+'/authToken/',{'username':'panelMembers','password':'panel123'})
				   .subscribe(res=>{this.authorizationHeader=this._candexService.createAuthorizationHeader(res.json().token),
				   					this.getCandidateInformation()},
				   			  error=>console.log(error))
	}

	public getCandidateInformation(){
		this._candexService.get(Config.SERVER+'/candidates/'+this.candidateID+'/',undefined,this.authorizationHeader)
						   .subscribe(res=>{this.candidateData=res.json(),
						   					this.getInterviewRelatedData()},
						   			  error=>console.log(error))
	}

	public checkResumeFormat(){
		if(this.candidateData.resume!==null){
			this.resumeAvailable=true
			let resumeURL:string=this.candidateData.resume.resume
			if(resumeURL==null)
			{
				this.resumeAvailable=false
				return
			}
			if(resumeURL.endsWith('pdf')===true)
				this.resumeFormat='pdf'
			else if(resumeURL.endsWith('doc')===true)
				this.resumeFormat='doc'
			else if(resumeURL.endsWith('docx')===true)
				this.resumeFormat='docx'
			else
				this.resumeFormat='invalid'
		}
		else
			this.resumeAvailable=false
	}

	public getInterviewRelatedData(){
		this.checkResumeFormat()
		if(this.candidateData!==null){
			for(let i=0;i<this.candidateData.interviewLevels.length;i++){
				if(this.candidateData.interviewLevels[i].levelID==this.levelID)
					this.levelData=this.candidateData.interviewLevels[i]
			}
		}
		if(this.levelData!==null){
			for(let i=0;i<this.levelData.interviewRounds.length;i++){
				if(this.levelData.interviewRounds[i].roundID===this.roundID)
					this.roundData=this.levelData.interviewRounds[i]
			}
		}
		if(this.roundData!==null){
			for(let i=0;i<this.roundData.panel.length;i++){
				if(this.roundData.panel[i].panellistID===this.panellistID)
					this.panellistData=this.roundData.panel[i]
			}
		}
		if(this.panellistData!==null){
			//Verifiying the panellist
			if(this.secretKey===this.panellistData.secretKey){
				if(CompareDateTime.compareWithCurrentDateTime(this.roundData.interviewDate,this.roundData.interviewStartTime)===-1 ||
				   CompareDateTime.compareWithCurrentDateTime(this.roundData.interviweDate,this.roundData.interviewStartTime)===0){
					if(this.panellistData.status===''){
						this.showNotesForm=true
						this.createNotesForm()
						this.disableButton=false
					}
					else if(this.panellistData.status==='Active'){
						this.showFeedbackForm=true
						this.createFeedbackForm()
					}
					else if(this.panellistData.status==='InActive'){
						this.showFeedbackForm=true
						this.createFeedbackForm()
						this.feedbackForm.disable()
						this.disableButton=true
					}
				}
				else{
					this.showInformationMessage=true
					this.showFeedbackForm=false
					this.showNotesForm=false
				}
			}
			else
				//Ideally it should redirect to 404 error page
				this.invalidURL=true
		}
	}

	public selectedTabHandler(selectedTab:any){
		this.selectedTabIndex=selectedTab['index']
		if(selectedTab['index']===0)
			this.getCandidateInformation()
	}

	public setCurrentTime(){
		this.notesForm.controls['round'].get('interviewFinishTime').setValue(CompareDateTime.getCurrentTime())
	}

	public createNotesForm(){
		this.notesForm=new FormGroup(this.initNotesForm())
		if(this.roundData.roundDecision==='Completed' ||
			this.roundData.roundDecision==='Recommend' ||
			this.roundData.roundDecision==='Not Recommended')
			{
				this.notesForm.controls['round'].get('interviewStartTime').disable()
				this.notesForm.controls['round'].get('interviewFinishTime').disable()
				this.hideNowButton=true
			}		
	}

	public initNotesForm(){
		return{
			round:new FormGroup({
				levelID:new FormControl(this.levelID),
				interviewStartTime:new FormControl(this.roundData.interviewStartTime,Validators.required),
				interviewFinishTime:new FormControl(this.roundData.interviewFinishTime,Validators.required),
				roundDecision:new FormControl('Completed')
			}),
			roundID:new FormControl(this.panellistData.roundID),
			panellistName:new FormControl(this.panellistData.panellistName),
			panellistEmail:new FormControl(this.panellistData.panellistEmail),
			notes:new FormControl(this.panellistData.notes),
			status:new FormControl('Active')
		}
	}

	public createFeedbackForm(){
		this.feedbackForm=new FormGroup(this.initFeedbackForm())
	}

	public initFeedbackForm(){
		return{
			roundID:new FormControl(this.panellistData.roundID),
			panellistName:new FormControl(this.panellistData.panellistName),
			panellistEmail:new FormControl(this.panellistData.panellistEmail),
			comments:new FormControl(this.panellistData.comments),
			panellistDecision:new FormControl(this.panellistData.panellistDecision,Validators.required),
			status:new FormControl("InActive")
		}
	}

	public onSubmitNotes(form:FormGroup){
		this.getNotes=true
		let roundFormValue=this.notesForm.value['round']
		delete this.notesForm.value['round']
		if(this.roundData.roundDecision==='Scheduled' || this.roundData.roundDecision==='Started'){
			this._candexService.put(Config.SERVER+'/interviewRound/'+this.roundID+'/',roundFormValue,this.authorizationHeader)
							   .subscribe(res=>{res.status===200?
							   						(this.toast.show("Interview Time Updated!",3000)):null,
							   						this.notifyNextPanel()},
							   			  error=>console.log(error))
		}
	}

	public updateNotesForm(notes){
		this.notesForm.value['notes']=notes
		setTimeout(()=>{
			this.getNotes=false
			this._candexService.put(Config.SERVER+'/panellist/'+this.panellistData.panellistID+'/',this.notesForm.value,this.authorizationHeader)
							   .subscribe(res=>{res.status===200?this.toast.show("Notes has been added successfully!",3000):null,
							   					this.showNotesForm=false,
							   					this.getCandidateInformation()},
							   			 error=>console.log(error))	
		},0)
	}

	public findNextRound():any{
		let rounds=[]
		for(let i=0;i<this.candidateData.interviewLevels.length;i++){
			for(let j=0;j<this.candidateData.interviewLevels[i].interviewRounds.length;j++)
				rounds.push(this.candidateData.interviewLevels[i].interviewRounds[j])
		}
		let nextRound=null
		for(let i=0;i<rounds.length;i++){	
			if(CompareDateTime.compareTwoDateTime(rounds[i].interviewDate,rounds[i].interviewStartTime,this.roundData.interviewDate,this.roundData.interviewStartTime)===1){
				if(nextRound!==null){
					if(CompareDateTime.compareTwoDateTime(rounds[i].interviewDate,rounds[i].interviewStartTime,nextRound.interviewDate,nextRound.interviewStartTime)===-1)
						nextRound=rounds[i]
				}
				else
					nextRound=rounds[i]
			}
		}
		return nextRound
	}

	public generateFeedbackFormURLS(nextRound:any){
		let panellistFeedbackURLS=[]
		for(let i=0;i<nextRound.panel.length;i++){
			let feedbackURL=Config.CLIENT+'feedback/?candidateID='+this.candidateID+'&levelID='+nextRound.levelID+'&roundID='+nextRound.roundID+'&panellistID='+nextRound.panel[i].panellistID+'&secretKey='+nextRound.panel[i].secretKey
			panellistFeedbackURLS.push({'panellistName':nextRound.panel[i].panellistName,
											 'email':nextRound.panel[i].panellistEmail,
											 'feedbackURL':feedbackURL})    
		}
		return panellistFeedbackURLS
	}

	public notifyNextPanel():any{
		let nextRound=this.findNextRound()
		if (nextRound!==null){
			let feedbackURLs=this.generateFeedbackFormURLS(nextRound)
			let emailParams:any={}
			emailParams['templateName']="Interview Reminder"
			emailParams['templateData']=nextRound
			emailParams['templateData']['candidateName']=(this.candidateData.personal.firstName+' '+this.candidateData.personal.lastName)
			for(let i=0;i<feedbackURLs.length;i++){
				emailParams['templateData']['feedbackURL']="http://"+feedbackURLs[i].feedbackURL
				emailParams['templateData']['panellistName']=feedbackURLs[i].panellistName
				emailParams['recipients']=feedbackURLs[i].email
				let previousPanel:string=''
				for(let j=0;j<this.roundData.panel.length;j++)
					previousPanel=previousPanel+','+this.roundData.panel[j].panellistName
				emailParams['templateData']['previousPanel']=previousPanel.slice(1,previousPanel.length)
				if(this.roundData.panel.length===1)
					emailParams['templateData']['previousPanel']=emailParams['templateData']['previousPanel']+' has'
				else if(this.roundData.panel.length>1)
					emailParams['templateData']['previousPanel']=emailParams['tempalteData']['previousPanel']+' have'
				delete emailParams['templateData']['panel']
				this._candexService.post(Config.SERVER+'/sendmail/',emailParams,this.authorizationHeader)
								   .subscribe(res=>res.status==200?this.snackBar.open('Reminder Mail has been sent to '+feedbackURLs[i].panellistName,'',{duration:2000}):null,
								   			  error=>console.log(error))
			}
		}
	}

	public onSubmitFeedback(form:FormGroup){
		this.getFeedback=true
	}

	public updateFeedbackForm(feedback){
		this.feedbackForm.value['comments']=feedback
		setTimeout(()=>{
			this.getFeedback=false
			this._candexService.put(Config.SERVER+'/panellist/'+this.panellistData.panellistID+'/',this.feedbackForm.value,this.authorizationHeader)
							   .subscribe(res=>{this.jsonResponse=res.json(),
							   					res.status==200?
							   						(this.feedbackForm.disable(),this.disableButton=true):null,
							   					this.snackBar.open('Your Feedback has been Successfully Submitted!','',{duration:2000}),
							   					this.getCandidateInformation()
							   					},
							   			 error=>{console.log(error),
							   			 		this.snackBar.open('Feedback Submission Failed!','',{duration:2000})})
		},0)		
	}
}