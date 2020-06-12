import { Component,Input,OnChanges,Output,EventEmitter,Inject } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { CandexService,AuthService } from '../service/index';
import { Config } from '../index';
import { URLSearchParams } from '@angular/http';
import { MatSnackBar } from '@angular/material';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { TinyMCEComponent } from '../htmlEditor/tinyMce';

@Component({
	moduleId: module.id,
	selector: 'composeMail',
	templateUrl: 'composeMail.component.html',
	styleUrls:['composeMail.component.css']
})
export class ComposeMailComponent{
	
	public emailForm:FormGroup;
	public emailTemplates:any;
	public templateChoice:any
	public errorMessage:any;
	public userEmailID:string;
	public recipient:any
	public candidateID=null
	public emailBody=""
	public editorWidth:number=641
	public editorHeight:number=250
	public sendButton="Send"
	public candidate=null


	constructor(public candexService:CandexService,
				private _authService:AuthService,
				public snackBar: MatSnackBar,public dialogRef:MatDialogRef<ComposeMailComponent>,
				@Inject(MAT_DIALOG_DATA) public data:any){
		this.recipient=this.data['emailRecipient']
		this.candidateID=this.data['candidateID']

	}

	ngOnInit(){
		if(this.candidateID!=null){
			this.getCandidate()
		}
		this.getUser()
		this.getEmailTemplates()
		this.createForm()
		this.templateChoice="None"
	}


	onTemplateSelection(selectedTemplate:any){
		this.emailForm.reset()
		this.getUser()
		this.emailForm.controls['subject'].setValue(selectedTemplate.emailSubject)
		this.emailForm.controls['to'].setValue(this.recipient)	
		this.emailBody=selectedTemplate.emailBody
	}

	keyUpHandlerFunction(content){
		this.emailBody=content
	}

	createForm(){
		this.emailForm=new FormGroup(
		{
			from:new FormControl('',Validators.pattern("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")),
			to:new FormControl(this.recipient?this.recipient:'',[Validators.required,Validators.pattern("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")]),
			cc:new FormControl('',Validators.pattern("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")),
			subject:new FormControl('',Validators.required)
		})
	}

	getCandidate(){
		this.candexService.get(Config.SERVER+'/candidates/'+this.candidateID+'/')
						  .subscribe( res =>{this.candidate=res.json(),console.log(this.candidate)},
									  error => this.errorMessage = <any>error);
	}

	
	getUser(){
		let userObject:any;
		this.candexService.get(Config.SERVER+'/getUser/')
						  .subscribe( res =>{userObject=res.json(),
						  					 this.userEmailID=userObject.email,
											 this.emailForm.controls['from'].setValue(userObject.email),
											 this.emailForm.controls['from'].disable()},
									  error => this.errorMessage = <any>error);
	}

	getEmailTemplates(){
		this.candexService.get(Config.SERVER+'/emailTemplates/')
		.subscribe( res =>{this.emailTemplates=res.json().results},
					error => this.errorMessage = <any>error);
	}

	submitEmailForm(){
		this.emailForm.disable()
		this.sendButton="Sending..."
		let emailParams:any={};
		this.emailForm.value['body']=this.emailBody
		this.emailForm.value['from']=this.userEmailID
		emailParams=this.emailForm.value
		let params = new URLSearchParams();
		params.set('mailType', 'new');
		this.candexService.post(Config.SERVER+'/sendmail/',emailParams,undefined,params)
							.subscribe(res=>{res.status===200?(this.snackBar.open("Email Sent Successfully!",'',{duration:2000}),this.dialogRef.close(),this.sendButton="Send"):''},
										error=>{console.log(error),this.snackBar.open("Email Sending Failed!",'',{duration:2000}),this.emailForm.enable(),this.sendButton="Send"})
	}
 }