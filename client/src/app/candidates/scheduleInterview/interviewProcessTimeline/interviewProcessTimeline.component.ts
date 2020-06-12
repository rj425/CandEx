import { Component,Input,Output,OnInit,OnChanges,EventEmitter,SimpleChanges } from '@angular/core';
import { Http } from '@angular/http';
import { ActivatedRoute,Router } from '@angular/router';
import { Config,CandexService } from '../../../shared/index';
import * as _ from 'underscore';

@Component({
	moduleId:module.id,
	selector:'interviewProcessTimeline',
	templateUrl:'interviewProcessTimeline.component.html',
	styleUrls:['interviewProcessTimeline.component.css']
})
export class InterviewProcessTimelineComponent implements OnChanges{
	
	@Input() private candidateID:number
	@Input() private selectedTabIndex:number=undefined
	@Input() private authorizationHeader:any=undefined
	@Input() private refresh:boolean=null
	public candidateData:any=null
	public roundPanellists:Array<string>=null

	constructor(private _route:ActivatedRoute,private _candexService:CandexService){}

	ngOnChanges(simpleChange:any)
	{	
		simpleChange=_.pairs(simpleChange)
		if(simpleChange.length===1 && simpleChange[0][0]==='refresh')
			if(simpleChange[0][1]['currentValue']===true)
				this.getCandidateInformation()
		if(this.selectedTabIndex===1)
			this.getCandidateInformation()
	}

	public getCandidateInformation(){
		this._candexService.get(Config.SERVER+'/candidates/'+this.candidateID+'/',undefined,this.authorizationHeader)
						   .subscribe(res=>{this.candidateData=res.json()})
	}

}