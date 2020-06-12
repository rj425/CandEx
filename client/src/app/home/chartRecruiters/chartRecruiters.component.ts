import { Component, OnInit,Input } from '@angular/core';
import { CandexService } from '../../shared/service/index';
import { Config } from '../../shared/index';
import { URLSearchParams, QueryEncoder } from '@angular/http';
import { ActivatedRoute,Router } from '@angular/router';


@Component({
  moduleId: module.id,
  selector: 'chartRecruiters',
  templateUrl: 'chartRecruiters.component.html',
  styleUrls:['chartRecruiters.component.css']
})
export class ChartRecruitersComponent implements OnInit {
	jsonResponse:any;
  	data:any=[]
  	options:any;
	showFilterIcon=false
	selectedFilter='false'

	CHARTWIDTH=0
	CHARTHEIGHT=0		
	fullScreenFlag=false
	
	constructor(public candexService: CandexService,private router:Router){}

	ngOnInit() {
		this.getData(this.selectedFilter)
	}

	public refreshComponent(event:boolean){
		this.getData(this.selectedFilter)
  	}

	getData(filter){
		let params = new URLSearchParams();
  		params.set('choice', 'Recruiter');
  		params.set('applyFilter',filter);
		this.candexService.get(Config.SERVER+'/returnRequests/',params)
								.subscribe(res=>{this.jsonResponse=res.json().results,
												this.setData()
												this.setChartConfig()
												},
											error=>console.log(error))
		}

	setData(choice?:string){
		this.data=[]
		for (let obj of this.jsonResponse){
			this.data.push({key:obj['label'],y:obj['requests'].length})
		}
	}

	public applyFilter(){
		this.getData(this.selectedFilter)
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
		      height: 160+this.CHARTHEIGHT,
		      width:300+this.CHARTWIDTH,
		      donut: true,
		      x: function(d){return d.key;},
		      y: function(d){return d.y;},
		      showLabels: true,
			  labelType:'value',
			  valueFormat: function(d){
			 	return d3.format(',.1d')(d);
			  },
		      duration: 500,
		      showLegend:this.jsonResponse.length>6?false:true,
              legend: {
	            maxKeyLength:this.fullScreenFlag?50:5
	          }
		    }
		}
 	 }

	public viewRequest(requestID){
        this.router.navigate(['editRequest',requestID])
	}

}