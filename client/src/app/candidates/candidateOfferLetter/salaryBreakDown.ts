
export class SalaryBreakDown
{
    x : number;
    y : number;

    salaryBreakdown : any;
    constructor(x : number,y :number)
    {
        this.x=x;
        this.y=y;
        let i1=this.basicSalary(x,y)
        let i2= this.hra(i1.annually)
        let i14=this.gratuity(i1.annually)
        let i15= this.employerContributiontoProvidentFund(i1.annually)
        let i6= this. medicalReimbursement(x,y,i1.annually,i2.annually,i14.annually,i15.annually)
        let i7= this.fuelAllowance(x,y,i1.annually,i2.annually,i6.annually,i14.annually,i15.annually)
        let i3= this.conveyanceAllowance(x,y,i1.annually,i2.annually,i7.annually,i14.annually,i15.annually)
        let i8= this.leaveTravelAllowance(x,y,i1.annually,i2.annually,i3.annually,i6.annually,i7.annually,i14.annually,i15.annually)
        let i9= this.mealAllowance(x,y,i1.annually,i2.annually,i3.annually,i6.annually,i7.annually,i8.annually,i14.annually,i15.annually)
        let i10= this.telephoneReimbursement(x,y,i1.annually,i2.annually,i3.annually,i6.annually,i7.annually,i8.annually,i9.annually,i14.annually,i15.annually)
        let i11= this.giftAllowance(x,y,i1.annually,i2.annually,i3.annually,i6.annually,i7.annually,i8.annually,i9.annually,i10.annually,i14.annually,i15.annually)
        let i12= this.academicAllowance(x,y,i1.annually,i2.annually,i3.annually,i6.annually,i7.annually,i8.annually,i9.annually,i10.annually,i11.annually,i14.annually,i15.annually)
        let i13= this.nps1(x,y,i1.annually,i2.annually,i3.annually,i6.annually,i7.annually,i8.annually,i9.annually,i10.annually,i11.annually,i12.annually,i14.annually,i15.annually)
        let i4= this.specialAllowance(x,y,i1.annually,i2.annually,i3.annually,i6.annually,i7.annually,i8.annually,i9.annually,i10.annually,i11.annually,i12.annually,i13.annually,i14.annually,i15.annually)
        let i5= this.flexiBasket()
        this.salaryBreakdown={
        'basicSalary': i1,
        'hra': i2,
        'conveyanceAllowance':i3,
        'specialAllowance':i4,
        'flexiBasket':i5,
        'medicalReimbursement':i6,
        'fuelAllowance':i7,
        'leaveTravelAllowance':i8,
        'mealAllowance':i9,
        'telephoneReimbursement':i10,
        'giftAllowance':i11,
        'academicAllowance':i12,
        'nps1':i13,
        'gratuity':i14,
        'employerContributiontoProvidentFund':i15,
    }
              

   
    }

    // calculating basicsalary :   
    basicSalary(x,y):any{
        var a1:any;
        a1=((x-y)*(40/100));
        return {
            "monthly":Math.round(a1/12),
            "annually":Math.round(a1)
                };
    }

    // calculating houserentallowance:
    hra(a1 :number):any{
        var a2:any;
        a2=a1*(50/100);
        return {
            "monthly":Math.round(a2/12),
            "annually":Math.round(a2)
                };
    }

    //calculating conveyanceallowance:
    conveyanceAllowance(x,y,a1 : any,a2 : any,a7 : any,a14 :any,a15 : any):any{
        var a3:any;
        a3=(a7>0?0:(x-(a14+a15+y)-(a1+a2)>19200 ? 19200 :a1-(a14+a15+y)-(a1+a2)));
        return {
            "monthly":Math.round(a3/12),
            "annually":Math.round(a3)
                };
    }
   
    //calculating specialallowance:
    specialAllowance(x,y,a1 : any,a2 : any,a3 : any,a6 : any,a7 : any,a8 : any,a9 : any,a10 : any,a11 : any,a12 : any,a13 : any,a14  : any,a15 : any):any{
        var a4:any;
        a4=x-(a14+a15+y)-(a1+a2+a3)-(a6+a7+a9+a10+a11+a12+a8+a13);
        return {
            "monthly":Math.round(a4/12),
            "annually":Math.round(a4)
                };
    }

    //calculating flexibasket:
    flexiBasket():any{
        var a5:any;
        a5=0;
        return {
            "monthly":0,
            "annually":0 
               };
    }

    //calculating medicalreimbursement:
    medicalReimbursement(x,y,a1 : any,a2 : any,a14 :any,a15 : any):any{
        var a6:any;
        a6=x-(a14+a15+y)-(a1+a2)>15000?15000:x-(a14+a15+y)-(a1+a2);
        return {
            "monthly":Math.round(a6/12),
            "annually":Math.round(a6)
                };
    }

