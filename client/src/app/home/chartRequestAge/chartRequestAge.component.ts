import { Component,Input,Output,OnInit } from '@angular/core'
import { CandexService,Config } from '../../shared/index'
import * as _ from 'underscore';
import { ActivatedRoute,Router } from '@angular/router'

@Component({
	moduleId:module.id,
	selector:'chartRequestAge',
	templateUrl:'./chartRequestAge.component.html',
	styleUrls:['./chartRequestAge.component.css']
})
export class ChartRequestAgeComponent implements OnInit{

	public jsonResponse:any
	resultLength=0


	constructor(private _candexService:CandexService,private router:Router){}

	public ngOnInit(){
		this.getData()
	}

	public refreshComponent(event){
		this.getData()
	}

	public getData(){
		this.jsonResponse=null
		this._candexService.get(Config.SERVER+'/requestAgeing/')
							.subscribe(res=>{this.jsonResponse=res.json().results,this.resultLength=Object.keys(this.jsonResponse).length},
									   error=>console.log(error))
	}

	public viewRequest(requestID){
        this.router.navigate(['editRequest',requestID])
	}

}