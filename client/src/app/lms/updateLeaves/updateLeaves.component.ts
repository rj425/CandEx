import { Component,OnInit,ViewContainerRef } from '@angular/core';
import { CandexService } from '../../shared/service/candex.service';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { Router,ActivatedRoute } from '@angular/router'
import { Config } from '../../shared/index'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material';


@Component({
  	moduleId: module.id,
  	selector: 'updateLeaves',
  	templateUrl: 'updateLeaves.component.html',
  	styleUrls: ['updateLeaves.component.css']
})
export class UpdateLeavesComponent implements OnInit{
	leaveForm:any;
	url:any;
	constructor(private candexService:CandexService,
				private router:Router,
				private route:ActivatedRoute,
				public snackBar: MatSnackBar){}
	ngOnInit(){
		this.leaveForm=new FormGroup({
			casualLeaves:new FormControl('',Validators.required),
			sickLeaves:new FormControl('',Validators.required),
			annualLeaves:new FormControl('',Validators.required),
			flexiLeaves:new FormControl('',Validators.required),
			maternityLeaves:new FormControl('',Validators.required)
		})
	}

	onSubmit(){
		console.log(this.leaveForm.value)
		/*this.candexService.post(this.url,this.leaveForm.value)
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