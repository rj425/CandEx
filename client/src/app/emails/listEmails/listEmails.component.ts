import { Component,OnInit,ViewChild,Input,ElementRef} from '@angular/core';
import { Http, Response, Headers, URLSearchParams } from '@angular/http';
import { CandexService,Config } from '../../shared/index';
import * as _ from 'underscore'; 
import { ActivatedRoute, Router } from '@angular/router';
import { DataSource } from '@angular/cdk/collections';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';

@Component({
  moduleId: module.id,
  selector: 'emaiT',
  templateUrl: 'listEmails.component.html',
  styleUrls: ['listEmails.component.css']
})
export class ListEmailComponent implements OnInit{ 

  public emails: any;
  public errorMessage: string;
  
  public searchParams:string;
  public showDialog:boolean=false;
  public displayedColumns=['templateID',
               'templateName',
               'emailSubject',
               'actions']
  public dataSource:any;
  @ViewChild('filter') filter:ElementRef;
  
  constructor(public candexService: CandexService,private route:ActivatedRoute,public router:Router){}

  ngOnInit(){
    this.getFilter()
    this.getEmailsFromServer()
  }

  getFilter(){
      Observable.fromEvent(this.filter.nativeElement,'keyup')
              .distinctUntilChanged()
              .subscribe(()=>{
                  if (!this.dataSource) { return; }
                  this.dataSource.filter = this.filter.nativeElement.value;
              });
  }
  
  editEmail(template:any){
    let templateID=template.templateID
    this.router.navigate(['editEmails',templateID])
  }

  getEmailsFromServer(){
  
    this.candexService.get(Config.SERVER+'/emailTemplates/')
              .subscribe(
                requests=>{this.emails=requests.json().results,
                       this.dataSource=new EmailDataSource(this.emails)},
                error=>this.errorMessage=error);
  }  


}

export class EmailDataSource extends DataSource<any>{

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
            let searchStr=(item['templateID']+
                    item['templateName']+
                    item['emailSubject']
                        ).toString().toLowerCase()
            return searchStr.indexOf(this.filter.toLowerCase()) != -1;
          });
        });
    }

    disconnect(){}
}


 