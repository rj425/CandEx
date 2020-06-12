import { Component, OnInit,Input } from '@angular/core';
import { CandexService } from '../../shared/service/index';
import { Config } from '../../shared/index';
import {URLSearchParams, QueryEncoder} from '@angular/http';


@Component({
  moduleId: module.id,
  selector: 'chartCostPerHire',
  templateUrl: 'chartCostPerHire.component.html',
  styleUrls:['chartCostPerHire.component.css']
})
export class ChartCostPerHireComponent implements OnInit {
	jsonResponse:any=[]
	
	constructor(public candexService: CandexService){}

	ngOnInit() {
		this.getData()
	}

	public refreshComponent(event:boolean){
		this.getData()
  }

  	

	getData(){
		this.candexService.get(Config.SERVER+'/costPerHire/')
								.subscribe(res=>{this.jsonResponse=res.json().results},
											error=>console.log(error))
		}

	

	

 }
