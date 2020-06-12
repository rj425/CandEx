import { Component,OnInit,ViewContainerRef } from '@angular/core';
import { CandexService } from '../shared/service/candex.service';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { Router,ActivatedRoute,Params} from '@angular/router'
import { Config } from '../shared/index';
import * as _ from 'underscore';
import { MatSnackBar } from '@angular/material';

@Component({
  moduleId: module.id,
  selector: 'users',
  templateUrl: 'users.component.html',
  styleUrls: ['users.component.css']
  
})
export class UserComponent implements OnInit{

	userForm:FormGroup;
	jsonResponse:any;
	password:string;
	randomNumber:number;
	emailParams:any={};
	groups:any;
	public id:number;
  	public title:string;
  	userData:any;
  	allUserObjects:any
  	userExists:any=false;


	constructor(public candexService:CandexService,
				private router:Router,
				private route:ActivatedRoute,
				public snackBar: MatSnackBar){}


	ngOnInit(){
		this.getGroups();
		this.getUsers();
		this.route.params.map(params=>params['userID'])
              			.subscribe(userID => {this.id =userID,console.log("userID",userID)});
        console.log(this.id)	

	    if(this.id!=null){
	    	this.title="Change User Privleges"
	      this.getUserInformation();
	      this.createForm()
	      this.disableFields()
	      
	    }else{
	      this.title="Add User"
	      this.createForm()
	    }
	    this.userExists=false;
	    
	}

	public createForm(){
		this.userForm=new FormGroup({
		  username:new FormControl(this.userData?this.userData.username:'',[Validators.required,
		  																	Validators.maxLength(24)]),
		  password:new FormControl(this.userData?this.userData.password:'',Validators.required),
		  first_name:new FormControl(this.userData?this.userData.first_name:'',[Validators.required,
		  																		Validators.maxLength(30)]),
		  last_name:new FormControl(this.userData?this.userData.last_name:'',[Validators.required,
		  																	Validators.maxLength(30)]),
		  email:new FormControl(this.userData?this.userData.email:'',[Validators.required,
		  															Validators.pattern("[^ @]*@[^ @]*")]),
		  is_active:new FormControl(this.userData?this.userData.is_active:'true'),
		  is_staff:new FormControl(this.userData?this.userData.is_staff:''),
		  is_superuser:new FormControl(this.userData?this.userData.is_superuser:''),
		  groups:new FormControl(this.userData?this.userData.groups:'')
    })
	}

	public disableFields(){
		this.userForm.controls['username'].disable()
		
	}

	public getUserInformation(){
		
		this.candexService.get(Config.SERVER+'/users/'+this.id+'/')
                      .subscribe(res=>{this.userData=res.json(),console.log("user data=\n",this.userData),this.createForm()},
                                 error=>console.log(error))

	}
	public getGroups(){
		this.candexService.get(Config.SERVER+'/groups/')
							.subscribe(res=>{this.groups=res.json().results,console.log(this.groups)},
								error=>{console.log(error)}
								)

	}

	public getUsers(){
		this.candexService.get(Config.SERVER+'/users/')
			.subscribe(res=>{this.allUserObjects=res.json().results},
				error=>{console.log(error)})
	}

	public checkIfUserExists(){
	
		for (let i in this.allUserObjects){
			let user=this.allUserObjects[i]
			console.log(this.allUserObjects[i])
			if (user.username==this.userForm.value['username']){
				this.userExists=true;
				this.snackBar.open("Username already exists!",'',{duration:2000})				
				console.log(user)
				break;
			}
		}
		

	}

	public generatePassword(){
		this.randomNumber = Math.floor(Math.random() * 1000000);
		if(this.userForm.value.username=='')
			this.password="password"+String(this.randomNumber)
		else 
			this.password=this.userForm.value.username+String(this.randomNumber)
		let passwordControl=this.userForm.controls['password']
		passwordControl.setValue(this.password)
	}

	onSubmit(){
		if(this.id==undefined){
			if(this.userForm.value.is_active==='')this.userForm.value.is_active="false"
			if(this.userForm.value.is_staff==='')this.userForm.value.is_staff="false"
			if(this.userForm.value.is_superuser==='')this.userForm.value.is_superuser="false"
			this.checkIfUserExists()
			this.candexService.post(Config.SERVER+'/users/',this.userForm.value)
								.subscribe(res=>{this.jsonResponse=res.json(),
									this.gotToUserList(res.status),
									console.log(this.jsonResponse)
								},
									error=>{console.log(error)}
									)
		}else{
			this.candexService.put(Config.SERVER+'/users/'+this.id+'/',this.userForm.value)
								.subscribe(res=>{this.jsonResponse=res.json(),
									console.log(this.jsonResponse),
									this.gotToUserList(res.status)},
									error=>{console.log(error)}
									)
		}
		
	}

	public gotToUserList(statusCode:number){
		if(statusCode===201 || statusCode===200){
			this.router.navigate(['listUsers'])
			statusCode==201?this.snackBar.open("User Created Successfully!",'',{duration:2000}):this.snackBar.open("User Updated Successfully!",'',{duration:2000})
			this.id==undefined?this.sendMail():''
			this.userForm.reset();
		}
	}



	
		
	public sendMail(){
		let recipients:any=[];
		this.emailParams['name']="newUser"
		this.emailParams['emailSubject']="Welcome to CandEx!"
		this.emailParams['username']=this.userForm.value.username
		this.emailParams['password']=this.userForm.value.password
		this.emailParams['first_name']=this.userForm.value.first_name
		this.emailParams['last_name']=this.userForm.value.last_name
		this.emailParams['email']=this.userForm.value.email
		this.emailParams['emailBody']=`<p style="font-family: 'sans-serif';
    								font-size: 13px;>Hello! You were added as an user in CandEx.</p>
								<p style="font-family: 'sans-serif';
    								font-size: 13px;">Kindly find the details of your account below
								It is advised that you change your password once you login.</p>
								
								<table border="0px" style="border-collapse:collapse;" style="font-family: 'sans-serif';
    								font-size: 13px; font-weight: 600;padding: 3px 5px;">
							    	<tr style="padding"><td>Username</td> <td>{{username}}</td></tr>
							    	<tr><td>Password</td> <td>{{password}}</td></tr>
        						</table>`


		
		this.candexService.post(Config.SERVER+'/sendmail/',this.emailParams)
							.subscribe(res=>{res.json().results,
										res.status===200?this.snackBar.open("Email Sent Successfully!",'',{duration:2000}):''},
										error=>{console.log(error),this.snackBar.open("Email Sending Failed!",'',{duration:2000})})
		
		
	}

	public validationMessages = {
    'username': {
    	'required':'Username is required.',
      	'maxlength':'Username should be less than 150 characters.',
      	'duplicateUsername':'Such a username already exists. Please choose another'
    },
    'password': {
      	'required':'Password is required.',
      	'maxlength':'Password should be less than 128 characters.',
    },
    'email':{
    	'required':'Email is a mandatory field',
      	'pattern':'Email must contain \'@\' character'
    }
  };

	


}
