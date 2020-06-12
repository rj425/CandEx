from django.contrib.auth.models import User, Group, Permission  
from rest_framework import viewsets,status
from rest_framework.views import APIView
from myapp.serializers import *
from myapp.models import *
from django.forms.models import model_to_dict
import json,random,string
from django.core.mail import send_mail
from django.conf import settings
from rest_framework.response import Response
from django.http import JsonResponse
from rest_framework.parsers import FileUploadParser,MultiPartParser,FormParser
from django.contrib.auth import authenticate,login

class EngagementActionsViewSet(viewsets.ModelViewSet):
    queryset=EngagementActions.objects.all()
    serializer_class=EngagementActionsSerializer
    
class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer

class DesignationViewSet(viewsets.ModelViewSet):
    queryset = Designation.objects.all()
    serializer_class = DesignationSerializer

class PositionViewSet(viewsets.ModelViewSet):
    queryset=Position.objects.all()
    serializer_class=PositionSerializer

class SkillsViewSet(viewsets.ModelViewSet):
    queryset = Skills.objects.all()
    serializer_class = SkillsSerializer

class SourceViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows to edit the Candidate personal information.
    """
    queryset=Source.objects.all()
    serializer_class=SourceSerializer

class CourseViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows to edit the Candidate personal information.
    """
    queryset=Courses.objects.all()
    serializer_class=CourseSerializer

class EducationalInstitutionViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows to edit the Candidate personal information.
    """
    queryset=EducationalInstitution.objects.all()
    serializer_class=EducationalInstitutionSerializer


class PanelMembersDirectoryViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows to add the panels members for a diretory(MASTER)
    """
    queryset=PanelMembersDirectory.objects.all()
    serializer_class=PanelMembersDirectorySerializer


class EmailTemplatesViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows email templates to be viewed and added.
    """
    queryset=EmailTemplates.objects.all()
    serializer_class=EmailTemplatesSerializer



