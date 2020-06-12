from django.contrib.auth.models import User, Group, Permission  
from rest_framework import viewsets,status
from rest_framework.views import APIView
from myapp.serializers import RequestSerializer,EstimatesSerializer
from myapp.models import Request,Estimates
from django.forms.models import model_to_dict
from rest_framework.response import Response
from django.http import JsonResponse


class RequestViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows requests to be viewed, edited and added.
    """
    queryset=Request.objects.all()
    serializer_class=RequestSerializer

    def create(self,request):
        data=request.data
        data['recruiter']=request.user.username
    	serializer=RequestSerializer(data=data)
        if serializer.is_valid():
            requestInstance=Request.objects.create(**serializer.validated_data)
            return Response(RequestSerializer(requestInstance).data,status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)



class EstimatesViewSets(viewsets.ModelViewSet):
    '''
    API endpoint that allows the user to see the estimates calculated for a 
    particular position in requisition
    '''
    queryset=Estimates.objects.all()
    serializer_class=EstimatesSerializer
