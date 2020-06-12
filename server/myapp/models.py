from __future__ import unicode_literals
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token
from django.conf import settings
from django.core.mail import send_mail
from django.contrib.auth.models import User


# This code is triggered whenever a new user has been created and saved to the database
@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)

class EngagementActions(models.Model):
	actionID=models.AutoField(primary_key=True)
	actionName=models.TextField(blank=True)
	createdDate=models.DateTimeField(auto_now_add=True)
	modifiedDate=models.DateTimeField(auto_now=True)	

	def __str__(self):
		return "ACTION "+str(self.actionID)+' - '+str(self.actionName)


class Position(models.Model):
	positionID=models.AutoField(primary_key=True)
	position=models.CharField(max_length=200,unique=True)
	status=models.CharField(max_length=100,default="Active");
	createdDate=models.DateTimeField(auto_now_add=True)
	modifiedDate=models.DateTimeField(auto_now=True)
	
	def __str__(self):
		return str(self.position)


class Department(models.Model):
	departmentID=models.AutoField(primary_key=True)
	departmentName=models.CharField(max_length=200,default=None,unique=True)
	departmentManager=models.CharField(max_length=200,default=None)
	departmentManagerEmail=models.EmailField(max_length=200,default=None)
	status=models.CharField(max_length=100,default="Active");
	createdDate=models.DateTimeField(auto_now_add=True)
	modifiedDate=models.DateTimeField(auto_now=True)

	def __str__(self):
		return str(self.departmentName)

class Designation(models.Model):
	designationID=models.AutoField(primary_key=True)
	designation=models.CharField(max_length=100,default=None,unique=True)
	status=models.CharField(max_length=100,default="Active");
	createdDate=models.DateTimeField(auto_now_add=True)
	modifiedDate=models.DateTimeField(auto_now=True)

	def __str__(self):
		return str(self.designation)

class Skills(models.Model):
	skillID=models.AutoField(primary_key=True)
	skill=models.CharField(max_length=200,unique=True,null=True)
	status=models.CharField(max_length=100,default="Active");
	createdDate=models.DateTimeField(auto_now_add=True)
	modifiedDate=models.DateTimeField(auto_now=True)	

	def __str__(self):
		return str(self.skill)

class Request(models.Model):
	requestID=models.AutoField(primary_key=True)
	requestStatus=models.CharField(max_length=100,default=None)
	skills=models.CharField(max_length=255,blank=True,null=True)
	experienceYears=models.IntegerField(default=None,null=True,blank=True)
	experienceMonths=models.IntegerField(default=None,null=True,blank=True)
	position=models.ForeignKey(Position,on_delete=models.PROTECT,to_field="position",null=True,blank=True)
	designation=models.ForeignKey(Designation,on_delete=models.PROTECT,to_field="designation",blank=True,null=True)
	department=models.ForeignKey(Department,on_delete=models.PROTECT,to_field="departmentName",blank=True,null=True)
	recruiter=models.ForeignKey(User,on_delete=models.PROTECT,to_field="username",blank=True,null=True)
	createdDate=models.DateTimeField(auto_now_add=True)
	modifiedDate=models.DateTimeField(auto_now=True)

	def __str__(self):
		return "REQ "+str(self.requestID)


class Source(models.Model):
	sourceID=models.AutoField(primary_key=True)
	source=models.CharField(max_length=200,unique=True)
	status=models.CharField(max_length=100,default="Active");
	createdDate=models.DateTimeField(auto_now_add=True)
	modifiedDate=models.DateTimeField(auto_now=True)

	def __str__(self):
		return str(self.source)


class Candidate(models.Model):
	candidateID=models.AutoField(primary_key=True)	
	requestID=models.ForeignKey(Request,on_delete=models.PROTECT,blank=True,null=True)
	status=models.CharField(max_length=100,blank=True,default="Active")
	dropReason=models.CharField(max_length=255,blank=True,null=True,default='')
	recruiter=models.ForeignKey(User,on_delete=models.PROTECT,to_field="username",blank=True,default="")
	createdDate=models.DateTimeField(auto_now_add=True)
	modifiedDate=models.DateTimeField(auto_now=True)

	def __str__(self):
		return str(self.requestID)+" , CAND "+str(self.candidateID)

