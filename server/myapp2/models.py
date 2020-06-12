# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models

# Create your models here.
class Resume(models.Model):
	resumeID=models.AutoField(primary_key=True)
	fileName=models.CharField(unique=True,max_length=200,null=True,blank=True)
	fileContent=models.TextField(null=True,blank=True)
	emailID=models.CharField(unique=True,max_length=50,blank=True,null=True)
	mobileNo=models.BigIntegerField(unique=True,blank=True,null=True)
	resume=models.FileField(upload_to='myapp2/resumes/',max_length=500)
	createdDate=models.DateTimeField(auto_now_add=True)
	modifiedDate=models.DateTimeField(auto_now=True)

	def __str__(self):
		return "RESUME "+str(self.resumeID)

class Keyword(models.Model):
	keywordID=models.AutoField(primary_key=True)
	keyword=models.CharField(unique=True,max_length=100)
	createdDate=models.DateTimeField(auto_now_add=True)
	modifiedDate=models.DateTimeField(auto_now=True)

	def __str__(self):
		return str(self.keyword)

class ZipFile(models.Model):		
	fileID=models.AutoField(primary_key=True)
	fileName=models.CharField(max_length=100)
	url=models.FileField(upload_to="myapp2/zippedResumes/",max_length=500)
	createdDate=models.DateTimeField(auto_now_add=True)
	modifiedDate=models.DateTimeField(auto_now_add=True)

	def __str__(self):
		return str(self.fileID)