    //calculating fuelallowance:
    fuelAllowance(x,y,a1 : any,a2 : any,a6 : any,a14 :any,a15 : any):any {
        var a7:any;
        a7=(a1*7.5/100)<=19200?0:(x-(a14+a15+y)-(a1+a2)-(a6)<19200)?(x-(a14+a15+y)-(a1+a2)-(a6)):((a1*7.5/100)>144000)?((x-(a14+a15+y)-(a1+a2)-(a6)>144000)?144000:(x-(a14+a15+y)-(a1+a2)-(a6))):((x-(a14+a15+y)-(a1+a2)-(a6)>(a1*7.5/100)?(a1*7.5/100):(x-(a14+a15+y)-(a1+a2)-(a6))));
        return {
            "monthly":Math.round(a7/12),
            "annually":Math.round(a7)
                 };
    }
 
    //calculating leavetravelallowance:
    leaveTravelAllowance(x,y,a1 : any,a2 : any,a3 : any,a6 : any,a7 : any,a14 : any,a15 : any):any{
        var a8:any;
        a8=x-(a14+a15+y)-(a1+a2+a3)-(a6+a7)>(8.33/100)*a1?(8.33/100)*a1 :x-(a14+a15+y)-(a1+a2+a3)-(a6+a7);
        return {
            "monthly":Math.round(a8/12),
            "annually":Math.round(a8)
                };
    }

    //calculating mealallowance:
    mealAllowance(x,y,a1 : any,a2 : any,a3 : any,a6 : any,a7 : any,a8 : any,a14 : any,a15 : any):any{
        var a9:any;
        a9=x-(a14+a15+y)-(a1+a2+a3)-(a6+a7+a8)>(2200*12)?(2200*12) : x-(a14+a15+y)-(a1+a2+a3)-(a6+a7+a8);
        return {
            "monthly":Math.round(a9/12),
            "annually":Math.round(a9)
                };
    }

    //calculating telephonereimbursement:
    telephoneReimbursement(x,y,a1 : any,a2 : any,a3 : any,a6 : any,a7 : any,a8 : any,a9 : any,a14 : any,a15 : any):any {
        var a10:any;
        a10=Math.round(x-(a14+a15+y)-(a1+a2+a3)-(a6+a7+a8+a9)>(3000*12)?(3000*12) : x-(a14+a15+y)-(a1+a2+a3)-(a6+a7+a8+a9));
        return {
            "monthly":Math.round(a10/12),
            "annually":Math.round(a10)
                };
    }   
        
    //calculating  giftallowance:
    giftAllowance(x,y,a1 : any,a2 : any,a3 : any,a6 : any,a7 : any,a8 : any,a9 : any,a10 : any,a14 : any,a15 : any):any{
        var a11:any;
        a11=x-(a14+a15+y)-(a1+a2+a3)-(a6+a7+a8+a9+a10)>4999?4999 : x-(a14+a15+y)-(a1+a2+a3)-(a6+a7+a8+a9+a10);
        return {
            "monthly":Math.round(a11/12),
            "annually":Math.round(a11)
                };
    }

    //calculating academicallowance:
    academicAllowance(x,y,a1 : any,a2 : any,a3 : any,a6 : any,a7 : any,a8 : any,a9 : any,a10 : any,a11 : any,a14 : any,a15 : any):any{
        var a12:any;
        a12=x-(a14+a15+y)-(a1+a2+a3)-(a6+a7+a8+a9+a10+a11)>50000?50000 : x-(a14+a15+y)-(a1+a2+a3)-(a6+a7+a8+a9+a10+a11);
        return {
            "monthly":Math.round(a12/12),
            "annually":Math.round(a12)
                };
    }

    //calculating nps:
    nps(a1:any):any{
        var a13:any;
        a13=a1/10;
        return {
            "monthly":Math.round(a13/12),
            "annually":Math.round(a13)
         };
    }

    //calculating nps:
    nps1(x,y,a1 : any,a2 : any,a3 : any,a6 : any,a7 : any,a8 : any,a9 : any,a10 : any,a11 : any,a12 : any,a14 : any,a15 : any):any{
        var a13:any;
        a13=(x-(a14+a15+y)-(a1+a2+a3)-(a6+a7+a8+a9+a10+a11+a12))>(10/100)*a1?(10/100)*a1:(x-(a14+a15+y)-(a1+a2+a3)-(a6+a7+a8+a9+a10+a11+a12));
        return {
            "monthly":Math.round(a13/12),
            "annually":Math.round(a13)
         };
    }
    
    //calculating gratuity:
    gratuity(a1 : any):any{
        var a14:any;
        a14=(a1/26)*(15/12);
        return {
            "monthly":Math.round(a14/12),
            "annually":Math.round(a14)
                };
    }

    //calculating employercontributiontoprovidentfund:
    employerContributiontoProvidentFund(a1:any):any{
        var a15:any;
        a15 = (a1*0.12);
        return {
            "monthly":Math.round(a15/12),
            "annually":Math.round(a15)
                };
    }

}        

