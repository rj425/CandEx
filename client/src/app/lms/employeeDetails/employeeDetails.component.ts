import { Component,OnInit,ViewContainerRef } from '@angular/core';
import { CandexService } from '../../shared/service/candex.service';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { Router,ActivatedRoute } from '@angular/router'
import { Config } from '../../shared/index'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

@Component({
  	moduleId: module.id,
  	selector: 'employeeDetails',
  	templateUrl: 'employeeDetails.component.html',
  	styleUrls: ['employeeDetails.component.css']
})
export class EmployeeDetailsComponent implements OnInit{

	employeeForm:any;
	showForm:any=false;
	candidateID:any;
	candidate:any;
	url:any;
	constructor(private candexService:CandexService,
				private router:Router,
				private route:ActivatedRoute,
				public snackBar: MatSnackBar){}
	ngOnInit(){
		this.route.params.map(params=>params['candidateID'])
						 .subscribe(candidateID=>this.candidateID=candidateID)
		this.getCandidateInfo()
		this.createForm()
	}

	getCandidateInfo(){
		this.candexService.get(Config.SERVER+'/candidates/'+this.candidateID+'/')
						  .subscribe(
						  			res=>{this.candidate=res.json(),
						  				this.createForm()},
						  			error=>console.log(error))
	}

	createForm(){
		this.employeeForm=new FormGroup({
			firstName:new FormControl(this.candidate?this.candidate.personal.firstName:'',Validators.required),
			lastName:new FormControl(this.candidate?this.candidate.personal.lastName:'',Validators.required),
			mobile:new FormControl(this.candidate?this.candidate.personal.mobile:'',Validators.required),
			email:new FormControl(this.candidate?this.candidate.personal.email:'',Validators.required),
			gender:new FormControl(this.candidate?this.candidate.personal.gender:'',Validators.required),
			designation:new FormControl('',Validators.required),
			joiningDate:new FormControl(this.candidate?this.candidate.offer.joiningDate:'',Validators.required),
			employeeID:new FormControl('',Validators.required),
			userID:new FormControl('',Validators.required),
			middleName:new FormControl(''),
			currentAddress:new FormControl('',Validators.required),
			permanentAddress:new FormControl('',Validators.required),
			managerID:new FormControl('',Validators.required),
		})
		this.showForm=true;
	}

	onSubmit(){
		console.log(this.employeeForm.value)
		/*this.candexService.post(this.url,this.employeeForm.value)
							.subscribe(res=>{res.json(),this.checkStatus()},
										error=>{console.log(error),this.snackBar.open('Some problem occurred. Try Again.','',{duration:2000})})
*/
	}
	checkStatus(){
		let response:any;
		this.candexService.get(this.url)
							.subscribe(res=>{response=res.json(),console.log(response)},
										error=>{console.log(error),this.snackBar.open('Cannot fetch success message')})
	
		if(response==true){
			this.snackBar.open('Details added successfully','',{duration:2000})
		}else{
			this.snackBar.open('Detail adding failed!','',{duration:2000})
		}
	}

}