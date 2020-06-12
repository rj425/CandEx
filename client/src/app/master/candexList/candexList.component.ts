import { Component,EventEmitter,Input,Output,OnInit,OnChanges,Pipe, PipeTransform,SimpleChange,Inject,ViewChild,ElementRef} from '@angular/core';
import { CandexService } from '../../shared/service/candex.service';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA,MatSnackBar} from '@angular/material';
import { Router,ActivatedRoute,Params} from '@angular/router'
import { KeysPipe } from './keyValue.pipe';
import { ValuePipe } from './value.pipe';
import { Config } from '../../shared/index';
import * as _ from 'underscore';
import { DataSource } from '@angular/cdk/collections';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/fromEvent';
import { Md2Toast } from 'md2/toast/toast';

@Component({
	moduleId:module.id,
	selector:'candexList',
	templateUrl:'candexList.component.html',
	styleUrls:['candexList.component.css']
})

export class CandexListComponent implements OnInit,OnChanges{
	public recievedData:any;
	public data:any;
	public selection:string;
	public master:any;
	public university:any;
	public courses:any;
	public form:FormGroup;
	public keyValueList:any=[]
	public sentForm:any={}
	public formLabels:any=[];
	public formControlList:any={}
	public value:any;
	public method:any;
	public id:any;
	public showValue:string="show"
	public actionName:string;
	public newRow:any=[];
	public displayedColumns=[]
	public dataSource:any
    @ViewChild('filter') filter:ElementRef=undefined
	@Input() public masterList:any=null;
	@Input() public keyList:any=null;
	@Input() public valueList:any=null;
	@Input() public showForm:string=null;
	@Input() public choice:any=null;
	@Output() public notifyMaster:EventEmitter<string> = new EventEmitter();

	constructor(public candexService:CandexService,public dialog: MatDialog,public toast:Md2Toast){}

	ngOnInit(){
	}

	ngOnChanges(changes:any){
		setTimeout(()=>{
			this.getFilter()
		},0)
		if(changes['keyList']!=undefined){
			let index=this.displayedColumns.indexOf('actions')
			if(index>-1){
				this.displayedColumns.splice(index,1)
			}
			this.displayedColumns=changes['keyList'].currentValue
			this.displayedColumns.push('actions')
		}
		if(changes['masterList']!=undefined){
			this.masterList=changes['masterList'].currentValue
    	    this.dataSource=new MasterDataSource(this.masterList)
		}
	}

    getFilter(){
        Observable.fromEvent(this.filter.nativeElement,'keyup')
                .distinctUntilChanged()
                .subscribe(()=>{
                    if (!this.dataSource) { return; }
                    this.dataSource.filter = this.filter.nativeElement.value;
                });
    }

	createForm(method:string,value){
		this.method=method;
		this.value=[]
		for(let key in value){
			this.value.push(value[key])
		}
		this.formControlList={}
		this.showForm=this.showValue
		
		if((this.choice)==='sources'){
				this.createFormGrp("sources","sourceID");
			}else if((this.choice)=='institutions'){
				this.createFormGrp("institutions","institutionID");
			}else if((this.choice)=='courses'){
				this.createFormGrp("courses","courseID");
			}else if((this.choice)=='department'){
				this.createFormGrp("department","departmentID");
			}else if((this.choice)=='designation'){
				this.createFormGrp("designation","designationID");
			}else if((this.choice)=='panelMembersDirectory'){
				this.createFormGrp("panelMembersDirectory","memberID");
			}else if((this.choice)=='skills'){
				this.createFormGrp("skills","skillID");
			}else if((this.choice)=='position'){
				this.createFormGrp("position","positionID");
			}else if((this.choice)=='engagementActions'){
				this.createFormGrp("engagementActions","actionID");
			}
	}

