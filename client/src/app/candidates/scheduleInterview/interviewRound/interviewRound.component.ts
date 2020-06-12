import { Component,Input,Output,OnInit,OnChanges,EventEmitter,SimpleChanges ,Inject} from '@angular/core';
import { Http } from '@angular/http';
import { ActivatedRoute,Router } from '@angular/router';
import { Config,CompareDateTime,CandexService } from '../../../shared/index';
import { FormGroup,FormControl,FormArray,Validators } from '@angular/forms';
import * as _ from 'underscore';
import { MatSnackBar } from '@angular/material';
import { Md2Toast } from 'md2/toast/toast';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';


@Component({
	moduleId:module.id,
	selector:'interviewRound',
	templateUrl:'interviewRound.component.html',
	styleUrls:['interviewRound.component.css']
})
export class InterviewRoundComponent implements OnChanges,OnInit{

	@Input() public levelID:number=null
	@Input() public levelName:string
	@Input() public interviewRoundList:Array<any>=[]	
	@Input() public candidateID:number=null	
	@Input() public candidateName:string=null
	@Input() public interviewDate:string=null
	@Input() public levelStatus:string=null
	@Input() public firstNoShow:string=null
	@Input() public secondNoShow:string=null
	@Output() updateLevelInfo=new EventEmitter()
	public showInformationMessage:boolean=false
	public showAddRoundLink:boolean=false
	public enableRoundDecisionForm:boolean=false
	public roundFinished:boolean=false
	public freezeCompleteRound:boolean=false
	public selectedPanellists:any=[]
	public selectedRound:any=""
	public roundDecision:string
	public newRound:string="New Round"
	public roundName:string=null
	public interviewRoundForm:FormGroup=null
	public panelMemberList:Array<any>=[]
	public finalPanellist:Array<any>=[]
	public panellistsFeedback:Array<any>=[]
	public panellistFeedbackURLS:any=null
	public buttonName:string=null
	public informationMessage:string=null
	public currentDate:Date=null
	public selectedPanellistsName:Array<string>=[]
	public decisionButtonName:string
	public mailNotification:boolean=true

	constructor(private _candexService:CandexService,
				private _router:ActivatedRoute,
				private router:Router,
				public snackBar: MatSnackBar,
				private toast:Md2Toast,
				public dialog:MatDialog){}

	ngOnChanges(changes:any){
		let keys=_.allKeys(changes)
		if(keys.length!==1 && keys[0]!=='levelStatus')
		{
			this.roundName=null
			this.selectedRound=""
		}
		if(CompareDateTime.compareTwoDates(this.firstNoShow,this.interviewDate)===0){
			this.informationMessage="Please Reschedule the "+this.levelName+" in order to reschedule the Rounds!"
			this.showInformationMessage=true	
		}
		else if(CompareDateTime.compareTwoDates(this.secondNoShow,this.interviewDate)===0){
			this.informationMessage=this.candidateName+" has exceeded the number of chances for attempt!"
			this.showInformationMessage=true
		}
		else{
			this.informationMessage=""
			this.showInformationMessage=false
		}

		if(this.levelStatus==='Cleared' || this.levelStatus==='Not Cleared'){
			this.freezeCompleteRound=true
			this.decisionButtonName='View'
		}
		else{
			this.decisionButtonName='Update'
			this.freezeCompleteRound=false
		}

		if(this.levelStatus==='Completed' || this.levelStatus==='Cleared' || this.levelStatus==='Not Cleared')
			this.showAddRoundLink=false
		else
			this.showAddRoundLink=true
	}

	ngOnInit(){
		this.currentDate=new Date()
		this.createForm()
		this.getPanelMembersList()
	}

	public convertDateStringToDate(string){
		var date:Date=new Date(string)
		return date
	}

	public getPanelMembersList(){
		this._candexService.get(Config.SERVER+"/panelMembersDirectory/")
						   .subscribe(res=>{this.panelMemberList=res.json().results,console.log(this.panelMemberList)},
						   			error=>console.log(error))	
	}

	public updateLevelComponent(){
		this._candexService.get(Config.SERVER+'/interviewLevel/'+this.levelID+'/')
						   .subscribe(res=>this.updateLevelInfo.emit({'response':res.json(),'status':res.status}))
	}

