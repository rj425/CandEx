import { Component, OnInit,Input } from '@angular/core';
import { CandexService } from '../../shared/service/index';
import { Config } from '../../shared/index';
import {URLSearchParams, QueryEncoder} from '@angular/http';


@Component({
  moduleId: module.id,
  selector: 'chartMix',
  templateUrl: 'chartMix.component.html',
  styleUrls:['chartMix.component.css']
})
export class ChartMixComponent implements OnInit {
	jsonResponse:any;
	options:any
  	data:any=[]
  	labels:any=[];
	choice:any='Source';
	choiceList=['Source','Gender']
	showFilterIcon=true
	selectedFilter='false'
	CHARTHEIGHT=0
	CHARTWIDTH=0
	fullScreenFlag:boolean=false
	
	constructor(public candexService: CandexService){}

	ngOnInit() {
		this.getData()
	}

	getData(){
		let params = new URLSearchParams();
  		params.set('choice', this.choice);
  		params.set('filter', this.selectedFilter);
  		this.candexService.get(Config.SERVER+'/sourceGenderGeoMix/',params)
									.subscribe(res=>{this.jsonResponse=res.json().results
													this.setData()
													this.setChartConfig()
													},
												error=>console.log(error))


	}
	public refreshComponent(event:boolean){
    	this.getData()
  	}

	applyFilter(){
		this.getData()
	}

	applyChoice(){
		this.getData()
	}

	setData(){
  		this.data=[]
		for(let i=0;i<this.jsonResponse.length;i++){
			this.data.push({label:this.jsonResponse[i]['label'],value:this.jsonResponse[i]['candidates'].length})
		}
	}

	public resizeChart(obj){
		let flag=obj['flag']
		if (flag==true){
			this.fullScreenFlag=true
			this.CHARTHEIGHT=obj['height']-250
			this.CHARTWIDTH=obj['width']-350
		}
		else{
			this.fullScreenFlag=false
			this.CHARTHEIGHT=obj['height']
			this.CHARTWIDTH=obj['width']	
		}
		this.setChartConfig()
	}


	setChartConfig(){
		this.options={
			chart: {
      				type: 'pieChart',
      				height: 200+this.CHARTHEIGHT,
      				width:300+this.CHARTWIDTH,
					x: function(d){return d.label;},
      				y: function(d){return d.value;},
      				showLabels:(true),
      				labelType:'value',
					valueFormat: function(d){
						return d3.format(',.1d')(d);
					},
  					duration: 500,
      				labelThreshold: 0.01,
      				labelSunbeamLayout: false,
      				showLegend: this.jsonResponse.length>8?false:true,
                	legend: {
                    maxKeyLength:(this.fullScreenFlag?50:3)
                }
			}
  		}	

	}

 }