	createFormGrp(choice:string,autoField:string){
			
		if(this.method==='post'){
			this.actionName="Add"
			for(let i in this.keyList){
			if((this.keyList[i]!="createdDate") && (this.keyList[i]!="modifiedDate") && (this.keyList[i]!="actions") && (this.keyList[i]!=autoField)){
				if(this.keyList[i]=='status')
					this.formControlList[this.keyList[i]]=new FormControl('Active')
				else
					this.formControlList[this.keyList[i]]=new FormControl('',Validators.required)
			}
		}
		}
		if(this.method==='put'){
			this.actionName="Update"
			for(let i=0;i<this.keyList.length;i++){
					if((this.keyList[i]!="createdDate") && (this.keyList[i]!="modifiedDate") && (this.keyList[i]!="actions") && (this.keyList[i]!=autoField)){
						this.formControlList[this.keyList[i]]=new FormControl(this.value[i],Validators.required)
					}
				}
		}
		this.sentForm=new FormGroup(this.formControlList)
		this.openDialog()
		
	}

	openDialog(){

    let dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      
      data: {recievedForm:this.sentForm, 
			formControlList:this.formControlList, 
			selection:this.choice,
			method:this.method,
			value:this.value,
			actionName:this.actionName 
		}
    });

    dialogRef.afterClosed().subscribe((x) => {
    									this.notifyMaster.emit(this.choice);
    									});
	}
    
    handleFormSubmit(x:any){
    	let y=JSON.parse(x._body)
    	this.notifyMaster.emit(this.selection);
    }

}


@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl:'candexForm.html',
  styles:[`
  	/deep/ .mat-dialog-container{
  		border-radius: 5px;
	  	margin: auto;
	}
  `]
})
export class DialogOverviewExampleDialog {
	recievedFormGrp:FormGroup;
	formControl:any;
	recievedForm:any;
	formControlList:any;
	selection:any;
	method:any;
	value:any;
	actionName:any;
	selectionName:string

  constructor(public candexService:CandexService,
  			  public router:Router,
  			  public route:ActivatedRoute,
  			  public snackBar: MatSnackBar,
  			  public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
  			  public toast:Md2Toast,
  			  @Inject(MAT_DIALOG_DATA) public data: any) {
	  	this.recievedForm=this.data.recievedForm
	  	this.formControl=_.keys(this.data.formControlList)
		this.formControlList=this.data.formControlList
		this.selection=this.data.selection
		this.method=this.data.method
		this.value=this.data.value
		this.actionName=this.data.actionName 
  		this.selectionName=this.selection.charAt(0).toUpperCase()+this.selection.slice(1,this.selection.length)
  		if(this.selectionName.charAt(this.selectionName.length)=='s'){
  			this.selectionName=this.selectionName.slice(0,-1)
  		}
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(){
		if(this.method==='post'){
			this.candexService.post(Config.SERVER+'/'+this.selection+'/',this.recievedForm.value)
									  .subscribe(res=>{res.json().results,
									  					res.status==201?(this.recievedForm.reset(),this.toast.show("New "+this.selectionName+" Added!",2000)):null
									  					this.dialogRef.close()
									  				},
												error=>{console.log(error);this.snackBar.open("Something went wrong.Try again.",'',{duration:2000})});
		}
		if(this.method==='put'){
			this.candexService.put(Config.SERVER+'/'+this.selection+'/'+this.value[0]+'/',this.recievedForm.value)
							  .subscribe(res=>{res.json().results,
												res.status==200?(this.recievedForm.reset(),this.toast.show("Existing "+this.selectionName+" Updated!",2000)):null
							  					this.dialogRef.close()
							  				},
							  			error=>{console.log(error);this.snackBar.open("Something went wrong.Try again.",'',{duration:2000})});
		}
	}

}

export class MasterDataSource extends DataSource<any>{

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
          	let searchStr:string=""
          	for(let key in item){
          		if(item.hasOwnProperty(key)){
          			let subStr=""
          			if(item[key]=='' || item[key]==null){
          				subStr="empty"
          			}
          			else{
          				subStr=item[key]
          			}
          			searchStr=searchStr+subStr
          		}
          	}
          	searchStr=searchStr.toString().toLowerCase()
          	return searchStr.indexOf(this.filter.toLowerCase())!=-1;
          });
        });
    }

    disconnect(){}
}