	public createForm(){
		this.interviewRoundForm=new FormGroup(this.initForm())
	}

	public initForm(){
		return{
				roundID:new FormControl(this.selectedRound?this.selectedRound.roundID:null),
				roundNumber:new FormControl(this.selectedRound?this.selectedRound.roundNumber:this.interviewRoundList.length+1),
				levelID:new FormControl(this.levelID),
				interviewDate:new FormControl(this.selectedRound?this.convertDateStringToDate(this.selectedRound.interviewDate):null,Validators.required),
				modeOfInterview:new FormControl(this.selectedRound?this.selectedRound.modeOfInterview:'',Validators.required),
				interviewStartTime:new FormControl(this.selectedRound?this.selectedRound.interviewStartTime:null,Validators.required),
				interviewFinishTime:new FormControl(this.selectedRound?this.selectedRound.interviewFinishTime:null,Validators.required),
			  	roundDecision:new FormControl(this.selectedRound?(this.roundDecision=this.selectedRound.roundDecision):'Scheduled')
			  }
	}

	public updateForm(){
		this.selectedPanellists=[]
		if(this.selectedRound.panel!=null){
			for(let i=0;i<this.selectedRound.panel.length;i++){
				let panellistName=this.selectedRound.panel[i].panellistName
				this.panelMemberList.forEach(panelMember=>{
					if(panelMember.memberName===panellistName)
						this.selectedPanellists.push(panelMember)
				})
			}
		}
		let interviewRoundFormControls:any=this.initForm()
		for(let key in interviewRoundFormControls){
			let value=interviewRoundFormControls[key]
			this.interviewRoundForm.setControl(key,value)
		}
	}

	public editRound(){
		this.interviewRoundForm.enable()
	}

	public editRoundDecision(){
		this.enableRoundDecisionForm=true
	}

	public compareInterviewDateTime(){
		let roundDecision=this.selectedRound.roundDecision
		if(roundDecision==='Started' || roundDecision==='Scheduled')
			this.roundFinished=false
		else if(roundDecision==='Completed' || roundDecision==='Recommend' || roundDecision==='Not Recommended')
			this.roundFinished=true
		else
			this.roundFinished=false
		if(roundDecision==='Scheduled'){
			if(CompareDateTime.compareWithCurrentDateTime(this.selectedRound.interviewDate,this.selectedRound.interviewStartTime)===-1 ||
			   CompareDateTime.compareWithCurrentDateTime(this.selectedRound.interviewDate,this.selectedRound.interviewStartTime)===0){
				if(roundDecision!=='Started')
					this._candexService.put(Config.SERVER+'/interviewRound/'+this.selectedRound.roundID+'/',{'roundDecision':'Started','levelID':this.levelID})
									   .subscribe(res=>{this.updateinterviewRoundList(res.status,res.json(),this.roundName+' has Started!'),
														this.updateLevelComponent()},
												 error=>console.log(error))
			}
		}
	}

	public showRoundDetails(levelSelected:any){
		this.enableRoundDecisionForm=false
		this.roundDecision=this.selectedRound.roundDecision
		if(levelSelected!==this.newRound){
			this.roundName="ROUND "+levelSelected.roundNumber
			this.buttonName="Re-Schedule & Mail"
			let index=this.interviewRoundList.indexOf(levelSelected)
			this.interviewRoundList[index]['interviewDate']=this.convertDateStringToDate(this.interviewRoundList[index]['interviewDate'])
			this.updateForm()
			this.compareInterviewDateTime()
			this.interviewRoundForm.disable()
		}
		else if(levelSelected===this.newRound){
			this.selectedPanellists=[]
			this.roundName=this.newRound
			this.buttonName="Schedule & Mail"
			this.selectedRound=""
			this.updateForm()
			this.compareInterviewDateTime()
			this.interviewRoundForm.enable()
		}
	}

	public showPanellistsFeedback(){
		this._candexService.get(Config.SERVER+'/interviewRound/'+this.selectedRound.roundID+'/')
						   .subscribe(res=>{this.panellistsFeedback=res.json().panel
						   					if(res.status==200){
						   						this.dialog.open(PanellistsFeedbackDialog,{
						   							width:'600px',
						   							height:'400px',
						   							data:{
						   									panellistsFeedback:this.panellistsFeedback,
						   									roundName:this.roundName,
						   								 }
						   						})
						   					}},
						   			  error=>console.log(error))
	}

