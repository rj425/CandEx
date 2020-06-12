import { Component,Input,Output,OnInit } from '@angular/core'
import { CandexService,Config } from '../../shared/index'
import * as _ from 'underscore';

@Component({
	moduleId:module.id,
	selector:'chartInterviewsScheduled',
	templateUrl:'./chartInterviewsScheduled.component.html',
	styleUrls:['./chartInterviewsScheduled.component.css']
})
export class ChartInterviewsScheduledComponent implements OnInit{

	public jsonResponse:any


	constructor(private _candexService:CandexService){}

	public ngOnInit(){
		this.getData()
	}

	public refreshComponent(event){
		this.getData()
	}

	public getData(){
		this.jsonResponse=[]
		this._candexService.get(Config.SERVER+'/currentWeekInterviews/')
							.subscribe(res=>{this.jsonResponse=res.json().results},
									   error=>console.log(error))
	}

}