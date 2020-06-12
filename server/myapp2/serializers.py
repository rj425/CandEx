from django.contrib.auth.models import User, Group, Permission
from rest_framework import serializers
from models import *
import random
import string

class UploadResumeSerializer(serializers.ModelSerializer):
	class Meta:
		model = Resume
		fields = '__all__'

			
class DownloadResumeSerializer(serializers.ModelSerializer):
	class Meta:
		model=ZipFile
		fields='_all_'

