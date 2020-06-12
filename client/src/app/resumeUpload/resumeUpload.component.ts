import { Component, OnInit,ViewChild,ElementRef,Inject,ChangeDetectorRef} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA,MatPaginator,MatSnackBar,MatTableModule } from '@angular/material';
import { Config,CandexService,RouterService} from '../shared/index';
import { DataSource } from '@angular/cdk/collections';
import * as _ from 'underscore'; 
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Http, Response } from '@angular/http';
import { SelectionModel } from '@angular/cdk/collections';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
@Component({
  moduleId: module.id,
  selector: 'app-resumeUpload',
  templateUrl: './resumeUpload.component.html',
  styleUrls: ['./resumeUpload.component.css']

})

export class ResumeUploadComponent implements  OnInit{
    
  public resumeObj:FormData;
  public resume:any;
  public index:number;
  public errorMessage:string;
  public countPdf:number=0;
  public countDoc:number=0;
  public countAll:number=0;
  public count:number=0;
  public filesUploaded=[];
  public elementData :any =[];
  public countProgress:number=0;
  public displayedColumns=[
               'select',
               'serialNo',
               'fileName',
               'emailID',
               'mobileNo',
               'status',
               'modifiedDate']
  public dataSource:any=[];
  public selection:any=[];
  public serialNo:number;
  public resumeObjList=[];
  public showTable=false;
  public showProgress=false;
  public progressPercentage:any=0;
  public countSuccess:number=0;
  public countFailed:number=0;
  public countDuplicate:number=0;
  public routerLink=false;
  public countDocx=0;
  public response:any=[];
  public errorResponse:any=[];
  @ViewChild('filter') filter:ElementRef;
  @ViewChild(MatPaginator) paginator:MatPaginator;

  constructor(public router:Router,
              public cdRef:ChangeDetectorRef, 
              public route: ActivatedRoute,
              public dialog: MatDialog,
              public snackBar: MatSnackBar,
              public candexService:CandexService,
              public routerService:RouterService) {
      this.selection=new SelectionModel(true,[]);
  }

  ngOnInit() {
      this.getFilter()
      this.dataSource = new ResumeDataSource(this.filesUploaded,this.paginator);
  }

  ngAfterViewInit(){
      this.dataSource.paginator=this.paginator
  }

  ngAfterViewChecked(){
      this.cdRef.detectChanges();

  }

  getFilter(){
      Observable.fromEvent(this.filter.nativeElement,'keyup')
                .distinctUntilChanged()
                .subscribe(()=>{
                    if (!this.dataSource) { return; }
                    this.dataSource.filter = this.filter.nativeElement.value;
                });
  } 

  isAllSelected(){
    
      const numSelected=this.selection.selected.length;
      const numRows = this.countAll;
      return numSelected === numRows;
   
  }

  masterToggle() {

      this.isAllSelected() ?
          this.selection.clear():
          this.filesUploaded.forEach(row => this.selection.select(row));
  }

  public removeSelectedRows(){

      if(this.selection.selected.length===0){
              this.snackBar.open(" No rows selected. Unable to delete!",'',{duration:2000})
      }
      else{
      this.countAll=this.countAll-this.selection.selected.length;
      for(var i=0;i<this.selection.selected.length;i++){
                let index:number=_.findIndex(this.filesUploaded,this.selection.selected[i])
                this.filesUploaded.splice(index,1);
      }
      this.snackBar.open("Deleted Successfully!",'',{duration:2000})
      this.selection.selected.length=0;
      this.dataSource = new ResumeDataSource(this.filesUploaded,this.paginator);
      this.selection=new SelectionModel(true,[]); 
      this.calculateStatistics()
      }
  }
  public addResume(resumeObj:any){

      this.showProgress=false;
      if(resumeObj.length==0){
      }  
      else{
          if(resumeObj.length<=500){
            this.showTable=true;
            this.filesUploaded=[];
            this.countFailed=0;
            this.countDuplicate=0;
            this.countSuccess=0;
            this.countProgress=0;
            this.countDocx=0;
            this.progressPercentage=0;
            this.selection.selected.length=0;
            this.errorResponse=[];
            for(var i=0;i<resumeObj.length;i++) 
            { 
                if(resumeObj[i].type==='application/pdf' ||
                        resumeObj[i].type==='application/msword'|| resumeObj[i].type==='application/vnd.openxmlformats-officedocument.wordprocessingml.document'){
                        var fileRecord={};
                        fileRecord={"serialNo":i+1,"resumeID":null,"fileName":resumeObj[i].name,"emailID":"","mobileNo":null,"status":"Staged","modifiedDate":""};
                        this.filesUploaded.push(fileRecord);
                        this.resumeObjList[i]=resumeObj[i];
                }
                else{
                        this.snackBar.open('Only .pdf, .doc and .docx Formats are allowed!','',{duration:2000})
                        this.showTable=false;
                }
            }
          this.dataSource = new ResumeDataSource(this.filesUploaded,this.paginator);
          this.selection=new SelectionModel(true,[]); 
          this.calculateStatistics();
          }
          else{
              this.snackBar.open('Only 500 resumes are allowed to select.Please try again!','',{duration:3000})
              this.showTable=false;
          }
      }
  }
  public calculateStatistics(){

      this.countPdf=0;
      this.countDoc=0;
      this.countAll=0;
      this.countDocx=0;
      for(var i=0;i<this.filesUploaded.length;i++){
            this.countAll=this.countAll+1;
            let index=_.findIndex(this.resumeObjList,{'name':this.filesUploaded[i].fileName})
            if(this.resumeObjList[index].type==='application/pdf'){
                                          this.countPdf=this.countPdf+1;
            }
            if(this.resumeObjList[index].type==='application/msword'){
                          this.countDoc=this.countDoc+1;
            }
            if(this.resumeObjList[index].type==='application/vnd.openxmlformats-officedocument.wordprocessingml.document'){
                        this.countDocx=this.countDocx+1;
            }
      }
            if(this.countProgress===this.countAll){
               this.countProgress=0;
            }
  }

