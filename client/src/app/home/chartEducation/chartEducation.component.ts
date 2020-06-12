import { Component, OnInit,Input,ViewEncapsulation } from '@angular/core';
import { CandexService } from '../../shared/service/index';
import { Config } from '../../shared/index';
import { URLSearchParams, QueryEncoder} from '@angular/http';
import { Location } from '@angular/common'
import { ActivatedRoute,Router } from '@angular/router';


@Component({
  moduleId: module.id,
  selector: 'chartEducation',
  templateUrl: 'chartEducation.component.html',
  styleUrls:['chartEducation.component.css','../../../../node_modules/nvd3/build/nv.d3.css'],
  encapsulation:ViewEncapsulation.None
})

export class ChartEducationComponent implements OnInit{

	options:any;
	data:any=[]
	jsonResponse:any
	applyFilter:any
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
  		params.set('choice', 'Education');
  		params.set('applyFilter', this.applyFilter);
		this.candexService.get(Config.SERVER+'/educationReport/')
								.subscribe(res=>{this.jsonResponse=res.json().results
												this.setData()			
												this.setChartConfig()
												},
											error=>console.log(error))
	}

	public setData(){
  		this.data=[]
		for(let i=0;i<this.jsonResponse.length;i++){
			this.data.push({label:this.jsonResponse[i]['label'],value:this.jsonResponse[i]['data'].length})
		}
	}

	public resizeChart(obj){
		let flag=obj['flag']
		if (flag==true){
			this.fullScreenFlag=true
			this.CHARTHEIGHT=obj['height']-250
			this.CHARTWIDTH=obj['width']-300
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
      				type: 'pieChart',
      				height: 200+this.CHARTHEIGHT,
      				width:250+this.CHARTWIDTH,
					x: function(d){return d.label;},
      				y: function(d){return d.value;},
      				showLabels:true,
      				labelType:'value',
					valueFormat: function(d){
						return d3.format(',.1d')(d);
					},
  					duration: 500,
      				labelThreshold: 0.01,
      				labelSunbeamLayout: false,
      				showLegend: this.jsonResponse.length>6?false:true,
                	legend: {
                    maxKeyLength:(this.fullScreenFlag?50:5)
                }
			}
  		}
	}	

	public viewCandidate(candidateID){
        this.router.navigate(['editCandidate',candidateID])
	}
}