class CandidateFeedback(models.Model):
	candidateID=models.OneToOneField(Candidate,unique=True,on_delete=models.PROTECT,related_name="feedback",blank=True)
	feedback=models.TextField(max_length=500,null=True)
	secretKey=models.CharField(max_length=100,blank=True)
	status=models.CharField(max_length=50,blank=True)

	def __str__(self):
		return "CAND "+str(self.candidateID)

class CandidateCost(models.Model):
	candidateID=models.OneToOneField(Candidate,unique=True,on_delete=models.PROTECT,related_name="candidateCost",blank=True)
	relocationCost=models.BigIntegerField(blank=True,null=True)
	settlingCost=models.BigIntegerField(blank=True,null=True)
	joiningBonus=models.BigIntegerField(blank=True,null=True)
	agencyCost=models.BigIntegerField(blank=True,null=True)
	referralCost=models.BigIntegerField(blank=True,null=True)
	salary=models.BigIntegerField(blank=True,null=True)	

	def __str__(self):
		return "CAND "+str(self.candidateID)


class CandidatePersonal(models.Model):
	personalID=models.AutoField(primary_key=True)
	candidateID=models.OneToOneField(Candidate,unique=True,on_delete=models.PROTECT,related_name="personal",blank=True)
	firstName=models.CharField(max_length=100,blank=True)
	lastName=models.CharField(max_length=100,blank=True)
	dateOfBirth=models.DateField(null=True)
	mobile=models.BigIntegerField(blank=True,null=True)
	email=models.EmailField(blank=True,null=True)
	gender=models.CharField(max_length=50,blank=True)
	currentAddress=models.CharField(max_length=1000,blank=True)
	permanentAddress=models.CharField(max_length=1000,blank=True)
	createdDate=models.DateTimeField(auto_now_add=True)
	modifiedDate=models.DateTimeField(auto_now=True)
	
	def __str__(self):
		return str(self.candidateID)+" , PERSONAL ID - "+str(self.personalID)
		

class Courses(models.Model):
	courseID=models.AutoField(primary_key=True)
	courseName=models.CharField(max_length=50,default=None,unique=True)
	status=models.CharField(max_length=100,default="Active");
	createdDate=models.DateTimeField(auto_now_add=True)
	modifiedDate=models.DateTimeField(auto_now=True)

	def __str__(self):
		return str(self.courseName)

class EducationalInstitution(models.Model):
	institutionID=models.AutoField(primary_key=True)
	institutionName=models.CharField(max_length=200,default=None,unique=True)
	status=models.CharField(max_length=100,default="Active");
	createdDate=models.DateTimeField(auto_now_add=True)
	modifiedDate=models.DateTimeField(auto_now=True)

	def __str__(self):
		return str(self.institutionName)


class CandidateEducation(models.Model):
	educationID=models.AutoField(primary_key=True)
	candidateID=models.ForeignKey(Candidate,on_delete=models.PROTECT,related_name="education",blank=True)
	institutionName=models.ForeignKey(EducationalInstitution,on_delete=models.PROTECT,to_field='institutionName',blank=True,null=True)
	courseName=models.ForeignKey(Courses,on_delete=models.PROTECT,to_field='courseName',blank=True,null=True)
	gpa=models.FloatField(blank=True,null=True)
	graduationYear=models.IntegerField(blank=True,null=True)
	graduationType=models.CharField(blank=True,max_length=100)
	createdDate=models.DateTimeField(auto_now_add=True)
	modifiedDate=models.DateTimeField(auto_now=True)

	def __str__(self):
		return str(self.candidateID)+" , EDUCATION ID - "+str(self.educationID)


