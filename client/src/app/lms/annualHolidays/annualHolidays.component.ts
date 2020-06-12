import { Component,OnInit,ViewContainerRef } from '@angular/core';
import { CandexService } from '../../shared/service/candex.service';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { Router,ActivatedRoute } from '@angular/router'
import { Config } from '../../shared/index'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@Component({
  	moduleId: module.id,
  	selector: 'annualHolidays',
  	templateUrl: 'annualHolidays.component.html',
  	styleUrls: ['annualHolidays.component.css']
})
export class AnnualHolidaysComponent implements OnInit{

	totalHolidays:any=0;
	holidayForm:any;
	showForm:any=false;
	constructor(private candexService:CandexService,private router:Router,private route:ActivatedRoute){}
	ngOnInit(){}

	updateLength(){
		this.showForm=true;
		this.createForm()

	}

	createForm(){
		this.holidayForm=new FormGroup({
			holidays:new FormArray(this.initHolidays())
		})
	}

	initHolidays(){
		let holidayArr:FormGroup[]=[];

		let holidayRow=new FormGroup({
			holidayDate:new FormControl()
		})
		for(let i=0;i<this.totalHolidays;i++){
			holidayArr.push(holidayRow)
		}
		return holidayArr 
	}

	onSubmit(){
		let response:string;
		let holidayFormControl=<FormArray>this.holidayForm.controls['holidays'];
		response=holidayFormControl.at(0).value.holidayDate
		for(let i=1;i<this.totalHolidays;i++){
			response=response.concat(",")
			response=response.concat(String(holidayFormControl.at(i).value.holidayDate))
			
		}
		console.log(response)

	}
}
