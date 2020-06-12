import { Component,Input,Output,OnInit,OnChanges,Inject } from '@angular/core';
import { Http } from '@angular/http';
import { ActivatedRoute,Router } from '@angular/router';
import { Config,CompareDateTime,CandexService } from '../../shared/index';
import { FormGroup,FormControl,FormArray,Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Md2Toast } from 'md2/toast/toast';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';


@Component({
	moduleId:module.id,
	selector:'scheduleInterview',
	templateUrl:'scheduleInterview.component.html',
	styleUrls:['scheduleInterview.component.css']
})
export class ScheduleInterviewComponent implements OnInit{

	public selectedLevel:any=""
	public selectedRadioButton:any=null
	public interviewLevelList:Array<any>=[]
	public interviewRoundList:Array<any>=[]
	public newLevelNameList:Array<string>=[]
	public radioButtonOptions:Array<any>=[]
	public levelName:string=null	
	public newLevel:string="New Level"
	public showLevelFormFlag:boolean=false
	public showInterviewRoundFormFlag:boolean=false
	public showLevelStatusButton:boolean=false
	public showAddLevelLink:boolean=false
	public showHiringDecisionSection:boolean=false
	public enableDialog:boolean=false
	public freezeLevelForm:boolean=false
	public levelStartDay:boolean=false
	public candidateID:number=null
	public scheduleInterviewForm:FormGroup=null
	public candidateName:string=null
	public noShowNumber:number=null
	public interviewTimelineData:any=null
	public dialogTitle:string
	public dialogMode:any=null
	public currentDate:Date=null
	public candidateOffer:any=null
	public processID:number=null

	constructor(private _candexService:CandexService,
				private _route:ActivatedRoute,
				private _router:Router,
				public snackBar: MatSnackBar,
				private toast:Md2Toast,
				public dialog:MatDialog){}

	public ngOnInit(){
		this.currentDate=new Date()
		this._route.params.map(params=>params['candidateID'])
						  .subscribe(candidateID=>this.candidateID=candidateID)
		this.createForm()
		this.getInterviewLevelInformation()
	}

	public createForm(){
		this.scheduleInterviewForm=new FormGroup(this.initForm())
	}

	//Reusable initForm Function()
	public initForm(){
		let levelDecision=null
		//For Second Attempt
		levelDecision=this.selectedLevel?this.selectedLevel.levelDecision:'Scheduled'
		if(levelDecision==='Not Showed')
			levelDecision='Scheduled'
		return{
				candidateID:new FormControl(this.candidateID),
				levelID:new FormControl(this.selectedLevel?this.selectedLevel.levelID:null),
				levelOfInterview:new FormControl(this.selectedLevel?this.selectedLevel.levelOfInterview:'',Validators.required),
				interviewDate:new FormControl(this.selectedLevel?this.convertDateStringToDate(this.selectedLevel.interviewDate):null,Validators.required),
				levelDecision:new FormControl(levelDecision),
				isFinal:new FormControl(this.selectedLevel?this.selectedLevel.isFinal:false)
			  }
	}

	public convertDateStringToDate(string){
		var date:Date=new Date(string)
		return date
	}

	public getInterviewLevelInformation(){
		this._candexService.get(Config.SERVER+'/candidates/'+this.candidateID+'/')
						   .subscribe(res=>{this.interviewLevelList=res.json().interviewLevels,
										   	this.candidateOffer=res.json().offer,
										   	this.candidateName=res.json().personal.firstName+' '+res.json().personal.lastName,
											this.processID=res.json().process.processID,
											this.checkForFinalLevel(),
						   					this.updateNewLevelNameList()},
						   			 error=>console.log(error))
	}

	// Checks for final level clearence in order to decide whether to show 'Add level' or 'HiringDecicionForm' or not
	public checkForFinalLevel(){
		if(this.interviewLevelList.length!==0){
			if(this.interviewLevelList[this.interviewLevelList.length-1].isFinal===true ||
			   this.interviewLevelList[this.interviewLevelList.length-1].levelDecision==='Not Cleared')
				this.showAddLevelLink=false
			else
				this.showAddLevelLink=true
		}
		else
			this.showAddLevelLink=true

		if(this.candidateOffer===null){
			if(this.interviewLevelList.length!==0){
				if(this.interviewLevelList[this.interviewLevelList.length-1].levelDecision==='Cleared' &&
				   this.interviewLevelList[this.interviewLevelList.length-1].isFinal===true)
					this.showHiringDecisionSection=true
			}
		}
		else
			this.showHiringDecisionSection=false	
	}

