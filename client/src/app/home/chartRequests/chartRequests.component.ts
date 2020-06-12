import { Component, OnInit,Input } from '@angular/core';
import { CandexService } from '../../shared/service/index';
import { Config } from '../../shared/index';
import {URLSearchParams, QueryEncoder} from '@angular/http';
import { ActivatedRoute,Router } from '@angular/router'

@Component({
  moduleId: module.id,
  selector: 'chartRequests',
  templateUrl: 'chartRequests.component.html',
  styleUrls:['chartRequests.component.css']
})
export class ChartRequestsComponent implements OnInit {

	offered:any
	notOffered:any
	jsonResponse:any;
  	data:any;
  	options:any;
	showFilterIcon=false

	CHARTWIDTH=0
	CHARTHEIGHT=0		
	fullScreenFlag=false

	constructor(public candexService: CandexService,private router:Router){}

	ngOnInit() {
		this.getData()	
	}

	public refreshComponent(event:boolean){
		this.getData()
  	}

	getData(){
		let params1 = new URLSearchParams();
  		params1.set('choice', 'RequestID');
  		params1.set('filter', 'false');
  		this.candexService.get(Config.SERVER+'/sourceGenderGeoMix/',params1)
									.subscribe(res=>{this.notOffered=res.json().results
													this.getData1()
													},
												error=>console.log(error))
	}

	public getData1(){
		let params1 = new URLSearchParams();
  		params1.set('choice', 'RequestID');
  		params1.set('filter', 'true');
  		this.candexService.get(Config.SERVER+'/sourceGenderGeoMix/',params1)
									.subscribe(res=>{this.offered=res.json().results
													this.setData()
													this.setChartConfig()
													},
												error=>console.log(error))		
	}

	setData(){
		this.data=[
			{key:'Offered',values:[],vAxis:1},
			{key:'Not Offered',values:[],vAxis:1}			
		]
		for(let i=0;i<this.notOffered.length;i++){
			this.data[0]['values'].push({x:this.offered[i]['label'],y:this.offered[i]['candidates'].length})
			this.data[1]['values'].push({x:this.notOffered[i]['label'],y:this.notOffered[i]['candidates'].length})
		}
	}

	public resizeChart(obj){
		let flag=obj['flag']
		if (flag==true){
			this.fullScreenFlag=true
			this.CHARTHEIGHT=obj['height']-275
			this.CHARTWIDTH=obj['width']-456
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
		      type: 'multiBarChart',
		      height: 200+this.CHARTHEIGHT,
		      width:406+this.CHARTWIDTH,
		      showControls:false,
		      clipEdge: true,
		      duration: 500,
		      stacked: true,
		      xAxis: {
		        axisLabel: "Request ID's",
		        axisLabelDistance:-5,
		        showMaxMin: false,
		        tickFormat: function(d){
		          return d3.format(',.1d')(d);
		        }
		      },
		      yAxis: {
		        axisLabel: 'No. Of Candidates',
		        axisLabelDistance: -15,
		        tickFormat: function(d){
		          return d3.format(',.1d')(d);
		        }
		      },
		        reduceXTicks:false
		    }
		}
	}

	public viewCandidate(candidateID){
        this.router.navigate(['editCandidate',candidateID])
	}

 }