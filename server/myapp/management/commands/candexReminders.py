from myapp.models import *
from myapp.serializers import *
from restapi import settings
from datetime import datetime,timedelta,date
from django.core.mail import send_mail
from myapp.views.emailViews import SendMail
from django.contrib.auth.models import User
from django.core.management.base import BaseCommand

class Command(BaseCommand):


	def handle(self,*args,**options):
		self.roundFeedbackReminder()
		self.sendOfferReminder()
		self.engagementReminder()


	'''ROUND FEEDBACK REMINDER'''
	def roundFeedbackReminder(self):
		try:
			currentDate=date.today()
			panellists=Panellist.objects.filter(status__in=['','Active'])
			for panellist in panellists:
				createdDate=panellist.createdDate.date()
				# Filtering not submitted feedacks 1 month back
				if (currentDate-createdDate).days <30:
					secretKey=panellist.secretKey
					roundID=panellist.roundID.roundID
					levelID=panellist.roundID.levelID.levelID
					candidateID=panellist.roundID.levelID.candidateID.candidateID
					feedbackURL=settings.CLIENT_HOST+'feedback/?candidateID='+str(candidateID)+'&levelID='+str(levelID)+'&roundID='+str(roundID)+'&panellistID='+str(panellist.panellistID)+'&secretKey='+secretKey
					candidate=CandidatePersonal.objects.get(candidateID=candidateID)
					candidateName=candidate.firstName+' '+candidate.lastName
					round=InterviewRound.objects.get(roundID=roundID)
					templateData={
						'candidateName':candidateName,
						'interviewDate':round.interviewDate,
						'panellistName':panellist.panellistName.memberName,
						'feedbackURL':feedbackURL
					}
					data={
						'templateName':'Interview Feedback Reminder',
						'templateData':templateData,
						'recipients':panellist.panellistName.memberEmail
					}
					sendMailInstance=SendMail()
					deliveredMails=sendMailInstance.sendMail(data)
					if(deliveredMails==1):
						print "Round feedback reminder succesfully sent!"
					elif(deliveredMails==0):
						print "No round feedback reminder mail was sent!"
				else:
					pass
		except Exception as e:
			print(str(type(e).__name__)+' : '+str(e.args))
			

	'''SEND OFFER REMINDER'''
	def sendOfferReminder(self):
		try:
			candidateOffers=CandidateOffer.objects.exclude(hiringDecisionDate=None)
			candidateOffers=candidateOffers.filter(offerDate=None)
			for offer in candidateOffers:
				candidateID=offer.candidateID.candidateID
				candidate=Candidate.objects.get(candidateID=candidateID)
				recipients=[]
				recipients.append(candidate.recruiter.email)
				candidate=candidate.personal
				candidateName=candidate.firstName+' '+candidate.lastName
				today=datetime.now().date()
				hiringDecisionDate=offer.hiringDecisionDate
				noOfPendingDays=(today-hiringDecisionDate).days
				templateData={ 
					'candidateName':candidateName,
					'noOfPendingDays':noOfPendingDays,
					'mobile':candidate.mobile,
					'email':candidate.email
				}
				data={
					'templateName':'Send Offer Reminder',
					'templateData':templateData,
					'recipients':recipients
				}
				sendMailInstance=SendMail()
				deliveredMails=sendMailInstance.sendMail(data)
				if(deliveredMails==1):
					print "Offer reminder succesfully sent!"
				elif(deliveredMails==0):
					print "No send offer reminder mail was sent!"
		except Exception as e:
			print(str(type(e).__name__)+' : '+str(e.args))



	'''CANDIDATE ENGAGEMENT REMINDERS'''
	def engagementReminder(self):
		try:
			today=date.today()
			engagements=CandidateEngagement.objects.all()
			engagements=engagements.filter(status=False)
			for engagement in engagements:
				candidate=CandidatePersonal.objects.get(candidateID=engagement.candidateID)
				candidateEmail=candidate.email
				if candidateEmail=='':
					candidateEmail=' - '
				candidateName=candidate.firstName+' '+candidate.lastName
				dueDate=engagement.dueDate
				startReminderDate=dueDate-timedelta(days=2)
				actionName=engagement.action.actionName
				currentDate=today
				if(currentDate>=startReminderDate and currentDate<dueDate):
					sendReminder=True
				elif(currentDate==dueDate):
					sendReminder=True
					engagement.status=True
					engagement.save()
				else:
					sendReminder=False
				if sendReminder==True:
					templateData={
						'candidateName':candidateName,
						'actionName':actionName,
						'dueDate':dueDate,
						'candidateEmail':candidateEmail
					}				
					data={
						'templateName':'Candidate Engagement Reminder',
						'templateData':templateData,
						'recipients':engagement.responsibilityHolder
					}
					sendMailInstance=SendMail()
					deliveredMails=sendMailInstance.sendMail(data)
					if(deliveredMails==1):
						print "Candidate engagement reminder succesfully sent!"
					elif(deliveredMails==0):
						print "No candidate engagement reminder mail was sent!"
		except Exception as e:
			print(str(type(e).__name__)+' : '+str(e.args))
