from django.contrib.auth.models import User, Group, Permission
from rest_framework import serializers
from models import *
import random
import string

class UserSerializer(serializers.ModelSerializer):
    groups = serializers.StringRelatedField(many=True)
    class Meta:
		model = User
		fields=('id','url','username','password','email','first_name','last_name','is_active','is_staff','is_superuser','groups')


class GroupSerializer(serializers.ModelSerializer):
	permissions=serializers.StringRelatedField(many=True)
	class Meta:
		model = Group
		fields=('id','url','name','permissions')

class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        exclude=['content_type']

class EngagementActionsSerializer(serializers.ModelSerializer):
	class Meta:
		model=EngagementActions
		fields='__all__'

class PositionSerializer(serializers.ModelSerializer):
	class Meta:
		model=Position
		fields='__all__'

class DepartmentSerializer(serializers.ModelSerializer):
	class Meta:
		model=Department
		fields='__all__'

class DesignationSerializer(serializers.ModelSerializer):
	class Meta:
		model=Designation
		fields='__all__'


class RequestSerializer(serializers.ModelSerializer):
	class Meta:
		model = Request
		fields='__all__'

class SkillsSerializer(serializers.ModelSerializer):
	class Meta:
		model = Skills
		fields='__all__'

class SourceSerializer(serializers.ModelSerializer):
	class Meta:
		model=Source 
		fields='__all__'

class CandidateFeedbackSerializer(serializers.ModelSerializer):
	class Meta:
		model=CandidateFeedback 
		fields='__all__'

class CandidateCostSerializer(serializers.ModelSerializer):
	class Meta:
		model=CandidateCost
		fields='__all__'

class CandidatePersonalSerializer(serializers.ModelSerializer):
	class Meta:
		model=CandidatePersonal
		fields='__all__'

class CourseSerializer(serializers.ModelSerializer):
	class Meta:
		model=Courses
		fields='__all__'

class EducationalInstitutionSerializer(serializers.ModelSerializer):
	class Meta:
		model=EducationalInstitution
		fields='__all__'

class CandidateEducationSerializer(serializers.ModelSerializer):
	class Meta:
		model=CandidateEducation
		fields='__all__'

class CandidateProfessionalSerializer(serializers.ModelSerializer):
	class Meta:
		model=CandidateProfessional
		fields='__all__'		

class CandidateProcessSerializer(serializers.ModelSerializer):
	class Meta:
		model=CandidateProcess
		fields='__all__'

class CandidateOfferSerializer(serializers.ModelSerializer):
	class Meta:
		model=CandidateOffer
		fields='__all__'

class CandidateSkillSerializer(serializers.ModelSerializer):
	class Meta:
		model=CandidateSkill
		fields='__all__'

class PanelMembersDirectorySerializer(serializers.ModelSerializer):
	class Meta:
		model=PanelMembersDirectory
		fields='__all__'


class PanellistSerializer(serializers.ModelSerializer):
	class Meta:
		model=Panellist
		fields='__all__'

class InterviewRoundSerializer(serializers.ModelSerializer):
	panel=PanellistSerializer(many=True,required=False)
	class Meta:
		model=InterviewRound
		fields='__all__'
			
class InterviewLevelSerializer(serializers.ModelSerializer):
	interviewRounds=InterviewRoundSerializer(many=True,required=False)
	class Meta:
		model=InterviewLevel
		fields='__all__'

class ResumeSerializer(serializers.ModelSerializer):
	class Meta:
		model = Resume
		fields = '__all__'
			
class CandidateEngagementSerializer(serializers.ModelSerializer):
	action=EngagementActionsSerializer(required=False)
	class Meta:
		model=CandidateEngagement
		fields='__all__'

class CandidateSerializer(serializers.ModelSerializer):
	requestID=serializers.PrimaryKeyRelatedField(allow_null=True,label="RequestID",queryset=Request.objects.all(),required=False)
	personal=CandidatePersonalSerializer(required=False)
	education=CandidateEducationSerializer(many=True,required=False)
	professional=CandidateProfessionalSerializer(required=False)
	process=CandidateProcessSerializer(required=False)
	offer=CandidateOfferSerializer(required=False)
	skill=CandidateSkillSerializer(required=False)
	interviewLevels=InterviewLevelSerializer(many=True,required=False)
	candidateCost=CandidateCostSerializer(required=False)
	resume=ResumeSerializer(required=False)
	engagements=CandidateEngagementSerializer(many=True,required=False)

	class Meta:
		model=Candidate
		fields='__all__'
		
class EmailTemplatesSerializer(serializers.ModelSerializer):
	class Meta:
		model= EmailTemplates
		fields='__all__'

class EstimatesSerializer(serializers.ModelSerializer):
	class Meta:
		model=Estimates
		fields='__all__'

