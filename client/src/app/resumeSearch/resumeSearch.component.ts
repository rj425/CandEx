import { Component, OnInit,ChangeDetectorRef,Inject,ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar,MatPaginator,MatTableModule,MatDialog, MatDialogRef, MAT_DIALOG_DATA,MatAutocompleteTrigger } from '@angular/material';
import { Config,CandexService } from '../shared/index';
import { DataSource,SelectionModel } from '@angular/cdk/collections';
import {Observable} from 'rxjs/Observable';
import { Http, Response} from '@angular/http';
import 'rxjs/add/observable/of';
import {startWith} from 'rxjs/operators/startWith';
import {map} from 'rxjs/operators/map';
import {FormControl} from '@angular/forms';
import * as _ from 'underscore';

@Component({
  selector: 'app-resumeSearch',
  templateUrl: './resumeSearch.component.html',
  styleUrls: ['./resumeSearch.component.css']
})
export class ResumeSearchComponent implements OnInit {
  
  public searchQuery:string="";
  public response:any=[];
  public keywords:any=[];
  public result:any=[];
  public displayedColumns=[
              'select',
  						'resumeID',
  						'emailID',
  						'mobileNo',
  						'resumeURL',
  						'wt',
              'createdDate'];
  public dataSource:any;
  public selection:any=[];
  public countAll:number=0;
  public searchResponse:any=[]
  public searchButton=false;
  public showTable=false;
  public selectedURL:any=[]
  public selectedKeyword=[]
  public value:any=[];
  public suggestions:any=[];
  public displayQuery:any="No Search Query Found";
  public downloadURL:any
  public showButton:any
  public resumeCount;
  public showIcon=false;
  public rowIndex=[];
  public searchResults:any=[];
  public disableIndex:boolean=false;
  filteredKeywords: Observable<string[]>;
  myControl: FormControl = new FormControl();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatAutocompleteTrigger) autocomplete: MatAutocompleteTrigger;
  
  constructor(private candexService:CandexService,
  	          private router:Router,
  	          private route:ActivatedRoute,
  	          public snackBar: MatSnackBar,public dialog: MatDialog,
              public cdRef:ChangeDetectorRef){

         this.selection=new SelectionModel(true,[]);
  }

  ngOnInit() {
        this.dataSource = new SearchDataSource(this.searchResponse,this.paginator);
        this.candexService.get(Config.SERVER+'/resumesCount')
                  .subscribe(res=>{this.resumeCount=res.json()['count']},
                  error=>{console.log(error)})
        this.candexService.get(Config.SERVER+'/searchResume/')
                  .subscribe(res=>{this.response=res.json(),this.suggestKeyword(this.response.result)},
                  error=>{console.log(error)})
        this.candexService.delete(Config.SERVER+'/resume/zip/')
                  .subscribe(res=>{this.response=res.json()}, 
                  error=>{console.log(error)})
        this.filteredKeywords = this.myControl.valueChanges.pipe(
                                                                startWith(''),
                                                                map(val => this.filter(val)));   
  }

  ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
  }

  onSearchQueryChange(){
    if(this.searchQuery && this.showTable==false){
      this.displayQuery="Press Enter to search!"
    }
    else if(!this.searchQuery && this.showTable==false){
      this .displayQuery="No Search Query Found"
    }
  }
 
  isAllSelected(){
        const numSelected=this.selection.selected.length;
        const numRows = this.countAll;
        return numSelected === numRows;
  }

  masterToggle() {
        this.isAllSelected() ?
           this.selection.clear():
           this.searchResponse.forEach(row => this.selection.select(row));
  }
  

  suggestKeyword(finalkeywords){
        for(var i=0;i<finalkeywords.length;i++){
          this.keywords.push(finalkeywords[i])
          this.suggestions.push(finalkeywords[i])
        }
  }

  indexResumes(){
    this.disableIndex=true;
    this.candexService.get(Config.SERVER+'/indexResumes')
             .subscribe(res=>{res.status===200?this.snackBar.open('Resumes Indexed Successfully!','',{duration:2000}):null},
               error=>{this.snackBar.open('Failed to Index Resumes,Wait for sometime!','',{duration:2000})})
    setTimeout(()=>{
       this.disableIndex=false;
    },1000*120)
  }
 
  filter(val: any): any[] {
        var stringArray=val.split(' ')
        val=stringArray[stringArray.length-1]
        if(val!== undefined && val!==null){
          val=val.toLowerCase();  
        } 
        this.value = ""
        for (var i=0;i<stringArray.length-1;i++){
          this.value=this.value.concat(stringArray[i]+" ")
        }
        for(let i=0;i<this.keywords.length;i++){     
          this.keywords[i] = this.value.concat(this.suggestions[i])
        }
          val=this.value.concat(val)
          return val?this.keywords.filter(keyword =>
          keyword.toLowerCase().indexOf(val) === 0):null;
  }

  public onSubmit(){
        this.showButton=false;
        this.showIcon=false;
        this.autocomplete.closePanel(); 
        let searchQ={
          'searchQuery' : this.searchQuery
        }
        this.candexService.post(Config.SERVER+'/searchResume/',searchQ)
                  .subscribe(res=>{this.response=res.json(),this.filePath(res.json()),this.searchSuccess(this.response.results),this.searchButton=true},
                  error=>{this.searchFail(error.status)})
        this.candexService.get(Config.SERVER+'/searchResume/')
                  .subscribe(res=>{this.response=res.json(),this.uniqueKeyword(this.response.result)},
                  error=>{console.log(error)})
        this.filteredKeywords = this.myControl.valueChanges.pipe(
                                                                startWith(''),
                                                                map(val => this.filter(val)));             
  }
  public filePath(result){
    this.searchResults=result.results
    for (var i = 0; i <result.results.length; i++) {
       this.searchResults[i].resumeURL='/media/'+this.searchResults[i].resumeURL
        }
  }

  public uniqueKeyword(filteredKeywords){
        this.keywords=[];
        this.suggestions=[];
        for(var i=0;i<filteredKeywords.length;i++){
            this.keywords.push(filteredKeywords[i])
            this.suggestions.push(filteredKeywords[i])
            
        }
  }

  public searchSuccess(searchfile:any[]){
        if(_.isEmpty(searchfile)){
          this.displayQuery="No Search Results"
          this.snackBar.open("No Search Results",'',{duration:4000})
          this.showTable=false;
        }
        else{
          this.countAll=0;
          this.showTable=true;
          for (var i = 0; i < searchfile.length; i++) {
            searchfile[i].resumeURL=Config.SERVER+'/media/'+searchfile[i].resumeURL
            this.countAll=this.countAll+1;
          }
          this.searchResponse=searchfile;
          this.dataSource = new SearchDataSource(this.searchResponse,this.paginator);
          this.selection=new SelectionModel(true,[]); 
        }
  }

  public searchFail(errorstatus){
        this.showTable=false;
        if(errorstatus===400){
          this.displayQuery="Invalid Search Query";
          this.snackBar.open("Invalid Search Query",'',{duration:2000})
        }
        if(errorstatus===500){
          this.displayQuery="Internal Server Error";
          this.snackBar.open("Internal Server Error",'',{duration:2000})
        }
  } 

  public onClickZipAll(){
        this.rowIndex=[];
        this.selectedURL=[];
        for(let i=0;i<this.selection.selected.length;i++){
          var row=_.findWhere(this.searchResults,{'resumeID':this.selection.selected[i].resumeID})
          this.rowIndex[i]=_.findIndex(this.searchResults,row);
        }
        this.rowIndex.sort(function(a,b){
          return a-b;
        })
        for(var i=0;i<this.selection.selected.length;i++){
          this.selectedURL[i]=(this.searchResults[this.rowIndex[i]].resumeURL)
        }
        let zip={
          'filePaths':this.selectedURL,
          'searchQuery' : this.searchQuery
        }
        this.candexService.post(Config.SERVER+'/resume/zip/',zip)
            .subscribe(res=>{this.response=res.json(),
                            this.response=(this.response).substring((this.response).length-50),
                            this.downloadURL=Config.SERVER+this.response,
                            this.snackBar.open("Zipping is done Successfully ",'',{duration:2000}),
                            this.showIcon=true,
                            this.showButton=true},
            error=>{console.log(error)})
  }
    
  public onClickDownload(){
        this.showIcon=false;
        this.showButton=false;
        this.selection=new SelectionModel(true,[])
  } 
  
  openDialog(): void {

        let dialogRef = this.dialog.open(ShowHelp,{
          width:'700px',
        
        })
  }
}

export class SearchDataSource extends DataSource<any> {

        renderedData=[];
        constructor(public result:any[],private _paginator? :MatPaginator){
        super();
        this._paginator.pageIndex=0;
        }
      /** Connect function called by the table to retrieve one stream containing the data to render. */
        connect(): Observable<any[]> {
          const displayDataChanges=[
            this.result,
            this._paginator.page
          ];
          return Observable.merge(...displayDataChanges).map(()=>{
            const data=this.result.slice();
            const startIndex=this._paginator.pageIndex*this._paginator.pageSize;
            this.renderedData=data.splice(startIndex,this._paginator.pageSize)
            return this.renderedData;});
        }
        disconnect(){}
}




@Component({
  templateUrl:'showHelp.dialog.html',
  styleUrls:['showHelp.dialog.css']
})
export class ShowHelp{
  constructor(public dialogRef: MatDialogRef<ShowHelp>) { }
 
  }