	public showRoundDecision(){
		let dialogRef=this.dialog.open(RoundDecisionDialog,{
			width:'350px',
			data:{
				disableForm:this.freezeCompleteRound,
				roundDecision:this.roundDecision,
				roundName:this.roundName,
				selectedRound:this.selectedRound,
				levelID:this.levelID
			}
		})
		dialogRef.afterClosed().subscribe(selectedDecision => {
			if(selectedDecision!=='null' && selectedDecision!==undefined){
				this._candexService.put(Config.SERVER+'/interviewRound/'+this.selectedRound.roundID+'/',{'levelID':this.levelID,'roundDecision':selectedDecision})
								   .subscribe(res=>{this.roundDecision=selectedDecision,
								   					this.updateinterviewRoundList(res.status,res.json(),'Round Decision Updated'),
													this.updateLevelComponent()},
								   			 error=>{console.log(error),
								   			  	  		 this.toast.show("Submission Failed!",2000)})
			}
    	});
	}	

	public onSubmit(){
		let roundID=this.selectedRound?this.selectedRound.roundID:null
		let interviewDate=this.interviewRoundForm.value['interviewDate']
		if(interviewDate!==null)
			this.interviewRoundForm.value.interviewDate=interviewDate.getFullYear()+'-'+(interviewDate.getMonth()+1)+'-'+interviewDate.getDate()
		if(roundID==null){
			this._candexService.post(Config.SERVER+'/interviewRound/',this.interviewRoundForm.value)
						   	   .subscribe(res=>{(this.finalPanellist.length===0 && res.status===201)?
							   	   					(
							   	   						this.generateFeedbackFormURLS(res.json()),
							   	   						this.updateinterviewRoundList(res.status,res.json(),"ROUND "+(res.json().roundNumber)+" Scheduled Successfully!"),
							   	   						this.updateLevelComponent(),
							   	   						this.sendMail(res.status,res.json())						   
							   	   					)
							   	   					:this.addPanellists(res.json().roundID)},
						   			  	  error=>{console.log(error)
						   			  	  		 this.toast.show("Round Creation Failed!",2000)})
		}
		else if(roundID!==null){
			this.interviewRoundForm.value['panel']=this.finalPanellist
			this._candexService.put(Config.SERVER+'/interviewRound/'+roundID+'/',this.interviewRoundForm.value)
							   .subscribe(res=>{this.generateFeedbackFormURLS(res.json()),
											   	this.updateinterviewRoundList(res.status,res.json(),"ROUND "+(res.json().roundNumber)+" Re-Scheduled Successfully!"),
											   	this.updateLevelComponent(),
							   					this.sendMail(res.status,res.json())},
							   			  error=>{console.log(error),
							   			  		 this.toast.show("ROUND "+(this.selectedRound.roundNumber)+" Updation Failed!",2000)})
		}
	}

	public addPanellists(roundID:number){
		if(this.finalPanellist.length!==0)
		{
			for(let i in this.finalPanellist)
				this.finalPanellist[i].roundID=roundID
			this.interviewRoundForm.value['panel']=this.finalPanellist
			this._candexService.post(Config.SERVER+'/interviewRound/',this.interviewRoundForm.value)
							   .subscribe(res=>{this.generateFeedbackFormURLS(res.json()),
												this.updateinterviewRoundList(res.status,res.json(),"ROUND "+(res.json().roundNumber)+" Scheduled Successfully!"),							   	
							   					this.updateLevelComponent(),
							   					this.sendMail(res.status,res.json())},
							   			 error=>{console.log(error),
							   			 		this.toast.show("New Round Creation Failed!",2000)})
		}
	}

