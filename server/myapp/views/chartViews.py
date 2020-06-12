from __future__ import division
from django.contrib.auth.models import User, Group, Permission  
from rest_framework import viewsets,status
from rest_framework.views import APIView
from myapp.serializers import *
from myapp.models import *
from django.forms.models import model_to_dict
from rest_framework.response import Response
from django.http import JsonResponse
from django.utils import timezone
from datetime import datetime,timedelta,date
from decimal import *
import collections


def calculateInterviewHours(startTime,finishTime):
    startTime=startTime.strftime("%H:%M:%S")
    finishTime=finishTime.strftime("%H:%M:%S")
    startTime=datetime.strptime(startTime,'%H:%M:%S')
    finishTime=datetime.strptime(finishTime,'%H:%M:%S')
    timeTaken=finishTime-startTime
    timeTaken=Decimal(timeTaken.seconds/3600)
    return round(timeTaken,2)


class NoticePeriod(APIView):

    def get(self,request):
        candidateQueryset=CandidateOffer.objects.all()
        results=[]
        for offer in candidateQueryset:
            joiningDate=offer.joiningDate
            offerDate=offer.offerDate
            if joiningDate!=None and offerDate!=None:
                noticePeriod=offer.joiningDate-offer.offerDate
                print type(noticePeriod)
                candidateQueryset=CandidatePersonal.objects.get(candidateID=offer.candidateID)
                serializer=CandidatePersonalSerializer(candidateQueryset).data
                serializer['noticePeriod']=noticePeriod.days
            results.append(serializer) 
        print results   
        return Response({'results':results})

class RequestionAgeing(APIView):

    def get(self,request):
        requestQueryset=Request.objects.filter(requestStatus="Open")
        results=[]
        now=datetime.now(timezone.utc)
        for request in requestQueryset:
            ageOfRequest=now-request.createdDate
            serializer=RequestSerializer(request).data
            serializer['age']=ageOfRequest.days
            results.append(serializer)
        return Response({'results':results})


class EmployerReport(APIView):

    def get(self,request):
        candidateQueryset=CandidateProfessional.objects.all()
        candidateQueryset=CandidateProfessionalSerializer(candidateQueryset,many=True).data
        results=[]
        employerList=[]
        for candidateProfessionalObject in candidateQueryset:
            if(candidateProfessionalObject['currentEmployer']!=""):
                employerList.append(candidateProfessionalObject['currentEmployer'])
        #getting unique values for employer
        employerList=set(employerList)
        for employer in employerList:
            data={}
            data['label']=employer
            candidateQueryset=CandidateProfessional.objects.filter(currentEmployer=employer)
            serializer=CandidateProfessionalSerializer(candidateQueryset,many=True).data
            data['data']=[]
            for candidate in serializer:
                data['data'].append(candidate)
            results.append(data)

        return Response({'results':results})
        
class EducationReport(APIView):
    def get(self,request):
        candidateQueryset=CandidateEducation.objects.all()
        candidateQueryset=CandidateEducationSerializer(candidateQueryset,many=True).data
        results=[]
        graduationTypeList=[]
        for candidateEducationObject in candidateQueryset:
            graduationTypeList.append(candidateEducationObject['graduationType'])
        #getting unique values for employer
        graduationTypeList=set(graduationTypeList)
        for graduationType in graduationTypeList:
            data={}
            data['label']=graduationType
            candidateQueryset=CandidateEducation.objects.filter(graduationType=graduationType)
            serializer=CandidateProfessionalSerializer(candidateQueryset,many=True).data
            data['data']=[]
            for candidate in serializer:
                data['data'].append(candidate['candidateID'])
            results.append(data)

        return Response({'results':results})


class CostPerHire(APIView):

    def get(self,request):
        results=[]
        candidateQueryset=Candidate.objects.all()
        serializer=CandidateSerializer(candidateQueryset,many=True)
        for candidate in serializer.data:
            candidateCost=candidate.get('candidateCost')
            if candidateCost!=None:
                results.append(candidate)

        return Response({'results':results})


class CandidatesOrderedByRequests(APIView):

    def get(self,request):
        reqQueryset=Request.objects.filter(requestStatus="Open")
        response=[]
        for req in reqQueryset: 
            candidateQueryset=Candidate.objects.filter(requestID=req.requestID)
            departmentObj=Department.objects.get(departmentName=req.department)
            designationObj=Designation.objects.get(designation=req.designation)
            req=RequestSerializer(req).data
            req['department']=DepartmentSerializer(departmentObj).data
            req['desgnation']=DesignationSerializer(designationObj).data
            serializer=CandidateSerializer(candidateQueryset,many=True)
            req['candidates']=[]
            for x in serializer.data:
                    req['candidates'].append(x['personal'])

            response.append(req)    

        return Response ({'results':response})

