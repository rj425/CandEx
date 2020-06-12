import { Component,OnInit,Input,OnChanges} from '@angular/core';
import {Http,Headers } from '@angular/http';
import { Config } from '../../../shared/index';
import { ActivatedRoute,Router,Params } from '@angular/router';
import { CandexService } from '../../../shared/service/candex.service'

@Component({
	moduleId:module.id,
	selector:'panellistNotes',
	templateUrl:'panellistNotes.component.html',
	styleUrls:['panellistNotes.component.css']
})
export class PanellistNotesComponent implements OnChanges{

	@Input() public candidateID:number=null
	@Input() public selectedTabIndex:number=undefined
	@Input() public authorizationHeader:Headers=undefined
	public candidateData:any=null
	public levelData:any=[]
	public noNotesAvailable:boolean=false

	constructor(public _route:ActivatedRoute,public _candexService:CandexService){}

	ngOnChanges()
	{
		if(this.selectedTabIndex===2)
			this.getCandidateInformation()
	}

	public getCandidateInformation(){
		this._candexService.get(Config.SERVER+'/candidates/'+this.candidateID+'/',undefined,this.authorizationHeader)
						   .subscribe(res=>{this.candidateData=res.json(),
						   					this.getInterviewRelatedData()})
	}

	public getInterviewRelatedData(){
		if(this.candidateData!==null){
			this.levelData=this.candidateData.interviewLevels
			if(this.levelData.length!==0)
				this.checkForPanellistNotes()
		}
	}

	public checkForPanellistNotes(){

		for(let i=0;i<this.levelData.length;i++){
			let roundData:Array<any>=this.levelData[i].interviewRounds
			for(let j=0;j<roundData.length;j++){
				let panellistData:Array<any>=roundData[j].panel
				for(let k=0;k<panellistData.length;k++){
					if(panellistData[k].notes!==''){
						this.noNotesAvailable=false
						return
					}
					else
						this.noNotesAvailable=true
				}
			}
		}
	}
}