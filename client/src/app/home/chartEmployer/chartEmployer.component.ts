import { Component, OnInit,Input } from '@angular/core';
import { CandexService } from '../../shared/service/index';
import { Config } from '../../shared/index';
import {URLSearchParams, QueryEncoder} from '@angular/http';
import { Router,ActivatedRoute } from '@angular/router'

@Component({
  moduleId: module.id,
  selector: 'chartEmployer',
  templateUrl: 'chartEmployer.component.html',
  styleUrls:['chartEmployer.component.css','../../../../node_modules/nvd3/build/nv.d3.css']
})

export class ChartEmployerComponent implements OnInit{

	applyFilter:any
	jsonResponse:any
	type:any;
  	data:any=[]
  	options:any;
  	showFilterIcon=false
	CHARTWIDTH=0
	CHARTHEIGHT=0
	fullScreenFlag=false

	constructor(public candexService: CandexService,private router:Router){}
	
	ngOnInit(){
		this.getData()	
	}

	public refreshComponent(event:boolean){
		this.getData()
  	}

	public getData(){
		let params = new URLSearchParams();
  		params.set('choice', 'Employer');
  		params.set('applyFilter', this.applyFilter);
		this.candexService.get(Config.SERVER+'/employerReport/')
								.subscribe(res=>{this.jsonResponse=res.json().results,
												this.setData()
												this.setChartConfig()
												},
											error=>console.log(error))
	}
	public setData(){
		this.data[0]={values:[]}
		for(let i=0;i<this.jsonResponse.length;i++){
			this.data[0]['values'].push({label:this.jsonResponse[i]['label'],value:this.jsonResponse[i]['data'].length})
		}
	}

	public resizeChart(obj){
		let flag=obj['flag']
		if (flag==true){
			this.fullScreenFlag=true
			this.CHARTHEIGHT=obj['height']-275
			this.CHARTWIDTH=obj['width']-450
		}
		else{
			this.fullScreenFlag=false
			this.CHARTHEIGHT=obj['height']
			this.CHARTWIDTH=obj['width']	
		}
		this.setChartConfig()
	}

	public setChartConfig(){
		this.options={
			chart: {
			      type: 'discreteBarChart',
			      width:406+this.CHARTWIDTH,
			      height:200+this.CHARTHEIGHT,
			      x: function(d){return d.label;},
			      y: function(d){return d.value;},
			      showValues: true,
			      valueFormat: function(d){
			        return d3.format(',.1d')(d);
			      },
			      duration: 500,
			      xAxis: {
			        axisLabel: 'Past Employers',
			        fontSize:this.fullScreenFlag?8:0,
			        rotateLabels:this.jsonResponse.length>15?45:0,
			        axisLabelDistance: -5
			      },
			      showLegends:true,
			      yAxis: {
			        axisLabel: 'No. Of Candidates',
			        axisLabelDistance: -15,
    		        tickFormat: function(d){
			          return d3.format(',.1d')(d);
			        }
			      }
			    }
		}
	}
	
	public viewCandidate(candidateID){
        this.router.navigate(['editCandidate',candidateID])
	}

}