class CandidateProfessional(models.Model):
	professionalID=models.AutoField(primary_key=True)
	candidateID=models.OneToOneField(Candidate,unique=True,on_delete=models.PROTECT,related_name="professional",blank=True)
	currentEmployer=models.CharField(max_length=100,blank=True)
	currentDesignation=models.CharField(max_length=100,blank=True)
	currentCTC=models.CharField(max_length=50,blank=True)
	experienceYear=models.FloatField(blank=True,null=True)
	experienceMonth=models.FloatField(blank=True,null=True)
	resume=models.CharField(max_length=100,blank=True)
	createdDate=models.DateTimeField(auto_now_add=True)
	modifiedDate=models.DateTimeField(auto_now=True)

	def __str__(self):
		return str(self.candidateID)+" , PROFESSIONAL ID - "+str(self.professionalID)


class CandidateProcess(models.Model):
	processID=models.AutoField(primary_key=True)
	candidateID=models.OneToOneField(Candidate,unique=True,on_delete=models.PROTECT,related_name="process",blank=True)
	source=models.ForeignKey(Source,on_delete=models.PROTECT,to_field='source',blank=True,null=True)
	processStart=models.DateTimeField(blank=True,null=True)
	processStatus=models.CharField(max_length=200,blank=True,default="Not Started")
	processAge=models.IntegerField(blank=True,null=True)
	title=models.ForeignKey(Designation,on_delete=models.PROTECT,to_field='designation',blank=True,null=True)
	team=models.ForeignKey(Department,on_delete=models.PROTECT,to_field='departmentName',blank=True,null=True)
	lastInterviewStatus=models.CharField(max_length=100,blank=True)
	createdDate=models.DateTimeField(auto_now_add=True)
	modifiedDate=models.DateTimeField(auto_now=True)

	def __str__(self):
		return str(self.candidateID)+" , PROCESS ID - "+str(self.processID)


class CandidateOffer(models.Model):
	offerID=models.AutoField(primary_key=True)
	candidateID=models.OneToOneField(Candidate,unique=True,on_delete=models.PROTECT,related_name="offer",blank=True)
	joiningDate=models.DateField(blank=True,null=True)
	hiringDecisionDate=models.DateField(blank=True,null=True)
	offerDate=models.DateField(blank=True,null=True)
	offerTT=models.IntegerField(blank=True,null=True)
	offerStatus=models.CharField(default="",max_length=100,blank=True)
	createdDate=models.DateTimeField(auto_now_add=True)
	modifiedDate=models.DateTimeField(auto_now=True)

	def __str__(self):
		return str(self.candidateID)+" , OFFER ID - "+str(self.offerID)


class CandidateSkill(models.Model):
	skillID=models.AutoField(primary_key=True)
	candidateID=models.OneToOneField(Candidate,unique=True,on_delete=models.PROTECT,related_name="skill",blank=True)
	skillSet=models.CharField(max_length=200,blank=True)
	createdDate=models.DateTimeField(auto_now_add=True)
	modifiedDate=models.DateTimeField(auto_now=True)

	def __str__(self):
		return str(self.candidateID)+" , SKILL ID - "+str(self.skillID)


class InterviewLevel(models.Model):
	levelID=models.AutoField(primary_key=True)
	candidateID=models.ForeignKey(Candidate,on_delete=models.PROTECT,related_name="interviewLevels",blank=True)
	levelOfInterview=models.CharField(max_length=100,blank=True)
	interviewDate=models.DateField(blank=True,null=True)	
	firstNoShowDate=models.DateField(blank=True,null=True)
	secondNoShowDate=models.DateField(max_length=100,blank=True,null=True)
	levelDecision=models.CharField(max_length=100,blank=True,default="Scheduled")
	levelTT=models.IntegerField(blank=True,null=True)
	isFinal=models.BooleanField()
	createdDate=models.DateTimeField(auto_now_add=True)
	modifiedDate=models.DateTimeField(auto_now=True)

	def __str__(self):
		return str(self.candidateID)+ " , "+ self.levelOfInterview


class InterviewRound(models.Model):
	roundID=models.AutoField(primary_key=True)
	roundNumber=models.IntegerField(blank=True,null=True)
	levelID=models.ForeignKey(InterviewLevel,on_delete=models.PROTECT,related_name="interviewRounds")
	interviewDate=models.DateField(blank=True,null=True)
	modeOfInterview=models.CharField(max_length=100,blank=True)
	interviewStartTime=models.TimeField(blank=True,null=True)
	interviewFinishTime=models.TimeField(blank=True,null=True)
	roundDecision=models.CharField(max_length=100,blank=True,default="Scheduled")
	createdDate=models.DateTimeField(auto_now_add=True)
	modifiedDate=models.DateTimeField(auto_now=True)

	def __str__(self):
		return "LEVEL ID - "+str(self.levelID)+" , PANEL-"+str(self.roundNumber)


