from django.contrib.auth.models import User, Group, Permission  
from rest_framework import viewsets,status
from rest_framework.views import APIView
from myapp.serializers import *
from myapp.models import *
from django.forms.models import model_to_dict
from rest_framework.response import Response
from django.http import JsonResponse

class CandidateViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows to add and list candidates.
    """
    queryset=Candidate.objects.all()
    serializer_class=CandidateSerializer

    def create(self,request):
        data=request.data
        if(data.get('requestID',None)==None):
            data['requestID']=None
        data['recruiter']=request.user.username
        serializer=CandidateSerializer(data=data)
        if serializer.is_valid():
            validatedData=serializer.validated_data
            candidateInstance=Candidate.objects.create(requestID=validatedData.pop('requestID'),recruiter=validatedData.pop('recruiter'))
            CandidatePersonal.objects.create(candidateID=candidateInstance,**validatedData.pop('personal'))
            for educationData in validatedData.pop('education'):
                CandidateEducation.objects.create(candidateID=candidateInstance,**educationData)
            CandidateProfessional.objects.create(candidateID=candidateInstance,**validatedData.pop('professional'))
            CandidateProcess.objects.create(candidateID=candidateInstance,**validatedData.pop('process'))
            return Response(CandidateSerializer(candidateInstance).data,status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)        

    def list(self,request):
        requestID=request.GET.get('reqID')
        if(requestID==None):
            queryset=Candidate.objects.all()    
        else:
            queryset=Candidate.objects.filter(requestID=requestID)
        count=len(queryset)
        serializer=self.get_serializer(queryset,many=True)
        return Response({
                            'counts':count,
                            'results':serializer.data
                        },status=status.HTTP_200_OK)

    def update(self,request,pk=None):
        # API only for updating RequestID
        data=request.data
        serializer=CandidateSerializer(data=data)
        if serializer.is_valid():
            validatedData=serializer.validated_data
            candidateInstance=Candidate.objects.get(candidateID=pk)
            candidateInstance.requestID=validatedData.pop('requestID',None)
            candidateInstance.status=validatedData.pop('status','')
            candidateInstance.dropReason=validatedData.pop('dropReason','')
            candidateInstance.save()
            return Response(CandidateSerializer(candidateInstance).data,status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors,status=status.HTTP_200_OK)  

class CandidatePersonalViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows Candidate personal information to be viewed and edited.
    """
    queryset=CandidatePersonal.objects.all()
    serializer_class=CandidatePersonalSerializer


class CandidateEducationViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows Candidate education information to be viewed and edited.
    """
    queryset=CandidateEducation.objects.all()
    serializer_class=CandidateEducationSerializer

    def create(self,request):
        data=request.data
        for education in data.get('education'):
            educationID=education.pop('educationID')
            serializer=CandidateEducationSerializer(data=education)
            if serializer.is_valid():
                educationData=serializer.validated_data
                if educationID==None:
                    CandidateEducation.objects.create(**educationData)
                elif educationID!=None:
                    educationInstance=CandidateEducation.objects.get(educationID=educationID)
                    educationInstance.institutionName=educationData.get('institutionName')
                    educationInstance.courseName=educationData.get('courseName')
                    educationInstance.graduationType=educationData.get('graduationType')
                    educationInstance.gpa=educationData.get('gpa')
                    educationInstance.graduationYear=educationData.get('graduationYear')
                    educationInstance.save()
            else:
                return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
        educations=CandidateEducation.objects.filter(candidateID=educationData.get('candidateID'))
        serializer=CandidateEducationSerializer(educations,many=True)
        return Response({'results':serializer.data},status=status.HTTP_201_CREATED)

class CandidateProfessionalViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows Candidate Professional information to be edited or viewed.
    """
    queryset=CandidateProfessional.objects.all()
    serializer_class=CandidateProfessionalSerializer


class CandidateProcessViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows Candidate Process information to be edited or viewed.
    """
    queryset=CandidateProcess.objects.all()
    serializer_class=CandidateProcessSerializer


class CandidateOfferViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows Candidate Offer to be viewed or edited.
    """
    queryset=CandidateOffer.objects.all()
    serializer_class=CandidateOfferSerializer

class CandidateSkillViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows Candidate Skill to be viewed or edited.
    """
    queryset=CandidateSkill.objects.all()
    serializer_class=CandidateSkillSerializer

class PanellistViewSet(viewsets.ModelViewSet):
    """
    API endpoint to add panellist in interview panel
    """
    queryset=Panellist.objects.all()
    serializer_class=PanellistSerializer

class InterviewRoundViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows to add interview panel for the scheduled interview
    """
    queryset=InterviewRound.objects.all()
    serializer_class=InterviewRoundSerializer

    def create(self,request):
        data=request.data
        serializer=InterviewRoundSerializer(data=data)
        if serializer.is_valid():
            validatedData=serializer.validated_data
            panelData=validatedData.get('panel',None)
            if(panelData==None):
                interviewRoundData=validatedData
                interviewRoundInstance=InterviewRound.objects.create(**interviewRoundData)
                return Response(InterviewRoundSerializer(interviewRoundInstance).data,status.HTTP_201_CREATED)
            else:
                panelData=validatedData.pop('panel')
                if(panelData!=[]):
                    for panellistData in panelData:
                        panellistData['secretKey']=self.generateSecretKey()
                        Panellist.objects.create(**panellistData)
                    roundID=panelData[0].get('roundID').roundID
                    interviewRoundInstance=InterviewRound.objects.get(roundID=roundID)
                    return Response(InterviewRoundSerializer(interviewRoundInstance).data,status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

    def update(self,request,pk):
        data=request.data
        serializer=InterviewRoundSerializer(data=data)
        if serializer.is_valid():
            interviewRoundInstance=InterviewRound.objects.get(roundID=pk)
            validatedData=serializer.validated_data                
            interviewRoundInstance.interviewDate=validatedData.get('interviewDate',interviewRoundInstance.interviewDate)
            interviewRoundInstance.modeOfInterview=validatedData.get('modeOfInterview',interviewRoundInstance.modeOfInterview)
            interviewRoundInstance.interviewStartTime=validatedData.get('interviewStartTime',interviewRoundInstance.interviewStartTime)
            interviewRoundInstance.interviewFinishTime=validatedData.get('interviewFinishTime',interviewRoundInstance.interviewFinishTime)
            interviewRoundInstance.roundDecision=validatedData.get('roundDecision',interviewRoundInstance.roundDecision)
            if(validatedData.get('panel',None)!=None):
                panelData=validatedData.pop('panel')
                if(panelData==[]):
                    pass
                else:
                    roundID=panelData[0].get('roundID').roundID
                    Panellist.objects.filter(roundID=roundID).delete()
                    for panellist in panelData:
                        panellist['secretKey']=self.generateSecretKey()
                        Panellist.objects.create(**panellist)
            interviewRoundInstance.save()
            return Response(InterviewRoundSerializer(interviewRoundInstance).data,status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)                

    def generateSecretKey(self):
        secretKey="".join([random.SystemRandom().choice(string.digits + string.letters) for i in range(36)])
        return secretKey


class InterviewLevelViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows candidate Interview information to be edited or viewed.
    """
    queryset=InterviewLevel.objects.all()
    serializer_class=InterviewLevelSerializer


class CandidateFeedbackViewSet(viewsets.ModelViewSet):
    queryset=CandidateFeedback.objects.all()
    serializer_class=CandidateFeedbackSerializer

    def create(self,request):
        data=request.data
        candidateInstance=Candidate.objects.get(candidateID=request.data['candidateID'])
        feedbackObj= CandidateFeedback.objects.create(candidateID=candidateInstance)
        feedbackObj.secretKey=self.generateSecretKey()
        feedbackObj.save()
        serializer=CandidateFeedbackSerializer(feedbackObj)
        return Response(serializer.data)

    def generateSecretKey(self):
        secretKey="".join([random.SystemRandom().choice(string.digits + string.letters) for i in range(36)])
        return secretKey

class CandidateCostViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows Candidate Offer to be viewed or edited.
    """
    queryset=CandidateCost.objects.all()
    serializer_class=CandidateCostSerializer
    
class CandidateEngagementViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows candidate engagment process to be handled
    """
    queryset=CandidateEngagement.objects.all()
    serializer_class=CandidateEngagementSerializer

    def create(self,request):
        data=request.data
        for engagement in data.get('engagements'):
            engagementID=engagement.pop('engagementID')
            action=engagement.pop('action')
            serializer=CandidateEngagementSerializer(data=engagement)
            if serializer.is_valid():
                action=EngagementActions.objects.get(actionID=action.get('actionID'))
                engagementData=serializer.validated_data
                if engagementID==None:
                    CandidateEngagement.objects.create(action=action,**engagementData)
                elif engagementID!=None:
                    engagementInstance=CandidateEngagement.objects.get(engagementID=engagementID)
                    engagementInstance.responsibilityHolder=engagementData.get('responsibilityHolder')
                    engagementInstance.action=action
                    engagementInstance.dueDate=engagementData.get('dueDate')
                    engagementInstance.status=engagementData.get('status')
                    engagementInstance.save()
            else:
                return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST) 
        engagements=CandidateEngagement.objects.filter(candidateID=engagementData.get('candidateID'))
        serializer=CandidateEngagementSerializer(engagements,many=True)
        return Response({'results':serializer.data},status=status.HTTP_201_CREATED)


class ResumeViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows the user to upload an download resumes
    """
    queryset=Resume.objects.all()
    serializer_class=ResumeSerializer