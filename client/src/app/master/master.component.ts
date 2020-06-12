import { Component,OnInit,ViewContainerRef,OnChanges, SimpleChange } from '@angular/core';
import { CandexService } from '../shared/index';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { Router,ActivatedRoute,Params} from '@angular/router'
import { Config } from '../shared/index';
import * as _ from 'underscore'; //JavaScript Library

@Component({
	moduleId: module.id,
	selector:'master',
	templateUrl:'master.component.html',
	styleUrls:['master.component.css'],
})

export class MasterComponent implements OnInit {
	constructor(public candexService:CandexService,private router:Router,private route:ActivatedRoute){}
	public masterData:any;
	public errorMessage: string;
	public ListOfMasters: string[] =['Sources',
									'Educational Institutions',
									'Departments',
									'Courses',
									'Panel Members',
									'Designations',
									'Skills',
									'Positions',
									'Candidate Engagement Actions'];
	public masterForm:FormGroup;
	public choice:string;
	public showForm:string=null
	public keys:any;
	public values:any=[];
	public displayedColumns=[]
	public masterName
	public masterKeyList
	
	ngOnInit(){
        this.candexService.get("/assets/masterKeyList.json")
 						  .subscribe(res=>this.masterKeyList=res.json())

	}
		
		public onChange(event:any){
			this.onSubmit(event);
		}

		public onSubmit(choice:any){
			this.showForm=choice	
			this.values=[];
			if(choice=='Sources'){
				this.choice="sources";
			}else if(choice=='Educational Institutions'){
				this.choice="institutions";				
			}else if(choice=='Courses'){
				this.choice="courses";				
			}else if(choice=='Departments'){
				this.choice="department";				
			}else if(choice=='Designations'){
				this.choice="designation";				
			}else if(choice=='Panel Members'){
				this.choice="panelMembersDirectory";				
			}else if(choice=='Skills'){
				this.choice="skills";				
			}else if(choice=='Positions'){
				this.choice="position";				
			}else if(choice=='Candidate Engagement Actions'){
				this.choice="engagementActions";				
			}
			if(this.choice!=null)
				this.getMaster(this.choice);
		}

		getMaster(selection:string){
			this.candexService.get(Config.SERVER+'/'+selection+'/')
	                      .subscribe(
	                        res => {this.masterData=res.json().results,
		                        	this.getKeys(),
		                        	this.getValues()
		                    		},
	                        error => this.errorMessage = <any>error,
	                      );
	  	}

		getKeys(){
			this.keys=this.masterKeyList[this.choice]
		}

		getValues(){
			this.values=[]
			for(let i in this.masterData){
				let value=_.values(this.masterData[i])
	  			this.values.push(value);
	  		}
	  	}

	  	notifyMasterHandler(url){
	  		this.getMaster(url);
	  	}



}