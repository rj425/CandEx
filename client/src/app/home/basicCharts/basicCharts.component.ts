import { Component, OnInit,Input } from '@angular/core';
import { CandexService } from '../../shared/service/index';
import { Config } from '../../shared/index';
import { URLSearchParams, QueryEncoder } from '@angular/http';


@Component({
  moduleId: module.id,
  selector: 'basicCharts',
  styleUrls:['basicChart.css'],
  templateUrl: 'basicCharts.component.html'
})
export class BasicChartsComponent implements OnInit {
	processData:any;
	candidateData:any;
	requestData:any
	type:any;
  	data:any;
  	options:any;
	chartData:any=[];
	labels:any=[];
	dataset:any;
		
	constructor(public candexService: CandexService){}

	ngOnInit() {
		this.getData()
	}

	public refreshComponent(event:boolean){
		this.getData()
  	}

	getData(){
		this.candexService.get(Config.SERVER+'/processTime/')
						  .subscribe(res=>{this.processData=res.json().results})
		this.candexService.get(Config.SERVER+'/basicMetrics/')
						  .subscribe(res=>{this.candidateData=res.json().results.candidates})
		this.candexService.get(Config.SERVER+'/basicMetrics/')
						  .subscribe(res=>{this.requestData=res.json().results.requests})
	}
}