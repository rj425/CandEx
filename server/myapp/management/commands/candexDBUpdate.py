from myapp.models import *
from myapp.serializers import *
from datetime import datetime,timedelta,date
from django.core.mail import send_mail
from myapp.views.emailViews import SendMail
from django.contrib.auth.models import User
from django.core.management.base import BaseCommand


class Command(BaseCommand):


	def handle(self,*args,**options):
		self.roundStatusUpdate()
		self.levelStatusUpdate()
		self.processStatusUpdate()


	'''ROUND STATUS UPDATE'''
	def roundStatusUpdate(self):
		try:
			# UPDATES ROUND STATUS FROM SCHEDULED TO STARTED
			today=datetime.now()
			currentDate=today.strftime('%Y-%m-%d')
			rounds=InterviewRound.objects.filter(interviewDate=currentDate)
			rounds=rounds.filter(levelID__levelDecision='Started')
			rounds=rounds.filter(roundDecision='Scheduled')
			for round in rounds:
				if today.time()>round.interviewStartTime:
					round.roundDecision='Started'
					round.save()
		except Exception as e:
			print (str(type(e).__name__)+' : '+str(e.args))


	'''LEVEL AND PROCESS STATUS UPDATE'''
	def levelStatusUpdate(self):
		try:
		 	today=datetime.now()
		 	# UPDATES LEVEL AND PROCESS STATUS FROM STARTED TO ONGOING
			levels=InterviewLevel.objects.filter(levelDecision="Started")
			for level in levels:
				process=CandidateProcess.objects.get(candidateID=level.candidateID.candidateID)
				rounds=InterviewRound.objects.filter(levelID=level.levelID)
				firstRoundOfLevel=rounds.order_by('interviewStartTime')[0]
				firstRoundDateTime=datetime.combine(firstRoundOfLevel.interviewDate,firstRoundOfLevel.interviewStartTime)
				if today>=firstRoundDateTime:
					level.levelDecision='Ongoing'
					level.save()
					if level.isFinal==False:
						process.processStatus=level.levelOfInterview+' Ongoing'
					else:
						process.processStatus='Final Level Ongoing'
					process.save()
			#UPDATES LEVEL AND PROCESS STATUS FROM ONGOING TO COMPLETE
			levels=InterviewLevel.objects.filter(levelDecision='Ongoing')
			for level in levels:
				process=CandidateProcess.objects.get(candidateID=level.candidateID.candidateID)
				rounds=InterviewRound.objects.filter(levelID=level.levelID)
				lastRoundOfLevel=rounds.order_by('interviewFinishTime').reverse()[0]
				lastRoundDateTime=datetime.combine(lastRoundOfLevel.interviewDate,lastRoundOfLevel.interviewFinishTime)
				if today>=lastRoundDateTime:
					level.levelDecision='Completed'
					level.save()
					if level.isFinal==False:
						process.processStatus=level.levelOfInterview+' Completed'
					else:
						process.processStatus='Final Level Completed'					
					process.save()				
		except Exception as e:
			print(str(type(e).__name__)+' : '+str(e.args))


	'''PROCESS STATUS UPDATE'''
	def processStatusUpdate(self):
		try:
			today=datetime.now()
			candidateProcesses=CandidateProcess.objects.all()
			for process in candidateProcesses:
				candidateID=process.candidateID.candidateID
				try:
					candidateOffer=CandidateOffer.objects.get(candidateID=candidateID)
					if candidateOffer.hiringDecisionDate!=None:
						process.processStatus='Hiring Date Set'
						process.save()	
					if candidateOffer.offerDate!=None:
						process.processStatus='Offer Date Set'
						process.save()
					if candidateOffer.joiningDate!=None:
						process.processStatus='Joining Date Set'
						process.save()
					if today.date()>=candidateOffer.joiningDate:
						process.processStatus='Candidate Joined'
						process.save()
				except Exception:
					pass
		except Exception as e:
			print(str(type(e).__name__)+' : '+str(e.args))

