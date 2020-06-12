import { Component,OnInit,Input,Output,EventEmitter,trigger,state,animate,transition,style } from '@angular/core';

@Component({
	moduleId:module.id,
	selector:'cardContainer',
	templateUrl:'cardContainer.component.html',
	styleUrls:['cardContainer.component.css'],
})
export class CardContainerComponent{

	@Input() cardTitle:string=''
	@Input() public width:number
	@Input() public height:number
	@Input() public backgroundColor:string
	@Input() public fontColor:string
	@Output() public refreshEvent:EventEmitter<boolean>=new EventEmitter()
	public fullScreenFlag:boolean=false
	public fullScreenStyle:any=undefined

	public refreshComponent(event){
		this.refreshEvent.emit(true)
	}

	public switchToFullScreen(){
		this.fullScreenFlag=!this.fullScreenFlag		
		if(this.fullScreenFlag===true){
			this.fullScreenStyle={
				'width':'75%',
				'height':'80%',
				'margin':'auto',
				'top':'5%',
				'left':'12.50%',
				'bottom':'5%',
				'right':'12.50%',
				'position':'fixed',
				'z-index':'999'
			}
		}
		else if(this.fullScreenFlag===false){
			this.fullScreenStyle={
				'height':'250px',
				'width':'100%'
			}
		}
	}

	public printComponent(){
	}
}