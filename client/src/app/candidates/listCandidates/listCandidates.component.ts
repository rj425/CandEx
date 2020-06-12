import { Component, ElementRef, ViewChild, OnInit, Inject } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/fromEvent';
import { CandexService,Config,ComposeMailComponent } from '../../shared/index';
import { ActivatedRoute,Router } from '@angular/router';
import { FormGroup, FormControl, FormArray, Validators} from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Http, Response, Headers, URLSearchParams } from '@angular/http';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
    moduleId: module.id,
    selector: 'cand',
    templateUrl: 'listCandidates.component.html',
    styleUrls: ['listCandidates.component.css']
})
export class ListCandidateComponent implements OnInit{

    candidateList:any
    errorMessage:string
    @ViewChild('filter') filter:ElementRef;
    displayedColumns=['candidateID',
                      'requestID',
                      'candidateName',
                      'mobile',
                      'processStartDate',
                      'processStatus',
                      'actions'
                       ];
    dataSource:any
    public searchParams:string;
    interviewID:number;
    showDialog:any=false;
    showMail:any=false;
    offerForm:FormGroup;
    currCandidate:any;
    public lastRoundName:string;
    costForm:any
    candidateID:any;
    enableSubmitButton:any=true;
    hideEditButton:any;
    secretKey=''
    feedbackObject:any
    feedbackData:any;
    duplicate:any=false;
    public jsonResponse:any=null
    showCostSubmitButton:any=false;
    candidateCostMethod:any='POST';
    showComposeMail:boolean=false
    public emailRecipient:any;
    showFeedbackModal:any=false;
    currentFeedbackObject:any;
    private dropReason:string
    private processID:number

    constructor(public candexService: CandexService,                
                private route:ActivatedRoute,
                public router:Router,
                public snackBar: MatSnackBar,
                public dialog:MatDialog){}

    ngOnInit(){
        this.getFilter()
        let urlSearchParams:URLSearchParams=new URLSearchParams();
        this.route.params.map(params=>params['requestID'])
                        .subscribe((requestID)=>{this.searchParams=requestID,
                                                 urlSearchParams.set('reqID',this.searchParams)
                                                 });
        this.getCandidateList(urlSearchParams);
        this.offerForm=new FormGroup({
            hiringDecisionDate:new FormControl('',Validators.required),
            joiningDate:new FormControl('',Validators.required),
            offerDate:new FormControl('',Validators.required),
            offerStatus:new FormControl('',Validators.required)
        })
        this.costForm=new FormGroup({
            relocationCost:new FormControl('',Validators.required),
            settlingCost:new FormControl('',Validators.required),
            joiningBonus:new FormControl('',Validators.required),
            agencyCost:new FormControl('',Validators.required),
            salary:new FormControl('',Validators.required),
            referralCost:new FormControl('',Validators.required)
        })
    }

    getFilter(){
        Observable.fromEvent(this.filter.nativeElement,'keyup')
                .distinctUntilChanged()
                .subscribe(()=>{
                    if (!this.dataSource) { return; }
                    this.dataSource.filter = this.filter.nativeElement.value;
                });
    }

    getCandidateList(urlSearchParams:URLSearchParams){
        this.candexService.get(Config.SERVER+'/candidates/',urlSearchParams)
                      .subscribe( res =>{
                                          this.candidateList=res.json().results,
                                          this.dataSource=new CandidateDataSource(this.candidateList)
                                        },
                                        error => this.errorMessage = <any>error,
                                );
    }

    editCandidate(candidateID:number){
        this.router.navigate(['editCandidate',candidateID])
    }

    startProcess(processID:number,candidateID:number,requestID:any){
        let candidateProcessData={
          "processStart": new Date(),
          "processStatus":"Started"
        }
        if(requestID!=null){
            this.candexService.put(Config.SERVER+'/candidateProcess/'+processID+'/',candidateProcessData)
                               .subscribe(res=>{this.jsonResponse=res.json(),
                                               this.getCandidateList(null),
                                               res.status==200?this.snackBar.open("Process has started.",'',{duration:3000}):null},
                                          error=>{console.log(error),this.snackBar.open("Process Start Failed!",'',{duration:3000})});
        }else{
            this.snackBar.open("Process cannot be started for unmapped candidate",'',{duration:3000})
        }
    }

    scheduleInterview(candidateID:number){
        this.router.navigate(['scheduleInterview',candidateID])
    }


    askForFeedback(candidate:any){
        this.currCandidate=candidate
        this.candidateID=candidate.candidateID
        this.currentFeedbackObject=undefined;
        this.getFeedbackData()
        
    }

    getFeedbackData(){
        this.candexService.get(Config.SERVER+'/candidateFeedback/')
                            .subscribe(res=>{this.feedbackData=res.json().results,
                                console.log('feedback data:',this.feedbackData),
                                this.checkDuplicate()},
                                        error=>{console.log(error)})

    }

    checkDuplicate(){
        //Checks if feedback object already exists
        this.duplicate=false
        for (let feedbackObj of this.feedbackData){
                    if(feedbackObj.candidateID==this.candidateID){
                       this.duplicate=true;
                       let submitted=this.checkFeedbackStatus(feedbackObj)
                       if(!submitted)
                       this.snackBar.open("Request for feedback has been sent already to the candidate",'',{duration:3000})                       
                    }
        }
        this.createFeedbackObject()
    }

    checkFeedbackStatus(feedbackObj:any){
        if(feedbackObj.status=="Submitted"){
           this.currentFeedbackObject=feedbackObj;
           this.showFeedbackDialog()
           return true;
        }
        return false;

    }