class returnRequests(APIView):
#apply filter 
    def get(self,request):
        choice=request.GET.get('choice')
        applyFilter=request.GET.get('applyFilter')

        if choice=='Hiring Manager':
            departments=Department.objects.all()
            results=[]
            for dept in departments:
                data={}
                data['requests']=[]
                data['label']=dept.departmentManager
                if applyFilter=='true': 
                    reqQueryset=Request.objects.filter(requestStatus="Open",department=dept)
                elif applyFilter=='false':
                    reqQueryset=Request.objects.filter(department=dept)
                requests=RequestSerializer(reqQueryset,many=True).data
                for request in requests:
                    reqID=request.get('requestID')
                    data['requests'].append(request)
                
                results.append(data)

        elif choice=='Recruiter':
            reqQuerySet=Request.objects.all()
            reqQuerySet=RequestSerializer(reqQuerySet,many=True).data

            recruiterList=[]
            for requestObject in reqQuerySet:
                recruiterList.append(requestObject['recruiter'])
            #getting unique values 
            recruiterList=set(recruiterList)
            results=[]

            for recruiter in recruiterList:
                data={}
                data['requests']=[]
                data['label']=recruiter
                if applyFilter=='true': 
                    requestQueryset=Request.objects.filter(recruiter=recruiter,requestStatus="Open")
                elif applyFilter=='false':
                    requestQueryset=Request.objects.filter(recruiter=recruiter)
                requests=RequestSerializer(requestQueryset,many=True).data
                for request in requests:
                    data['requests'].append(request)
                results.append(data)


        return Response ({'results':results})

class SourceGenderGeoMix(APIView):
    
    def get(self,request):
        results=[]
        choice=request.GET.get('choice')
        filterFlag=request.GET.get('filter')
        offeredCandidates=CandidateOffer.objects.exclude(offerDate=None)
        offeredCandidatesID=[]
        for candidate in offeredCandidates:
            offeredCandidatesID.append(candidate.candidateID.candidateID)
        if choice=='Source':
            sources=Source.objects.all()
            results=[]
            for source in sources:
                data={}
                data['label']=source.source
                candidateQueryset=CandidateProcess.objects.filter(source=source.source)
                if filterFlag=='true':
                    candidateQueryset=candidateQueryset.filter(candidateID__in=offeredCandidatesID)
                serializer=CandidateProcessSerializer(candidateQueryset,many=True).data
                data['candidates']=[]
                for candidate in serializer :
                    candidateObj=Candidate.objects.get(candidateID=candidate.get('candidateID'))
                    candidateObj=CandidateSerializer(candidateObj).data
                    candidatePersonal=candidateObj.get('personal')
                    candidateOffer=candidateObj.get('offer')
                    data['candidates'].append({'personal':candidatePersonal,'offer':candidateOffer})
                results.append(data)       
        elif choice=='Gender':
            results=[]
            genders=['Male','Female']
            for gender in genders:
                data={}
                data['label']=gender
                candidateQueryset=CandidatePersonal.objects.filter(gender=gender) 
                if filterFlag=='true':
                    candidateQueryset=candidateQueryset.filter(candidateID__in=offeredCandidatesID)
                serializer=CandidatePersonalSerializer(candidateQueryset,many=True).data
                data['candidates']=[]

                for candidate in serializer:
                    candidateObj=Candidate.objects.get(candidateID=candidate.get('candidateID'))
                    candidateObj=CandidateSerializer(candidateObj).data
                    candidatePersonal=candidateObj.get('personal')
                    candidateOffer=candidateObj.get('offer')
                    data['candidates'].append({'personal':candidatePersonal,'offer':candidateOffer})
                results.append(data)
        elif choice=='RequestID':
            reqQueryset=Request.objects.filter(requestStatus="Open")
            results=[]
            for req in reqQueryset:
                data={}
                data['label']=req.requestID 
                candidateQueryset=Candidate.objects.filter(requestID=req.requestID)
                if filterFlag=='true':
                    candidateQueryset=candidateQueryset.filter(candidateID__in=offeredCandidatesID)
                elif filterFlag=='false':
                    for candidateID in offeredCandidatesID:
                        candidateQueryset=candidateQueryset.exclude(candidateID=candidateID)
                serializer=CandidateSerializer(candidateQueryset,many=True).data
                data['candidates']=[]
                for candidate in serializer:
                    data['candidates'].append(candidate['personal'])

                results.append(data)
        return Response({'results':results})
        

