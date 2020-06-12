import { Component,OnInit,ViewChild,Input,ElementRef} from '@angular/core';
import { Http, Response, Headers, URLSearchParams } from '@angular/http';
import { CandexService } from '../../shared/service/candex.service';
import * as _ from 'underscore'; //JavaScript Library
import { ActivatedRoute, Router } from '@angular/router';
import { Config } from '../../shared/index';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

@Component({
  moduleId: module.id,
  selector: 'listUser',
  templateUrl: 'listUsers.component.html',
  styleUrls: ['listUsers.component.css']

  
})
export class ListUserComponent implements OnInit{ 

  public userList:any;
  public groupList:any;
  public pagedItems:any=[];
  public pager:any={};
  public showGroup:any=false;
  public userGroup:any;
  showDialog:any;
  showPermission:any;
  permissionList:any;
  groupObj:any;
  groupExists:any;
  public displayedColumns=['username',
                           'email',
                           'first_name',
                           'last_name',
                           'is_staff',
                           'is_superuser',
                           'is_active',
                           'groups'
                           ]
  public dataSource:any;

  constructor(public candexService: CandexService, 
              private route:ActivatedRoute,
              public router:Router){}


  ngOnInit() {
    this.getUserList();
    this.getGroupList();

  }

  public getUserList(){
    this.candexService.get(Config.SERVER+"/users/")
                      .subscribe(res=>{this.userList=res.json().results,
                                      this.dataSource=new UserDataSource(this.userList)
                                        },
                                 error=>console.log(error))

  }

  public getGroupList(){
    this.candexService.get(Config.SERVER+"/groups/")
                      .subscribe(res=>{this.groupList=res.json().results},
                                 error=>console.log(error))
  }

  editUser(user:any){
    let userID=user.id;
    this.router.navigate(['editUsers',userID])
    console.log(user)
  }

  showGroups(user:any){
    console.log(user)
    this.showDialog=true;
    if(this.showDialog==true)this.showGroup=true;
    else this.showGroup=false
    this.showPermission=!this.showGroup
    this.userGroup=user.groups
    if(user.groups.length!=0)this.groupExists=true
    else this.groupExists=false
  }

  showPermissions(group){
    this.showPermission=true;
    this.showGroup=!this.showPermission;

    for(let i in this.groupList){
      
      let value=_.property('name')(this.groupList[i])
      
      value=String(value)
      if(value==group){

        this.groupObj=this.groupList[i];
        
        break;
      }
    }
    this.permissionList=this.groupObj.permissions
    
  }

  goBack(){
    this.showDialog=true;
    if(this.showDialog==true)this.showGroup=true;
    else this.showGroup=false
    this.showPermission=!this.showGroup

  }


}

export class UserDataSource extends DataSource<any>{

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
            let searchStr=(item['username']+
                    item['first_name']+
                    item['last_name']+
                    item['email']
                        ).toString().toLowerCase()
            console.log(searchStr)
            return (searchStr.indexOf(this.filter.toLowerCase()) != -1);
          });
        });
    }

    disconnect(){}
}


 