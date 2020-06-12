import { Component, OnInit } from '@angular/core';
import { CandexService } from '../shared/service/index';
import { Config } from '../shared/index';
import { Router, NavigationEnd, NavigationStart, ActivatedRoute,Params} from '@angular/router'
/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.css'],
})
export class HomeComponent implements OnInit {

  errorMessage: string;  
  candidates: any[] = [];
  chartChoice:any=null;
  chartData:any=[]
  type:any;
  data:any;
  options:any;
  data1=[10,20,5,2,31,17,1]
  label1=['A','B','C','D','E','F','G']
  public select:string='Choose option'

  constructor(public candexService: CandexService, private router:Router){

  }

  ngOnInit() {
    this.setChartConfig();
     this.router.events.forEach((event) => {    
				if(event instanceof NavigationEnd){
         // $('.collapsible').collapsible();
        }
     });    
  }


  public refreshComponent(event:boolean){
     for(let i=0;i<this.data.datasets[0].data.length;i++){
       this.data.datasets[0].data[i]=Math.floor(Math.random()*100)
     }
    this.setChartConfig();
  }

    setChartConfig(){

    var default_colors = ["#894895","#30d3e2","#FF6384",'#3366CC','#DC3912','#008080','#109618','#990099','#3B3EAC','#0099C6','#DD4477','#66AA00','#B82E2E','#316395','#994499','#22AA99','#AAAA11','#6633CC','#E67300','#8B0707','#329262','#5574A6','#3B3EAC']
    this.type = 'pie';
    this.data =  {
    labels:this.label1,
    datasets:  
        [{
            data: this.data1,
            backgroundColor: default_colors
            
        }]
    };

    this.options = {
      responsive: true,
      maintainAspectRatio: false,
      animation:{
                animateScale:true
            },
      legend:{position:'bottom'}
    };
    
  }
}