class FutureStarts(APIView):

    def get(self,request):
        today=datetime.now()
        monthRange=5
        endDate=datetime.now()
        results={}
        for i in range(0,monthRange):
            endDate=datetime.now()+timedelta(days=i*30)
            results[str(endDate.year)+'%02d'%(endDate.month)]=[]
        offers=CandidateOffer.objects.exclude(joiningDate=None)
        offers=offers.filter(joiningDate__gte=today)
        offers=offers.filter(joiningDate__lte=endDate)
        print '\n\n',offers
        for offer in offers:
            candidateID=offer.candidateID.candidateID
            candidate=CandidatePersonal.objects.get(candidateID=candidateID)
            candidate=CandidatePersonalSerializer(candidate).data
            results[str(offer.joiningDate.year)+'%02d'%(offer.joiningDate.month)].append(candidate)
        return Response({'results':results})

class WeeklyInterviewHours(APIView):

    def get(self,request):
        today=datetime.now().date()
        weekStartDate=today-timedelta(days=today.weekday())
        weekEndDate=weekStartDate+timedelta(days=6)
        results={'levels':[]}
        rounds=InterviewRound.objects.filter(interviewDate__gte=weekStartDate)
        rounds=rounds.filter(interviewDate__lte=weekEndDate)
        for round in rounds:
            levelID=round.levelID.levelID
            level=InterviewLevel.objects.get(levelID=levelID)
            levelName=level.levelOfInterview
            if levelName in results.get('levels'):
                pass
            else:
                results.get('levels').append(levelName)
            timeTaken=calculateInterviewHours(round.interviewStartTime,round.interviewFinishTime)            
            panel=Panellist.objects.filter(roundID=round.roundID)
            for panellist in panel:
                panellistName=panellist.panellistName.memberName
                if results.get(panellistName,None)==None: 
                    results[panellistName]={levelName:timeTaken}
                else:
                    if results[panellistName].get(levelName,None)==None:
                        results[panellistName][levelName]=timeTaken
                    else:
                        results[panellistName][levelName]+=timeTaken
        return Response({'results':results})


class ProcessTimeAtEachLevel(APIView):

    def get(self,request):
        rounds=InterviewRound.objects.exclude(roundDecision='Scheduled')
        rounds=rounds.exclude(roundDecision='Started')
        results={}
        for roundObj in rounds:
            levelName=roundObj.levelID.levelOfInterview
            timeTaken=calculateInterviewHours(roundObj.interviewStartTime,roundObj.interviewFinishTime)
            if results.get(levelName,None)==None:
                results[levelName]=[]
                results[levelName].append(timeTaken)
            else:
                results[levelName].append(timeTaken)
        for level in results:
            length=len(results[level])  
            results[level]=round(sum(results[level])/length,2)
        results= collections.OrderedDict(sorted(results.items()))
        return Response({'results':results})


class CurrentWeekInterviews(APIView):

    def get(self,request):
        today=datetime.now().date()
        weekStartDate=today-timedelta(days=today.weekday())
        weekEndDate=weekStartDate+timedelta(days=6)
        rounds=InterviewRound.objects.filter(interviewDate__gte=weekStartDate)
        rounds=rounds.filter(interviewDate__lte=weekEndDate)
        results=[]
        for round in rounds:
            level=round.levelID
            candidate=level.candidateID.personal
            panel=Panellist.objects.filter(roundID=round.roundID)
            # panel=', '.join([panellist.panellistName.memberName for panellist in panel])
            panel=[panellist.panellistName.memberName for panellist in panel]
            results.append({
                    'candidateName':candidate.firstName+' '+candidate.lastName,
                    'levelName':level.levelOfInterview,
                    'roundName':'ROUND '+str(round.roundNumber),
                    'interviewDate':round.interviewDate,
                    'startTime':round.interviewStartTime,
                    'finishTime':round.interviewFinishTime,
                    'panel':panel
                })
        return Response({'results':results})

class BasicMetrics(APIView):

    def get(self,request):
        today=datetime.now().date()
        results={}
        results['candidates']={}
        results['candidates']['totalCandidates']=len(Candidate.objects.all())
        results['candidates']['candidatesDropped']=len(Candidate.objects.filter(status="Dropped"))
        results['candidates']['candidatesOffered']=len(CandidateOffer.objects.all())-len(CandidateOffer.objects.filter(offerDate=None))
        results['candidates']['candidatesJoined']=len(CandidateOffer.objects.filter(joiningDate__lte=today))

        results['requests']={}
        results['requests']['totalRequests']=len(Request.objects.all())
        results['requests']['activeRequests']=len(Request.objects.filter(requestStatus='Open'))
        results['requests']['closedRequests']=len(Request.objects.filter(requestStatus='Closed'))
        return Response({'results':results})

