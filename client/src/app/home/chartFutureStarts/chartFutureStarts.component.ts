import { Component,Input,Output,OnInit } from '@angular/core'
import { CandexService,Config } from '../../shared/index'
import * as _ from 'underscore';
import { Router,ActivatedRoute } from '@angular/router'


@Component({
	moduleId:module.id,
	selector:'chartFutureStarts',
	templateUrl:'./chartFutureStarts.component.html',
	styleUrls:['./chartFutureStarts.component.css']
})
export class ChartFutureStartsComponent implements OnInit{
	
	constructor(private _candexServcie:CandexService,private router:Router){}

	public jsonResponse:any
	public data:any=[]
	public options:any
	public showFilterIcon:boolean=false
	public months:any
	public keys
	public labels=[]

	CHARTWIDTH=0
	CHARTHEIGHT=0
	fullScreenFlag=false

	ngOnInit(){
		this.getData()
	}

	public refreshComponent(event:boolean){
		this.getData()
	}

	public getData(){
		this._candexServcie.get(Config.SERVER+'/futureStarts/')
							.subscribe(res=>{this.jsonResponse=res.json().results,
											 this.setData(),
											this.setChartConfig()},
									   error=>console.log(error))
	}

	public setData(){
		this.data[0]={values:[]}
		this.months=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
		this.keys=_.allKeys(this.jsonResponse)
		for(let i=0;i<this.keys.length;i++){
			let monthName=this.months[(+this.keys[i].substring(4,this.keys[i].length))-1]
			let label=monthName
			this.labels.push(label)
			this.data[0]['values'].push({label:label,value:this.jsonResponse[this.keys[i]].length})
		}
	}

	public resizeChart(obj){
		let flag=obj['flag']
		if (flag==true){
			this.fullScreenFlag=true
			this.CHARTHEIGHT=obj['height']-275
			this.CHARTWIDTH=obj['width']-350
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
			      width:300+this.CHARTWIDTH,
			      height:200+this.CHARTHEIGHT,
			      x: function(d){return d.label;},
			      y: function(d){return d.value;},
			      showValues: true,
			      valueFormat: function(d){
			        return d3.format(',.1d')(d);
			      },
			      duration: 500,
			      xAxis: {
			        axisLabel: 'Months',
			        axisLabelDistance: -5
			      },
			      yAxis: {
			        axisLabel: 'Candidates to Join',
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