import { Component,Input,Output,OnInit } from '@angular/core'
import { CandexService,Config } from '../../shared/index'
import * as _ from 'underscore';

@Component({
	moduleId:module.id,
	selector:'chartWeeklyInterviews',
	templateUrl:'./chartWeeklyInterviews.component.html',
	styleUrls:['./chartWeeklyInterviews.component.css']
})
export class ChartWeeklyInterviewsComponent implements OnInit{

	public jsonResponse:any=null
	public levels:Array<string>
	public keyLength:number=null


	constructor(private _candexService:CandexService){}

	public ngOnInit(){
		this.getData()
	}

	public refreshComponent(event){
		this.getData()
	}

	public getData(){
		this.levels=null
		this.jsonResponse=null
		this._candexService.get(Config.SERVER+'/weeklyInterviews/')
							.subscribe(res=>{this.jsonResponse=res.json().results,
											 this.prepareTableData()},
									   error=>console.log(error))
	}

	public prepareTableData(){
		this.keyLength=Object.keys(this.jsonResponse).length
		this.levels=this.jsonResponse.levels
		delete this.jsonResponse.levels
	}

}