	// Updates the levelname list according to already existing levels created in the database
	public updateNewLevelNameList(){
		this.newLevelNameList=[]
		let levelNumber:number=null
		let lastLevel=""
		if(this.interviewLevelList.length===0)
			levelNumber=1
		else
		 	lastLevel=this.interviewLevelList[this.interviewLevelList.length-1].levelOfInterview	
		if(lastLevel.toUpperCase().startsWith("LEVEL") || lastLevel==""){
			levelNumber=+lastLevel.slice(6,lastLevel.length)
			this.newLevelNameList.push("LEVEL "+(levelNumber+1))
			this.newLevelNameList.push("US LEVEL")
		}
	}	

	// Checks if the user is creating a new level or trying to view the existing level
	public showLevelDetails(levelSelected:any){
		if(levelSelected!==this.newLevel){
			this.levelName=levelSelected.levelOfInterview
			this.interviewRoundList=levelSelected.interviewRounds
			this.showInterviewRoundFormFlag=true
			this.updateForm()
			this.scheduleInterviewForm.disable()
			this.compareLevelDate()
			this.updateLevelStatus()	
		}
		else if(levelSelected===this.newLevel){
			this.freezeLevelForm=false
			this.levelName=levelSelected
			this.showInterviewRoundFormFlag=false
			this.showLevelStatusButton=false
			this.selectedLevel=""
			this.updateForm()		
			this.scheduleInterviewForm.enable()			
		}			
		this.showLevelFormFlag=true
	}

	// Checks for the current date with the interview level date and updates the number of no show accordingly.
	public compareLevelDate(){
		if(this.selectedLevel.interviewDate!==null)
			this.levelStartDay=(CompareDateTime.compareWithCurrentDate(this.selectedLevel.interviewDate)===0 || CompareDateTime.compareWithCurrentDate(this.selectedLevel.interviewDate)===-1)?true:false
		else
			this.levelStartDay=false

		if(this.levelStartDay===true){
			if(this.selectedLevel.firstNoShowDate===null || this.selectedLevel.firstNoShowDate===this.selectedLevel.interviewDate)
				this.noShowNumber=1
			else if(this.selectedLevel.firstNoShowDate!==this.selectedLevel.interviewDate)
				this.noShowNumber=2
			this.checkCandidateNoShow()
		}
		else if(this.levelStartDay===false){
			this.showLevelStatusButton=false
			this.noShowNumber=null
		}
	}

	// Checks for the candidate no show , if candidate fails to show for the second time, recruiter should be asked to drop the candidate.
	public checkCandidateNoShow(){
		if(this.selectedLevel.levelDecision==='Scheduled'){
			if(this.selectedLevel.firstNoShowDate!==null && this.selectedLevel.secondNoShowDate!==null)
				return
			else
				this.enableDialog=false
				this.showLevelStatusButton=true
				this.dialogTitle='Candidate Showed?'
				this.radioButtonOptions=[{'name':'Yes','value':true},{'name':'No','value':false},{'name':'Not Yet','value':null}]
				this.dialogMode='StartLevel'
		}
	}

