export class CompareDateTime{

	/*
		return value = -1 =>parameter sent to function is less than current date or time
		return value = 0 =>parameter sent to function is equal to current date or time
		return value = 1 => paramater sent to function is greater than current date or time
		return value = undefined => parameter sent to function is null 
	*/

	//Format yyyy-mm-dd
	static getCurrentDate():string{
		let today=new Date()
		let currentDate=today.getFullYear()+'-'
		currentDate=currentDate+('0'+(today.getMonth()+1)).slice(-2)+'-'
		currentDate=currentDate+('0'+today.getDate()).slice(-2)
		return currentDate
	}

	static getCurrentTime():string{
		let today=new Date()
		let currentTime=('0'+today.getHours()).slice(-2)+':'
		currentTime=currentTime+('0'+today.getMinutes()).slice(-2)
		return currentTime
	}

	static compareWithCurrentDate(date:string):number{
		if(date===null)
			return undefined
		let paramFulldate=new Date(date)
		let currentFullDate=new Date()
		paramFulldate.setHours(0,0,0,0)
		currentFullDate.setHours(0,0,0,0)
		let paramDate:number=paramFulldate.getTime()
		let currentDate:number=currentFullDate.getTime()
		if(currentDate>paramDate)
			return -1
		else if(currentDate===paramDate)
			return 0
		else
			return 1
	}

	static compareWithCurrentTime(time:string):number{
		if(time===null)
			return undefined
		let date=new Date()
		let currentTime=date.toLocaleTimeString('en-us',{hour12:false})
		if(currentTime>time)
			return -1
		else if(currentTime===time)
			return 0
		else
			return 1
	}

	static compareTwoTimes(time1:string,time2:string):number{
		if(time1===null || time2===null)
			return undefined
		if(time1>time2)
			return 1
		else if(time1===time2)
			return 0
		else
			return -1
	}

	static compareTwoDates(date1:string,date2:string):number{
		if(date1===null || date2===null)
			return undefined
		let paramFullDate1=new Date(date1)
		let paramFullDate2=new Date(date2)
		paramFullDate1.setHours(0,0,0,0)
		paramFullDate2.setHours(0,0,0,0)
		let paramDate1=paramFullDate1.getTime()
		let paramDate2=paramFullDate2.getTime()
		if(paramDate1>paramDate2)
			return 1
		else if(paramDate1===paramDate2)
			return 0
		else
			return -1
	}

	static compareWithCurrentDateTime(date:string,time:string):number{
		if(date===undefined || time===undefined)
			return undefined
		let currentDateTime=new Date()
		let paramDateTime=new Date(date)
		let paramTime=time.split(':')
		paramDateTime.setHours(+paramTime[0],+paramTime[1],+paramTime[2],0)	
		if(paramDateTime.getTime()>currentDateTime.getTime())
			return 1
		else if(paramDateTime.getTime()===currentDateTime.getTime())
			return 0
		else
			return -1
	}

	static compareTwoDateTime(date1:string,time1:string,date2:string,time2:string):number{
		if(date1===undefined || time1===undefined || date2===undefined || time2===undefined)
			return undefined
		let paramDateTime1=new Date(date1)
		let paramTime1=time1.split(':')
		paramDateTime1.setHours(+paramTime1[0],+paramTime1[1],+paramTime1[2],0)
		let paramDateTime2=new Date(date2)
		let paramTime2=time2.split(':')
		paramDateTime2.setHours(+paramTime2[0],+paramTime2[1],+paramTime2[2],0)
		if(paramDateTime1.getTime()>paramDateTime2.getTime())
			return 1
		else if(paramDateTime1.getTime()<paramDateTime2.getTime())
			return -1
		else
			return 0
	}
}