    createFeedbackObject(){
        if(this.duplicate!=true){
        let data={"candidateID":this.candidateID,
                  "status":"Active"}
        this.candexService.post(Config.SERVER+'/candidateFeedback/',data)
                            .subscribe(res=>{data=res.json(),
                                        console.log(res.json()),
                                        this.getSecretKey(data['id']),
                                        res.status===201?this.snackBar.open("Feedback Object Creation Successful!",'',{duration:3000}):''},
                                        error=>{console.log(error),this.snackBar.open("Feedback Object Creation Failed!",'',{duration:3000})})
        }
    }

    sendFeedbackMail(){
        this.secretKey=this.feedbackObject.secretKey;
        let feedbackURL=Config.CLIENT+'candidateFeedback/?candidateID='+this.candidateID+'&feedbackID='+this.feedbackObject.id+'&secretKey='+this.secretKey;
        console.log(feedbackURL)
        let emailParams:any={};
        let recipients:any=[]    
        if(this.currCandidate.personal.email==undefined)
            this.snackBar.open("Email address of the candidate not set.",'',{duration:3000})
        recipients.push(this.currCandidate.personal.email)
        emailParams['templateName']='Candidate Feedback'
        emailParams['templateData']={}
        emailParams['templateData']['candidateName']=this.currCandidate.personal.firstName+' '+this.currCandidate.personal.lastName
        emailParams['templateData']['candidateFeedbackURL']=feedbackURL
        this.candexService.post(Config.SERVER+'/sendmail/',emailParams)
                            .subscribe(res=>{
                                        res.status===200?this.snackBar.open("Email Sent Successfully!",'',{duration:3000}):null},
                                        error=>{console.log(error),this.snackBar.open("Email Sending Failed!",'',{duration:3000})})
    
    }

    goToCandidateEngagement(candidateID:any){
        this.router.navigate(['candidateEngagement',candidateID])
    }

    goToEmployeeDetails(candidateID:any){
        this.router.navigate(['employeeDetails',candidateID])
    }

    getSecretKey(feedbackID:any){
        this.candexService.get(Config.SERVER+'/candidateFeedback/'+feedbackID+'/')
                            .subscribe(res=>{this.feedbackObject=res.json(),
                                            this.sendFeedbackMail()},
                                        error=>{console.log(error)})

    }
    
    showEmail(candidate:any){
      this.emailRecipient=candidate.personal.email
      let dialogRef=this.dialog.open(ComposeMailComponent,{
            width:'70%',
            height:'500px',
            data:{candidateID:candidate.candidateID,
                 emailRecipient:this.emailRecipient}
        })
    }

    showDropCandidateDialog(requestID,candidateID:number,candidateName:string,processID:number){
        let dialogRef=this.dialog.open(DropCandidateDialog,{
            width:'350px',
            data:{
                candidateName:candidateName
            }
        })
        dialogRef.afterClosed().subscribe(dropReason=>{
            if(dropReason!=='null' && dropReason!==undefined){
                let data={'status':'Dropped','dropReason':dropReason,'requestID':requestID}
                this.candexService.put(Config.SERVER+'/candidates/'+candidateID+'/',data)
                                  .subscribe(res=>{res.status==200?this.updateProcessStatus(processID):null},
                                            error=>console.log(error))
            }
        })
    }

    showFeedbackDialog(){
        let dialogRef=this.dialog.open(FeedbackDialog,{
            width:'50%',
            data:{
                currentFeedbackObject:this.currentFeedbackObject,
                candidateName:this.currCandidate.personal.firstName+' '+this.currCandidate.personal.lastName
            }
        })

    }


    updateProcessStatus(processID:number){
        let data={'processStatus':'Candidate Dropped'}
        this.candexService.put(Config.SERVER+'/candidateProcess/'+processID+'/',data)
                          .subscribe(res=>{res.status==200?(this.getCandidateList(null),
                                                            this.snackBar.open('This Candidate has been Dropped!','',{duration:3000})):null},
                                     error=>console.log(error))
    }

}


export class CandidateDataSource extends DataSource<any>{

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
            let searchStr=('CAND-'+item['candidateID']+
                           (item['requestID']!==null?('REQ-'+item['requestID']):'empty')+
                           (item['personal']['firstName']!==''?item['personal']['firstName']:'empty')+
                           (item['personal']['lastName']!==''?item['personal']['lastName']:'blank')+
                           item['process']['processStatus']+
                           (item['process']['processStart']!==null?item['process']['processStart']:'empty')
                           ).toString().toLowerCase()
            return searchStr.indexOf(this.filter.toLowerCase()) != -1;
          });
        });
    }

    disconnect(){}
}

@Component({
    templateUrl:'dropCandidate.dialog.html',
    styleUrls:['dropCandidate.dialog.css']
})
export class DropCandidateDialog{

    candidateName:string
    dropReason

    constructor(public dialogRef:MatDialogRef<DropCandidateDialog>,@Inject(MAT_DIALOG_DATA) public data:any)
    {
        this.candidateName=this.data['candidateName']
    }

}

@Component({
    templateUrl:'showFeedback.dialog.html',
    styleUrls:['showFeedback.dialog.css']
})
export class FeedbackDialog{

    currentFeedbackObject:any
    candidateName:any

    constructor(public dialogRef:MatDialogRef<FeedbackDialog>,@Inject(MAT_DIALOG_DATA) public data:any)
    {
        this.currentFeedbackObject=this.data['currentFeedbackObject']
        this.candidateName=this.data['candidateName']
    }

}