	// updates the level status in the DB according to the current status of the levels.
	public updateLevelStatus(){
		if(this.interviewLevelList.length!==0){
			let levelDecision=this.selectedLevel.levelDecision
			if(levelDecision==='Scheduled')
				this.freezeLevelForm=false
			else if(levelDecision==='Not Showed')
			{
				if(this.selectedLevel.firstNoShowDate!==null && this.selectedLevel.secondNoShowDate!==null)
					this.freezeLevelForm=true
				else
					this.freezeLevelForm=false
			}
			else if(levelDecision==='Started' || levelDecision==='Ongoing' || levelDecision==='Completed' || levelDecision==='Cleared' || levelDecision==='Not Cleared')
				this.freezeLevelForm=true
			
			if(levelDecision==='Completed'){
				this.enableDialog=false
				this.showLevelStatusButton=true
				this.dialogTitle="Level Decision"
				this.radioButtonOptions=[{'name':'Cleared','value':'Cleared'},{'name':'Not Cleared','value':'Not Cleared'}]
				this.dialogMode='EndLevel'
			}

			if(levelDecision==='Started' || levelDecision=='Ongoing'){
				let startDateTime:any=this.checkFirstRoundStartTime()
				let finishDateTime:any=this.checkLastRoundFinishTime()
				if(startDateTime!==null && finishDateTime!==null){
					if(CompareDateTime.compareWithCurrentDateTime(startDateTime.date,startDateTime.time)===-1 || 
					   CompareDateTime.compareWithCurrentDateTime(startDateTime.date,startDateTime.time)===0)
						if(CompareDateTime.compareWithCurrentDateTime(finishDateTime.date,finishDateTime.time)===1){
							if(levelDecision!=='Ongoing'){
								let body={'candidateID':this.candidateID,'levelDecision':'Ongoing'}
								this.updateLevel(body,this.levelName+" is Ongoing!")
							}
						}
					if(CompareDateTime.compareWithCurrentDateTime(finishDateTime.date,finishDateTime.time)===-1 ||
					   CompareDateTime.compareWithCurrentDateTime(finishDateTime.date,finishDateTime.time)===0){
						if(levelDecision!=='Completed'){		
							let body={'candidateID':this.candidateID,'levelDecision':'Completed'}
							this.updateLevel(body,this.levelName+" has Completed!")
						}
					}
				}
			}
		}
	}	

	// Checks for the first ROUND start time
	public checkFirstRoundStartTime(){
		let firstRoundInterviewDate:string=null
		let firstRoundStartTime:string=null
		if(this.interviewRoundList.length!==0){
			firstRoundInterviewDate=this.interviewRoundList[0].interviewDate
			firstRoundStartTime=this.interviewRoundList[0].interviewStartTime
			for(let i=0;i<this.interviewRoundList.length;i++){
				if(CompareDateTime.compareTwoDates(this.interviewRoundList[i].interviewDate,firstRoundInterviewDate)===-1){
					firstRoundInterviewDate=this.interviewRoundList[i].interviewDate
					firstRoundStartTime=this.interviewRoundList[i].interviewStartTime
				}
				else if(CompareDateTime.compareTwoDates(this.interviewRoundList[i].interviewDate,firstRoundInterviewDate)===0){
					if(CompareDateTime.compareTwoTimes(this.interviewRoundList[i].interviewStartTime,firstRoundStartTime)===-1)
						firstRoundStartTime=this.interviewRoundList[i].interviewStart
				}
			}
			return {'time':firstRoundStartTime,'date':firstRoundInterviewDate}			
		}
		else
			return null
	}

	// Checks for the LAST ROUND start time
	public checkLastRoundFinishTime(){
		let lastRoundInterviewDate=null
		let lastRoundFinishTime=null
		if(this.interviewRoundList.length!==0){
			lastRoundInterviewDate=this.interviewRoundList[0].interviewDate
			lastRoundFinishTime=this.interviewRoundList[0].interviewFinishTime
			for(let i=0;i<this.interviewRoundList.length;i++){
				if(CompareDateTime.compareTwoDates(this.interviewRoundList[i].interviewDate,lastRoundInterviewDate)===1){
					lastRoundInterviewDate=this.interviewRoundList[i].interviewDate
					lastRoundFinishTime=this.interviewRoundList[i].interviewFinishTime
				}
				else if(CompareDateTime.compareTwoDates(this.interviewRoundList[i].interviewDate,lastRoundInterviewDate)===0){
					if(CompareDateTime.compareTwoTimes(this.interviewRoundList[i].interviewFinishTime,lastRoundFinishTime)===1)
						lastRoundFinishTime=this.interviewRoundList[i].interviewFinishTime
				}
			}
			return {'time':lastRoundFinishTime,'date':lastRoundInterviewDate}			
		}
		else
			return null
	}

	public updateForm(){
		let scheduleInterviewFormControls=this.initForm()
		for(let key in scheduleInterviewFormControls){
			let value =scheduleInterviewFormControls[key]
			this.scheduleInterviewForm.setControl(key,value)
		}
	}

	// PUT For an existing level
	public updateLevel(body:any,successMessage:string){
		this._candexService.put(Config.SERVER+'/interviewLevel/'+this.selectedLevel.levelID+"/",body)
						   .subscribe(res=>{this.updateInterviewLevelList(res.status,res.json(),successMessage)},
						   			  error=>{console.log(error),this.toast.show(this.levelName+" Updation Failed!",2000)})
	}

