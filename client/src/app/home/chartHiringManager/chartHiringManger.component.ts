import { Component, OnInit,Input } from '@angular/core';
import { CandexService } from '../../shared/service/index';
import { Config } from '../../shared/index';
import {URLSearchParams, QueryEncoder} from '@angular/http';


@Component({
  moduleId: module.id,
  selector: 'chartHiringManager',
  templateUrl: 'chartHiringManager.component.html',
  styleUrls:['chartHiringManager.component.css']
})
export class ChartHiringManagerComponent implements OnInit {
	
	jsonResponse:any
  	data:any=[]
  	options:any;
	hiringManagerList:any=[];
	selectedFilter='false'
	showFilterIcon=false

	CHARTWIDTH=0
	CHARTHEIGHT=0
	fullScreenFlag=false
	
	constructor(public candexService: CandexService){}

	ngOnInit() {
		this.getData()
	}

	public refreshComponent(event:boolean){
		this.getData()
  	}

  	radioSelection(value){
		this.getData()
	}

	applyFilter(){
		this.getData()
	}

	getData(){
		let params1 = new URLSearchParams();
  		params1.set('choice', 'Hiring Manager');
  		params1.set('applyFilter', this.selectedFilter);
		this.candexService.get(Config.SERVER+'/returnRequests/',params1)
								.subscribe(res=>{this.jsonResponse=res.json().results
												 this.setData()
												 this.setChartConfig()
												},
											error=>console.log(error))							
	}

	setData(choice?:string){
		this.data=[]
		for(let i=0;i<this.jsonResponse.length;i++){
			this.data.push({key:this.jsonResponse[i]['label'],y:this.jsonResponse[i]['requests'].length})
		}		
	}

	public resizeChart(obj){
		let flag=obj['flag']
		if (flag==true){
			this.fullScreenFlag=true
			this.CHARTHEIGHT=obj['height']-235
			this.CHARTWIDTH=obj['width']-300
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
		      height: 160+this.CHARTHEIGHT,
		      width:250+this.CHARTWIDTH,
		      donut: true,
		      x: function(d){return d.key;},
		      y: function(d){return d.y;},
		      showLabels: true,
    		  labelType:'value',
			  valueFormat: function(d){
				return d3.format(',.1d')(d);
			  },
		      pie: {
		        startAngle: function(d) { return d.startAngle/2 -Math.PI/2 },
		        endAngle: function(d) { return d.endAngle/2 -Math.PI/2 }
		      },
		      showLegend:this.jsonResponse.length>8?false:true,
		      duration: 500,
              legend: {
	            maxKeyLength:this.fullScreenFlag?50:3
	          }
		    }
		}
	}
 }