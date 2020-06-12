import { Component,OnInit,Input,Output,EventEmitter,trigger,state,animate,transition,style,ElementRef,ViewChild } from '@angular/core';

@Component({
	moduleId:module.id,
	selector:'chartContainer',
	templateUrl:'chartContainer.component.html',
	styleUrls:['chartContainer.component.css'],
	animations:[	
		trigger('toggleView',[
			state('true',style({marginTop:0,opacity:1})),
			state('false',style({})),
			transition('*=>*',animate(200))
		])
	]
})
export class ChartContainerComponent{

	@ViewChild('card') card:ElementRef
	@Input() public width:number
	@Input() public height:number
	@Input() public chartTitle:string
	@Input() public dataTableTitle:string
	@Input() public filterTitle:string
	@Input() public showFilterIcon:boolean=true
	@Input() public backgroundColor:string
	@Input() public fontColor:string
	@Output() public refreshEvent:EventEmitter<boolean>=new EventEmitter()
	@Output() public maximizeEvent:EventEmitter<any>=new EventEmitter()
	public fullScreenFlag:boolean=false
	public fullScreenStyle:any=undefined
	public showFilterViewFlag:boolean=false
	public showDataTableViewFlag:boolean=false
	public CHARTWIDTH:number=0
	public CHARTHEIGHT:number=0	
	
	public showFilterView(){
		this.showFilterViewFlag=!this.showFilterViewFlag
	}

	public showDataTableView(){
		this.showDataTableViewFlag=!this.showDataTableViewFlag
	}

	public refreshComponent(event){
		this.refreshEvent.emit(true)
	}

	public showChartView(){
		this.showDataTableViewFlag=false
		this.showFilterViewFlag=false
	}

	public onResize(){
		if(this.fullScreenFlag==true){
			this.CHARTHEIGHT=this.card.nativeElement.offsetHeight
			this.CHARTWIDTH=this.card.nativeElement.offsetWidth
			this.fullScreenFlag=false
			this.switchToFullScreen()
		}
		else{
			this.CHARTHEIGHT=0
			this.CHARTWIDTH=0
		}
	}

	public switchToFullScreen(){
		this.fullScreenFlag=!this.fullScreenFlag		
		if(this.fullScreenFlag===true){
			this.fullScreenStyle={
				'width':'75%',
				'height':'80%',
				'margin':'auto',
				'top':'5%',
				'left':'12.5%',
				'bottom':'5%',
				'right':'12.5%',
				'position':'fixed',
				'z-index':'999'
			}
			if(this.CHARTWIDTH==0 && this.CHARTHEIGHT==0){
				setTimeout(()=>{
					this.CHARTHEIGHT=this.card.nativeElement.offsetHeight
					this.CHARTWIDTH=this.card.nativeElement.offsetWidth
					this.maximizeEvent.emit({width:this.CHARTWIDTH,height:this.CHARTHEIGHT,flag:true})		
				},250)
			}else{
				this.maximizeEvent.emit({width:this.CHARTWIDTH,height:this.CHARTHEIGHT,flag:true})
			}								
		}
		else if(this.fullScreenFlag===false){
			this.fullScreenStyle={
				'height':'250px',
				'width':'100%'
			}
			this.CHARTHEIGHT=0
			this.CHARTWIDTH=0
			this.maximizeEvent.emit({width:this.CHARTWIDTH,height:this.CHARTHEIGHT,flag:false})
		}

	}

	public printComponent(){
	// 	let printContents, popupWin;
	// 	printContents = document.getElementsByClassName('chartView').item(1);
	// 	popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
	// 	popupWin.document.open();
	// 	popupWin.document.write(`
	// 	<html>
	// 		<head>
	// 		<title>Print tab</title>
	// 		<style>
	// 		//........Customized style.......
	// 		</style>
	// 		</head>
	// 	<body onload="window.print();window.close()">${printContents}</body>
	// 	</html>`
	// 	);
	// 	popupWin.document.close();
	}
}