	// POST for an new level
	public createLevel(successMessage:string){
		this._candexService.post(Config.SERVER+"/interviewLevel/",this.scheduleInterviewForm.value)
						   .subscribe(res=>{this.updateInterviewLevelList(res.status,res.json(),successMessage)},
									  error=>{console.log(error),this.toast.show(this.levelName+" Creation failed!",2000)})
	}

	public updateInterviewLevelList(status:number,jsonResponse:any,successMessage:string=null){
		if(status===201 || status===200){
			if(status===201){
				this.interviewLevelList.push(jsonResponse)
				this.levelName=jsonResponse.levelOfInterview
				this.selectedLevel=this.interviewLevelList[this.interviewLevelList.length-1]
				this.toast.show(successMessage,2000)
			}
			else if(status===200){
				let indexForSelectedLevel=this.interviewLevelList.indexOf(this.selectedLevel)
				this.interviewLevelList[indexForSelectedLevel]=jsonResponse
				this.selectedLevel=this.interviewLevelList[indexForSelectedLevel]
				this.toast.show(successMessage,2000)
			}
			this.scheduleInterviewForm.disable()
			this.updateNewLevelNameList()
			this.checkForFinalLevel()
			this.compareLevelDate()
			this.updateLevelStatus()
		}
	}

	public editLevel(){
		this.scheduleInterviewForm.enable()
	}

	public cancelEditMode(){
		this.updateForm()
		this.scheduleInterviewForm.disable()
	}

	// Submitting the level form
	public onSubmit(form:FormGroup,formMode?:string){
		let interviewDate:Date=this.scheduleInterviewForm.value.interviewDate
		this.scheduleInterviewForm.value.interviewDate=interviewDate.getFullYear()+'-'+(interviewDate.getMonth()+1)+'-'+interviewDate.getDate()
		if(formMode!=this.newLevel){
			this.updateLevel(this.scheduleInterviewForm.value,this.levelName+" Updated Successfully!")
		}
		else{
			this.createLevel(this.levelName+" Created Successfully!")	
			this.showInterviewRoundFormFlag=true
			this.levelName=this.newLevel
			this.interviewRoundList=[]
		}
		this.scheduleInterviewForm.disable()
	}


	public showInterviewTimeline(){
		let dialogRef=this.dialog.open(InterviewTimelineDialog,{
			width:'950px',
			height:'400px',
			data:{candidateID:this.candidateID,
				 candidateName:this.candidateName}
		})
	}

	public showLevelStatusDialog(){
		let dialogRef=this.dialog.open(Dialog,{
			width:'350px',
			data:{
				dialogTitle:this.dialogTitle,
				radioButtonOptions:this.radioButtonOptions
			}
		})
		dialogRef.afterClosed().subscribe(selectedRadioButton=>{
			if (selectedRadioButton!=='null' && selectedRadioButton!==undefined){
				this.selectedRadioButton=selectedRadioButton
				this.onSubmitLevelStatus(this.dialogMode)
			}
		})
	}

	public showHiringDecisionDialog(){
		let dialogRef=this.dialog.open(HiringDecisionDialog,{
			width:'350px',
			data:{
				dialogTitle:'Set Hiring Decision Date',
				currentDate:this.currentDate
			}
		})
		dialogRef.afterClosed().subscribe(hiringDecisionDate=>{
			if(hiringDecisionDate!=='null' && hiringDecisionDate!==undefined){
				hiringDecisionDate=hiringDecisionDate.getFullYear()+'-'+(hiringDecisionDate.getMonth()+1)+'-'+hiringDecisionDate.getDate()
				let postBody={'candidateID':this.candidateID,'hiringDecisionDate':hiringDecisionDate}
				this._candexService.post(Config.SERVER+'/candidateOffer/',postBody)
								   .subscribe(res=>{res.status==201?(this.snackBar.open('Hiring Decision Date Has Been Set!','',{duration:2000}),this.showHiringDecisionSection=false):this.showHiringDecisionSection=true,
													this.candidateOffer=res.json()},
								   			  error=>{console.log(error),this.snackBar.open('Hiring Decision Date Failed To Set','',{duration:2000})})
			}
		})
	}