  public callIndex(){

      if(this.progressPercentage===100){
             this.candexService.get(Config.SERVER+'/indexResumes')
             .subscribe(res=>{res.status===200?this.snackBar.open('Uploaded resumes are Indexed Successfully!','',{duration:2000}):null},
               error=>{this.snackBar.open('Failed to Index Resumes, Wait for sometime!','',{duration:2000})})
             this.routerLink=false;
             this.routerService.setValue(this.routerLink);
         }
  }

  public goToUpdateResume(fileName){
      this.countDuplicate=this.countDuplicate-1;
      this.countSuccess=this.countSuccess+1;
      this.index=_.findIndex(this.filesUploaded,{'fileName':fileName});
      var resumeID=this.filesUploaded[this.index].resumeID;
      var rowIndex=_.findIndex(this.resumeObjList,{'name':fileName})
      this.resumeObj=new FormData();
      this.resumeObj.append('resume',this.resumeObjList[rowIndex],this.filesUploaded[this.index].fileName)
      this.candexService.putForFile(Config.SERVER+'/uploadResume/'+resumeID+'/',this.resumeObj)
        .subscribe(res=>{res.status===200?(this.snackBar.open("Updated Successfully!",'',{duration:2000}),this.goToUpdateDataSource(res.json().emailID,res.json().mobileNo,res.json().modifiedDate,this.index)):null},
          error=>{this.snackBar.open("Failed to Update the resume!",'',{duration:2000})})
  }

  public onSubmit(){

      this.showProgress=true;
      this.countFailed=0;
      this.countDuplicate=0;
      this.countSuccess=0;
      this.routerLink=true;
      this.routerService.setValue(this.routerLink);
      for(var j=0;j<this.countAll;j++){
              this.resumeObj=new FormData();
              this.resumeObj.append('resume',this.resumeObjList[j],this.filesUploaded[j].fileName)
              this.candexService.postForFile(Config.SERVER+'/uploadResume/',this.resumeObj)
               .subscribe(res=>{this.goToSuccessDataSource(res.json().emailID,res.json().mobileNo,res.json().fileName,res.status,res.json().resumeID,res.json().modifiedDate)},
                 error=>{this.goToFailDataSource(this.response=error.json(),error.json().fileName,error.status,error.json().emailID,error.json().mobileNo,error.json().resumeID,error.json().modifiedDate)}
      )} 

  }

  public goToSuccessDataSource(emailID,mobileNo,fileName,status,resumeID,modifiedDate){

      this.countProgress=this.countProgress+1;
      this.progressPercentage=Math.round((this.countProgress/this.filesUploaded.length)*100);
      this.countSuccess=this.countSuccess+1;
      if(status===201){
            this.resume=_.findWhere(this.filesUploaded,{"fileName":fileName})
            this.index=_.findIndex(this.filesUploaded,this.resume)
            if(emailID==null){
                emailID="-"
            }
            if(mobileNo==null){
                mobileNo="-"
            }
            this.filesUploaded[this.index].emailID=emailID;
            this.filesUploaded[this.index].mobileNo=mobileNo;
            this.filesUploaded[this.index].status="Uploaded";
            this.filesUploaded[this.index].resumeID=resumeID;
            this.filesUploaded[this.index].modifiedDate=modifiedDate;
      } 
      this.calculateStatistics();  
      this.callIndex();    
  }
 
  public goToFailDataSource(response,filename,errorstatus,emailID,mobileNo,resumeID,modifiedDate){
      this.countProgress=this.countProgress+1;
      this.progressPercentage=Math.round((this.countProgress/this.filesUploaded.length)*100);
      this.resume=_.findWhere(this.filesUploaded,{"fileName":filename})
      this.index=_.findIndex(this.filesUploaded,this.resume);
      if(errorstatus===409){
            if(emailID==null){
                emailID="-"
            }
            if(mobileNo==null){
                mobileNo="-"
            }
      this.countDuplicate=this.countDuplicate+1;
      this.filesUploaded[this.index].emailID=emailID;
      this.filesUploaded[this.index].mobileNo=mobileNo;
      this.filesUploaded[this.index].status="Duplicate";
      this.filesUploaded[this.index].resumeID=resumeID;
      this.filesUploaded[this.index].modifiedDate=modifiedDate;
      }
      else{
            this.errorResponse.push(response);
            this.countFailed=this.countFailed+1;
            this.filesUploaded[this.index].emailID="-";
            this.filesUploaded[this.index].mobileNo="-";
            this.filesUploaded[this.index].status="Failed";
      }
      this.calculateStatistics();  
      this.callIndex();
  }

