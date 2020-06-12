import { Injectable} from '@angular/core';
import { Http, Response, Headers ,RequestOptions,URLSearchParams} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { CookieService } from 'angular2-cookie/core';
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/catch'

@Injectable()
export class CandexService {

  constructor(private http: Http,private cookieService:CookieService) {}

  createAuthorizationHeader(token?:string) 
  {
    let headers:Headers = new Headers({'Content-Type':'application/json'}); 
    if(token===undefined)
      headers.append('Authorization','Token '+this.cookieService.get('authToken')); 
    else
      headers.append('Authorization','Token '+token); 
    return headers
  }

  postForAuthToken(url:string,body:any):Observable<Response>
  {
    let headers:Headers=new Headers({'Content-Type':'application/json'});
    let options=new RequestOptions({headers:headers});
    return this.http.post(url,body,options)
                    .map((res:Response)=>res)
                    .catch(this.handleError)
  }

  get(url:string,searchParams?:URLSearchParams,headers?:Headers): Observable<Response> 
  {
    let options:RequestOptions=null
    if(headers===undefined)
      options=new RequestOptions({headers:this.createAuthorizationHeader(),search:searchParams});
    else
      options=new RequestOptions({headers:headers,search:searchParams})
    return this.http.get(url,options)
                    .map((res: Response) => res)
                    .catch(this.handleError);
  }

  post(url:string,body:any,headers?:Headers,searchParams?:URLSearchParams):Observable<Response>
  {
    let options:RequestOptions=null
    if(headers===undefined)
      options=new RequestOptions({headers:this.createAuthorizationHeader(),search:searchParams});
    else
      options=new RequestOptions({headers:headers})
    return this.http.post(url,body,options)
                    .map((res:Response) => res)
                    .catch(this.handleFileError)
  }

  put(url:string,body:any,headers?:Headers):Observable<Response>
  {
    let options:RequestOptions=null
    if(headers===undefined)
      options=new RequestOptions({headers:this.createAuthorizationHeader()});
    else
      options=new RequestOptions({headers:headers})    
    return this.http.put(url,body,options)
                    .map((res:Response) => res)
                    .catch(this.handleError)
  }

  delete(url:string){
    let options:RequestOptions=new RequestOptions({headers:this.createAuthorizationHeader()})
    return this.http.delete(url,options)
                    .map((res:Response)=>res)
                    .catch(this.handleError)
  }

  postForFile(url:string,body:any):Observable<Response>{
    let headers:Headers=new Headers()
    headers.append('Authorization','Token '+this.cookieService.get('authToken'))
    let options:RequestOptions=new RequestOptions({headers:headers})
    return this.http.post(url,body,options)
                    .map((res:Response)=>res)
                    .catch(this.handleFileError)
  }

  putForFile(url:string,body:any):Observable<Response>{
    let headers:Headers=new Headers()
    headers.append('Authorization','Token '+this.cookieService.get('authToken'))
    let options:RequestOptions=new RequestOptions({headers:headers})
    return this.http.put(url,body,options)
                    .map((res:Response)=>res)
                    .catch(this.handleError)
  }

  private handleFileError(error:any){
    return Observable.throw(error);
  }


  private handleError (error: any) {
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg);
    return Observable.throw(errMsg);
  }

}