	public onSubmitLevelStatus(mode:string){
		let postBody=null
		let successMessage:string=null
		if(mode==='StartLevel'){
			if(this.noShowNumber===1){
				if(this.selectedRadioButton===false){
					postBody={'candidateID':this.candidateID,'levelDecision':'Not Showed','firstNoShowDate':this.selectedLevel.interviewDate}
					successMessage=this.candidateName+" has Not Showed!"
				}
				else if(this.selectedRadioButton===true){
					postBody={'candidateID':this.candidateID,'levelDecision':'Started','firstNoShowDate':null}
					successMessage=this.levelName+" has Started!"
				}
				else if(this.selectedRadioButton===null){
					this.enableDialog=false
					postBody=null
				}
			}
			else if(this.noShowNumber===2){
				if(this.selectedRadioButton===false){
					postBody={'candidateID':this.candidateID,'levelDecision':'Not Showed','secondNoShowDate':this.selectedLevel.interviewDate}
					successMessage=this.candidateName+" has Not Showed!"
				}
				else if(this.selectedRadioButton===true){
					postBody={'candidateID':this.candidateID,'levelDecision':'Started','secondNoShowDate':null}
					successMessage=this.candidateName+" has Started!"
				}
				else if(this.selectedRadioButton===null){
					this.enableDialog=false
					postBody=null
				}
			}
		}
		else if(mode==='EndLevel'){
			let roundDecisionFilled=false
			for(let i=0;i<this.selectedLevel.interviewRounds.length;i++){
				if(this.selectedLevel.interviewRounds[i].roundDecision==="Recommend" || 
				   this.selectedLevel.interviewRounds[i].roundDecision==="Not Recommended"){
					roundDecisionFilled=true
				}
				else
					roundDecisionFilled=false
			}
			postBody={'candidateID':this.candidateID,'levelDecision':this.selectedRadioButton}
			successMessage=this.levelName+" - "+this.selectedRadioButton
			if(roundDecisionFilled===false){
				this.snackBar.open('Round Decisions are not filled!','',{duration:2000})
				postBody=null
			}
		}
		if(postBody!==null)
			this._candexService.put(Config.SERVER+'/interviewLevel/'+this.selectedLevel.levelID+'/',postBody)
							   .subscribe(res=>{this.updateInterviewLevelList(res.status,res.json(),successMessage)
							   					mode==='EndLevel'?this.updateProcessStatus():null,
							   					this.showLevelStatusButton=false},
							   			 error=>console.log(error))
	}

	public updateProcessStatus(){
		let data=null
		if(this.selectedLevel.isFinal===true)
			data={'processStatus':'Final Level '+this.selectedRadioButton}
		else
			data={'processStatus':this.selectedLevel.levelOfInterview+' '+this.selectedRadioButton}
		this._candexService.put(Config.SERVER+'/candidateProcess/'+this.processID+'/',data)
						   .subscribe(res=>{},error=>console.log(error))
	}
}

@Component({
	template:`
			<h2 mat-dialog-title>Interviews for {{candidateName}}</h2>
			<interviewProcessTimeline [candidateID]="candidateID"
									  [selectedTabIndex]="1">
	`,
	styles:[`
		.mat-dialog-title{
			text-align:center;
		}
		/deep/ .mat-dialog-container{
			border-radius: 5px;
		}
	`]
})
export class InterviewTimelineDialog{

	public candidateID:number
	public candidateName:string

	constructor(public dialogRef:MatDialogRef<InterviewTimelineDialog>,@Inject(MAT_DIALOG_DATA) public data:any){
		this.candidateID=this.data['candidateID']
		this.candidateName=this.data['candidateName']
	}
}

@Component({
	templateUrl:'dialog.html',
	styleUrls:['dialog.css']
})
export class Dialog{

	public dialogTitle:string
	public radioButtonOptions:any=[]
	public selectedRadioButton=null

	constructor(public dialogRef:MatDialogRef<Dialog>,@Inject(MAT_DIALOG_DATA) public data:any){
		this.dialogTitle=this.data['dialogTitle']
		this.radioButtonOptions=data['radioButtonOptions']
	}

}

@Component({
	templateUrl:'hiringDecision.dialog.html',
	styleUrls:['dialog.css']
})
export class HiringDecisionDialog{

	public dialogTitle:string
	public currentDate;
	public hiringDecisionDate;

	constructor(public dialogRef:MatDialogRef<HiringDecisionDialog>,@Inject(MAT_DIALOG_DATA) public data:any){
		this.dialogTitle=this.data['dialogTitle']
		this.currentDate=data['currentDate']
	}
}