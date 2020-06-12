import { Component,OnInit,ViewChild,ElementRef} from '@angular/core';
import { CandexService } from '../../shared/service/candex.service';
import { Config } from '../../shared/index';
import { Router } from '@angular/router';
import * as _ from 'underscore'; //JavaScript Library
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

@Component({
  moduleId: module.id,
  selector: 'manageRequests',
  templateUrl: 'manageRequests.component.html',
  styleUrls: ['manageRequests.component.css'],
})
export class ManageRequestsComponent implements OnInit{

	public requests:string[]
	public errorMessage:string;
	public pagedItems:any=[];
	public pager:any={};
	public displayedColumns=['requestID',
							 'requestStatus',
							 'position',
							 'experience',
							 // 'skills',
							 'designation',
							 'department',
							 'actions']
	public dataSource:any
	@ViewChild('filter') filter:ElementRef;

	constructor(public candexService:CandexService, 
              public router:Router){}

	ngOnInit(){
		this.getFilter()
		this.getRequestsFromServer()
	}

  getFilter(){
      Observable.fromEvent(this.filter.nativeElement,'keyup')
              .distinctUntilChanged()
              .subscribe(()=>{
                  if (!this.dataSource) { return; }
                  this.dataSource.filter = this.filter.nativeElement.value;
              });
  }

	getRequestsFromServer(){
		this.candexService.get(Config.SERVER+'/requests/')
							.subscribe(
								requests=>{this.requests=requests.json().results,
										   this.dataSource=new RequestDataSource(this.requests)},
								error=>this.errorMessage=error);
	}	

	showMappedCandidates(requestID:string){
		this.router.navigate(['manageRequests/'+requestID+'/candidates'])
	}

	editRequest(requestID:number){
		this.router.navigate(['editRequest',requestID])
	}
}

export class RequestDataSource extends DataSource<any>{

    _filterChange = new BehaviorSubject('');
    get filter(): string { return this._filterChange.value; }
    set filter(filter: string) { this._filterChange.next(filter); }

    constructor(public dataSource:any[]){super()}

    connect(): Observable<any[]> {
            const displayDataChanges = [
              this._filterChange
            ];
        return Observable.merge(...displayDataChanges).map(() => {
          return this.dataSource.slice().filter((item:any) => {
            let searchStr=('REQ-'+item['requestID']+
            				item['requestStatus']+
            				item['position']+
            				item['experienceYears']+' Years'+
                    item['experieneMonths']+' Months'+
            				item['skills']+
            				item['designation']+
            				item['department']
                           ).toString().toLowerCase()
            return searchStr.indexOf(this.filter.toLowerCase()) != -1;
          });
        });
    }

    disconnect(){}
}