  public goToUpdateDataSource(emailID,mobileNo,modifiedDate,index){

      if(emailID==null){
          emailID="-"
      }
      if(mobileNo==null){
          mobileNo="-"
      }
      this.filesUploaded[index].status="Updated";
      this.filesUploaded[index].emailID=emailID;
      this.filesUploaded[index].mobileNo=mobileNo;
      this.filesUploaded[index].modifiedDate=modifiedDate;

  }

  openDialog(): void {
      let dialogRef = this.dialog.open(ShowFileDetails, 
       {  
       
        data:
        {
          data1:
          [
            {
              label:"PDF",
              value:this.countPdf
            },
            {
              label:"DOC",
              value:this.countDoc
            },
            {
              label:"DOCX",
              value:this.countDocx

            }
          ],
          data2:
          [
            {
              label:"Upload",
              value:this.countSuccess
            },
            {
              label:"Duplicate",
              value:this.countDuplicate
            },
            {
              label:"Failed",
              value:this.countFailed
            }          
          ]
        }    
  });
  }

  openErrorDialog(): void {

      let dialogRef = this.dialog.open(ShowErrorDetails,{
          width:'700px',
          data: { errorResponse:this.errorResponse,
                  failed:this.countFailed
          }
      });


  }

}

export class ResumeDataSource extends DataSource<any> {
  _filterChange = new BehaviorSubject('');

    get filter(): string { return this._filterChange.value; }
    set filter(filter: string) { this._filterChange.next(filter); }
    filteredData=[];
    renderedData=[];
    constructor(public fileupload: any[],private _paginator? :MatPaginator){
    super();
    this._filterChange.subscribe(() => this._paginator.pageIndex=0);
}
  
  /** Connect function called by the table to retrieve one stream containing the data to render. */
   connect(): Observable<any[]> {
         const displayDataChanges = [
               this._filterChange,
               this._paginator.page
           ];
         return Observable.merge(...displayDataChanges).map(() => {
          this.filteredData= this.fileupload.slice().filter((item:any) => {
            let searchStr=(
                    item['serialNo']+
                    item['fileName']+
                    item['emailID']+
                    item['mobileNo']+
                    item['status']
                           ).toString().toLowerCase()
            return searchStr.indexOf(this.filter.toLowerCase()) != -1;
          });
           this._paginator.length=this.filteredData.length;
           const startIndex =this._paginator.pageIndex * this._paginator.pageSize;
           this.renderedData=this.filteredData.splice(startIndex,this._paginator.pageSize);
        return this.renderedData;
         
        });  
   }
  disconnect(){}
}

@Component({
  templateUrl:'showFileDetails.dialog.html',
  styleUrls:['showFileDetails.dialog.css']
})
export class ShowFileDetails {
  public options1;options2:any
  public data1:any
  public data2:any
  constructor(
    public dialogRef: MatDialogRef<ShowFileDetails>,
    
  @Inject(MAT_DIALOG_DATA) public data: any){
    if("data1" in data){
      this.data1=data['data1']
    }
    if("data2" in data){
      this.data2=data['data2']
    }
  }

  ngOnInit(){
    this.setChartConfig()

  }
  setChartConfig(){
    this.options1={
        chart:{
              type: 'pieChart',
              height: 200,
              x: function(d){return d.label;},
              y: function(d){return d.value;},
              showLabels:true,
              labelType:'value',
              color:['#3182bd','#aec7e8','#7f7f7f'],
              valueFormat: function(d){
              return d3.format(',.1d')(d);
          },
            duration: 500,
              labelThreshold: 0.01,
              labelSunbeamLayout: false,
       }

      }
       this.options2={
        chart:{
              type: 'pieChart',
              height: 200,
              x: function(d){return d.label;},
              y: function(d){return d.value;},
              showLabels:true,
              labelType:'value',
              color:['#54a911','#aec7e8','#e3451a'],
              valueFormat: function(d){
              return d3.format(',.1d')(d);
          },
            duration: 500,
              labelThreshold: 0.01,
              labelSunbeamLayout: false,
       }

      }   
  }

  onClick(): void {
    this.dialogRef.close();
  }

}

@Component({
    templateUrl:'showErrorDetails.dialog.html',
    styleUrls:['showErrorDetails.dialog.css']
})
export class ShowErrorDetails{
     public errorResponse:any=[];
     public failed:number;
    constructor(public dialogRef:MatDialogRef<ShowErrorDetails>,
     @Inject(MAT_DIALOG_DATA) public data:any)
    { 
        this.errorResponse=this.data['errorResponse'];
        this.failed=this.data['failed'];
    }

}