	public sendMail(statusCode:number,jsonResponse:any){
		if(this.mailNotification==true){
			let emailParams:any={}
			let today=new Date()
			emailParams['templateName']="Schedule Interview"
			emailParams['templateData']=jsonResponse
			emailParams['templateData']['levelOfInterview']=this.levelName
			emailParams['templateData']['candidateName']=this.candidateName
			for(let i=0;i<this.panellistFeedbackURLS.length;i++){
				emailParams['templateData']['feedbackURL']=this.panellistFeedbackURLS[i].feedbackURL
				emailParams['templateData']['panellistName']=this.panellistFeedbackURLS[i].panellistName
				emailParams['recipients']=this.panellistFeedbackURLS[i].email
				delete emailParams['templateData']['panel']
				this._candexService.post(Config.SERVER+'/sendmail/',emailParams)
								   .subscribe(res=>{res.status==200?
		   							   			  this.toast.show("Email Sent to "+this.panellistFeedbackURLS[i].panellistName+'!',2000):null},
								   			  error=>this.toast.show("No email template found!",2000))
			}	
		}
	}

	public cancel(roundName:string){
		this.updateForm()
		if(roundName!==this.newRound){
			this.interviewRoundForm.disable()
		}
		else{
			this.selectedRound=''
			this.roundName=null
		}
	}


	public createPanellistsObject(selectedPanellists:any){
		this.selectedPanellistsName=[]
		for(let i=0;i<this.selectedPanellists.length;i++){
			this.selectedPanellistsName.push(this.selectedPanellists[i].memberName)
		}
		this.finalPanellist=[]
		for(let i=0;i<this.selectedPanellists.length;i++){
			this.finalPanellist.push({
				"panellistID":null,
				"roundID":this.selectedRound?this.selectedRound.roundID:null,
				"panellistName":this.selectedPanellists[i].memberName,
				"panellistEmail":this.selectedPanellists[i].memberEmail
			})
		}
	}

	public generateFeedbackFormURLS(jsonResponse:any){
		this.panellistFeedbackURLS=[]
		for(let i=0;i<jsonResponse.panel.length;i++){
			let feedbackURL=Config.CLIENT+'feedback/?candidateID='+this.candidateID+'&levelID='+jsonResponse.levelID+'&roundID='+jsonResponse.roundID+'&panellistID='+jsonResponse.panel[i].panellistID+'&secretKey='+jsonResponse.panel[i].secretKey
			this.panellistFeedbackURLS.push({'panellistName':jsonResponse.panel[i].panellistName,
											 'email':jsonResponse.panel[i].panellistEmail,
											 'feedbackURL':feedbackURL})    
		}
	}

	public updateinterviewRoundList(statusCode:number,jsonResponse:any,successMessage:string){
		if(statusCode===201 || statusCode===200){
			if(statusCode===201){
				this.interviewRoundList.push(jsonResponse)
				this.roundName="Round "+jsonResponse.roundNumber
				this.selectedRound=this.interviewRoundList[this.interviewRoundList.length-1]
				this.toast.show(successMessage,3000)
			}
			else if(statusCode===200){
				let indexForSelectedPanel=this.interviewRoundList.indexOf(this.selectedRound)
				this.interviewRoundList[indexForSelectedPanel]=jsonResponse
				this.selectedRound=this.interviewRoundList[indexForSelectedPanel]
				this.toast.show(successMessage,3000)
			}
			this.interviewRoundForm.disable()
			this.finalPanellist=[]
			this.compareInterviewDateTime()
		}
	}
}


@Component({
	templateUrl:'roundDecision.dialog.html',
	styleUrls:['roundDecision.dialog.css']
})
export class RoundDecisionDialog{

	public roundName:string
	public selectedDecision:string=null
	public disableSubmit:boolean=false
	public disableForm:boolean=false

	constructor(public dialogRef:MatDialogRef<PanellistsFeedbackDialog>,
				@Inject(MAT_DIALOG_DATA) public data:any,
				public _candexService:CandexService,
				public toast:Md2Toast){
		this.disableForm=this.data['disableForm']
		this.selectedDecision=this.data['roundDecision']
		this.roundName=this.data['roundName']
	}
}


@Component({
	templateUrl:'panellistFeedback.dialog.html',
	styleUrls:['panellistFeedback.dialog.css']
})
export class PanellistsFeedbackDialog{

	public roundName:string;
	public panellistsFeedback:any
	public selectedPanellist:string=""

	constructor(public dialogRef:MatDialogRef<PanellistsFeedbackDialog>,@Inject(MAT_DIALOG_DATA) public data:any){
		this.roundName=this.data['roundName']
		this.panellistsFeedback=this.data['panellistsFeedback']
	}
}