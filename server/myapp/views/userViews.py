from django.contrib.auth.models import User, Group, Permission  
from rest_framework import viewsets,status
from rest_framework.views import APIView
from myapp.serializers import UserSerializer,GroupSerializer,PermissionSerializer
from django.forms.models import model_to_dict
import json,random,string
from django.core.mail import send_mail
from django.conf import settings
from rest_framework.response import Response
from django.http import JsonResponse
from django.contrib.auth import authenticate,login
from rest_framework.decorators import api_view



@api_view()
def getUser(request):
    user=request.user
    user=UserSerializer(user,context={'request': request}).data
    del user['password']
    return Response(user)

class ChangePassword(APIView):
    def post(self,request):
        data=request.data
        print data
        validUser = authenticate(username=data['username'], password=data['password'])
        if validUser!=None:
            status='Valid User'
            validUser.set_password(data['newPassword'])
            validUser.save()
            status='SuccessfulChange'
        else:
            status='InvalidCredentials'
        return Response({'status':status})
        
class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer

    def create(self,request):        
        userName = request.data['username']
        userPass = request.data['password']
        userMail = request.data['email']
        user= User.objects.create_user(userName,userMail,userPass)
        value1=request.data['is_staff']
        if(value1=='false'):
            print "found"
            user.is_staff=False
        else:
            user.is_staff=True
        value2=request.data['is_superuser']
        if(value2=='false'):
            print "found"
            user.is_superuser=False
        else:
            user.is_superuser=True
        value3=request.data['is_active']
        if(value3=='false'):
            print "found"
            user.is_active=False
        else:
            user.is_active=True
        user.first_name=request.data['first_name']
        user.last_name=request.data['last_name']
        user.save()
        for groupName in request.data['groups']:
            group = Group.objects.get(name=groupName)       
            user.groups.add(group)
        userDict=model_to_dict(user)
        serializer=UserSerializer(user,context={'request':request})
        # print serializer.data
        return Response(serializer.data,status=status.HTTP_201_CREATED)
        
        
    def update(self,request,pk):  
        userName = request.data['username']
        user = User.objects.get(username=userName)
        
        value1=request.data['is_staff']
        if(value1=='false' or value1=='False' or value1==False):
            print "found"
            user.is_staff=False
        else:
            user.is_staff=True
        value2=request.data['is_superuser']
        print "SUPERUSER STATUS ",request.data['is_superuser']
        if(value2=='false' or value2=='False' or value2==False):
            print "found"
            user.is_superuser=False
        else:
            user.is_superuser=True
        value3=request.data['is_active']
        if(value3=='false' or value3=='False' or value3==False):
            print "found"
            user.is_active=False
        else:
            user.is_active=True
        user.first_name=request.data['first_name']
        user.last_name=request.data['last_name']
        user.groups.clear()
        user.save()
        for groupName in request.data['groups']:
            group = Group.objects.get(name=groupName)       
            user.groups.add(group)
        serializer=UserSerializer(user,context={'request':request}).data
        del serializer['password']
        # print serializer.data
        return Response(serializer)

class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Group.objects.all()
    serializer_class = GroupSerializer

    def create(self,request):
        groupName=request.data['name']
        group=Group.objects.create(name=groupName)
        for permission in request.data['permissions']:
            permission = Permission.objects.get(name=permission)       
            group.permissions.add(permission)
        serializer=GroupSerializer(group,context={'request':request})
        return Response(serializer.data)

    def update(self,request,pk):
        group=Group.objects.get(id=request.data['id'])
        # for permission in request.data['permissions']:
        #     permission = Permission.objects.get(name=permission)       
        #     group.permissions.add(permission)

        # serializer=GroupSerializer(group,context={'request':request})
        
        # print serializer.data
        return Response({})
    

class PermissionViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Permission.objects.all()
    serializer_class = PermissionSerializer


class AuthenticateUser(APIView):
    """
    API endpoint that authenticates the user
    """

    def get(self,request):
        data=request.user
        return Response(UserSerializer(data,context={'request': request}).data,status=status.HTTP_200_OK)
 