class PanelMembersDirectory(models.Model):
	memberID=models.AutoField(primary_key=True)
	memberName=models.CharField(max_length=100,unique=True)
	memberEmail=models.EmailField(max_length=100,unique=True)
	createdDate=models.DateTimeField(auto_now_add=True)
	modifiedDate=models.DateTimeField(auto_now=True)

	def __str__(self):
		return str(self.memberName)+' , '+str(self.memberEmail)


class Panellist(models.Model):
	panellistID=models.AutoField(primary_key=True)
	roundID=models.ForeignKey(InterviewRound,on_delete=models.PROTECT,related_name="panel")
	panellistName=models.ForeignKey(PanelMembersDirectory,on_delete=models.PROTECT,to_field="memberName",related_name="panellistName")
	panellistEmail=models.ForeignKey(PanelMembersDirectory,on_delete=models.PROTECT,to_field="memberEmail",related_name="panellistEmail",default="")
	notes=models.TextField(blank=True)
	comments=models.TextField(blank=True)
	panellistDecision=models.CharField(max_length=100,blank=True)
	secretKey=models.CharField(max_length=100,blank=True)
	status=models.CharField(max_length=50,blank=True)
	createdDate=models.DateTimeField(auto_now_add=True)
	modifiedDate=models.DateTimeField(auto_now=True)

	def __str__(self):
		return "ROUND-"+str(self.roundID.roundNumber)+" , PANELLIST NAME-"+str(self.panellistName.memberName)


class EmailTemplates(models.Model):
	templateID=models.AutoField(primary_key=True)
	templateName=models.CharField(max_length=50)
	emailSubject=models.CharField(max_length=100)
	emailBody=models.TextField(blank=True)
	cc=models.CharField(max_length=50,blank=True)
	createdDate=models.DateTimeField(auto_now_add=True)
	modifiedDate=models.DateTimeField(auto_now=True)

	def __str__(self):
		return str(self.templateName)


class Resume(models.Model):
	resumeID = models.AutoField(primary_key=True)
	candidateID=models.OneToOneField(Candidate,on_delete=models.PROTECT,related_name="resume")
	resume=models.FileField(upload_to='myapp/resumes/',blank=True)
	createdDate=models.DateTimeField(auto_now_add=True)
	modifiedDate=models.DateTimeField(auto_now=True)

	def __str__(self):
		return "RESUME "+str(self.resumeID)


class Estimates(models.Model):
	estimatesID=models.AutoField(primary_key=True)
	position=models.OneToOneField(Position,to_field="position",on_delete=models.PROTECT)
	noOfResumesToScreen=models.IntegerField(blank=True, null=True)
	noOfHoursPerOpening=models.IntegerField(blank=True, null=True)
	noOfDaysInProcess=models.IntegerField(blank=True, null=True)
	createdDate=models.DateTimeField(auto_now_add=True)
	modifiedDate=models.DateTimeField(auto_now=True)

	def __str__(self):
		return "EST. "+str(self.estimatesID)


class CandidateEngagement(models.Model):
	engagementID=models.AutoField(primary_key=True)
	candidateID=models.ForeignKey(Candidate,on_delete=models.PROTECT,related_name="engagements",blank=True)
	responsibilityHolder=models.EmailField(max_length=100,default=None)
	action=models.ForeignKey(EngagementActions,on_delete=models.PROTECT)
	dueDate=models.DateField(null=True)
	status=models.NullBooleanField(default=False,null=True,blank=True)
	createdDate=models.DateTimeField(auto_now_add=True)
	modifiedDate=models.DateTimeField(auto_now=True)

	def __str__(self):
		return str(self.candidateID)+" , ENGG-"+str(self.engagementID)+' , '+str(self.action)