# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from rest_framework import viewsets,status
from django.shortcuts import render
from myapp2.models import *
from myapp2.serializers import *
from rest_framework.response import Response
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
import textract,os,re
from django.conf import settings
from rest_framework.views import APIView
import MySQLdb
from rest_framework.decorators import api_view
import json
import datetime
import shutil
import os,zipfile,tempfile,StringIO
from django.http import HttpResponse
from subprocess import call
from django.db.models import FileField
from django.db import IntegrityError

# from wsgiref.util import FileWrapper
# Create your views here.
class UploadResumeViewSet(viewsets.ModelViewSet):
	"""
	API endpoint that allows the user to upload an download resumes
	"""	
	queryset=Resume.objects.all()
	serializer_class=UploadResumeSerializer

	def create(self,request):
		data=request.data		
		serializer=UploadResumeSerializer(data=data)
		if serializer.is_valid():
			validatedData=serializer.validated_data
			file=validatedData.get('resume',None)
			if file!=None:
				try:
					filePath="myapp2/resumes/"+file.name
					# Saving the file in media folder
					path=default_storage.save(filePath,ContentFile(file.read()))
					# Get File content

					fileContent=self.getFileContent(path)
					(emailID,mobileNo)=self.getEmailIDAndMobileNo(fileContent)
					resumeInstance=Resume.objects.create(fileName=file.name,
															resume=path,
															fileContent=fileContent,
															emailID=emailID,
															mobileNo=mobileNo)

				except textract.exceptions.ShellError as e:
					return Response({"error":str(e),"fileName":file.name},status=status.HTTP_406_NOT_ACCEPTABLE)
				# Duplicate entry exception handling
				except IntegrityError as e:
				# Removing the saved files
					os.remove(settings.BASE_DIR+'/media/'+path)
					if emailID!=None:
						resumeID=Resume.objects.get(emailID=emailID).resumeID
						modifiedDate=Resume.objects.get(emailID=emailID).modifiedDate
					elif mobileNo!=None:
						resumeID=Resume.objects.get(mobileNo=mobileNo).resumeID
						modifiedDate=Resume.objects.get(mobileNo=mobileNo).modifiedDate
					else:
						resumeID=None
						modifiedDate=Resume.objects.get(fileName=file.name).modifiedDate
					return Response({"error":str(e),"resumeID":resumeID,"modifiedDate":modifiedDate,"fileName":file.name,"emailID":emailID,"mobileNo":mobileNo},status=status.HTTP_409_CONFLICT)
				# Any other exception
				except Exception as e:
					return Response({"error":str(e),"fileName":file.name},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
				return Response(UploadResumeSerializer(resumeInstance).data,status=status.HTTP_201_CREATED)
			else:
				return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
		else:
			return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)


	

	def getFileContent(self,filePath):
		filePath=settings.BASE_DIR+'/media/'+filePath
		text=None
		text=textract.process(filePath)
		text=text.decode('utf-8')
		return text

	def getEmailIDAndMobileNo(self,fileContent):
		emailRegex="[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}"
		mobileNoRegex="[789]\d{9}"
		emails=re.findall(emailRegex,fileContent)
		emails=[None] if len(emails)==0 else emails
		mobiles=re.findall(mobileNoRegex,fileContent)
		mobiles=[None] if len(mobiles)==0 else mobiles
		return (emails[0],mobiles[0])

	def update(self,request,pk):
		resumeObject= Resume.objects.get(resumeID=pk)
		oldPath=resumeObject.resume
		#Removing the old file in media folder
		oldPath=str(oldPath)
		if os.path.exists(settings.BASE_DIR+'/media/'+oldPath):
			os.remove(settings.BASE_DIR+'/media/'+oldPath)
		data=request.data
		serializer=UploadResumeSerializer(data=data)
		if serializer.is_valid():
			validatedData=serializer.validated_data
			file=validatedData.get('resume',None)
			if file!=None:
				filePath="myapp2/resumes/"+file.name
				# Saving the file in media folder
				path=default_storage.save(filePath,ContentFile(file.read()))
				# Get File content
				try:
					fileContent=self.getFileContent(path)
					(emailID,mobileNo)=self.getEmailIDAndMobileNo(fileContent)
					if os.path.exists(settings.BASE_DIR+'/media/'+path):
						os.remove(settings.BASE_DIR+'/media/'+path)
					resumeInstance=Resume.objects.get(resumeID=pk)
					resumeInstance.fileName=validatedData.pop('fileName',file)
					resumeInstance.resume=validatedData.pop('resume',filePath)
					resumeInstance.fileContent=validatedData.pop('fileContent',fileContent)
					resumeInstance.emailID=validatedData.pop('emailID',emailID)
					resumeInstance.mobileNo=validatedData.pop('mobileNo',mobileNo)
					resumeInstance.save()
					return Response(UploadResumeSerializer(resumeInstance).data,status=status.HTTP_200_OK)
				except textract.exceptions.ShellError as e:
					return Response({"error":str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
			else:
				return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
		else:
			return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)


class ResumeSearch(APIView):
	def post(self,request):
		data =request.data
		searchQuery=data.get('searchQuery',None)
		if searchQuery!=None:
			if self.validateSearchQuery(searchQuery)==True:
				self.extractKeywordsFromQuery(searchQuery)
				try:
					searchQuery=string.replace(searchQuery, ' or ',' | ')
					searchQuery=string.replace(searchQuery, ' OR ',' | ')
					searchQuery=string.replace(searchQuery,' and ',' ')
					searchQuery=string.replace(searchQuery,' AND ',' ')
					searchQuery=string.replace(searchQuery, ' not ',' ! ')
					searchQuery=string.replace(searchQuery, ' NOT ',' ! ')
					response=self.sphinxSearch(searchQuery)
				except Exception as e:
					return Response({"error":str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
				else:
					return Response(response,status=status.HTTP_200_OK)
			else:
				return Response({"error":"Invalid search query!"},status=status.HTTP_400_BAD_REQUEST)
		else:
			return Response({},status=status.HTTP_400_BAD_REQUEST)

	def validateSearchQuery(self,string):
		if not string:
			return False
		else:
			openingBrackets=['{','(','[']
			closingBrackets=['}',')',']']
			quotes=['"','\'']
			mapper={
				'}':'{',
				')':'(',
				']':'['
			}
			stack=[]
			string=list(string)
			quoteCount=0
			for letter in string:
			# Validating Quotes
				if (letter in quotes) and quoteCount%2==0:
					stack.append(letter)
					quoteCount=1
				elif (letter in quotes) and quoteCount%2==1:
					if len(stack)>0:
						if stack.pop()==letter:
							quoteCount=0
						else:
							return False
					else:
						return False
			# Validating brackets
				if letter in openingBrackets:
					stack.append(letter)
				elif letter in closingBrackets:
					if len(stack)>0:
						if stack.pop()==mapper.get(letter):
							pass
						else:
							return False
					else:
						return False
			if len(stack)>0:
				return False
			return True

	def extractKeywordsFromQuery(self,searchQuery):
		searchQuery=string.replace(searchQuery, ' or ',' | ')
		searchQuery=string.replace(searchQuery, ' OR ',' | ')
		searchQuery=string.replace(searchQuery,' and ',' ')
		searchQuery=string.replace(searchQuery,' AND ',' ')
		searchQuery=string.replace(searchQuery, ' not ',' ! ')
		searchQuery=string.replace(searchQuery, ' NOT ',' ! ')
		keyWord=[]
		keyWord=re.findall(r"[\"\'].+[\"\']|[A-Za-z]+[+-0-9]*[^)!|\s]",str(searchQuery))
		finalkeywords=[]
		keyWordJson=[]
		for item in keyWord :
			item=string.replace(item,'"',"")
			try:
				keywordInstance=Keyword.objects.create(keyword=item)
			except Exception as e:
				pass
			else :
				finalkeywords.append(item)

	def sphinxSearch(self,searchQuery):
		db=MySQLdb.connect(host="0.0.0.0", 
		   user="root",
		   passwd="root",
		   db="candexresumes",
		   port=9306) 
		# Create a cursor object to execute queries
		cursor=db.cursor()
		#using of SQL we need
		limit=200
		cursor.execute("SELECT *,weight() FROM candexresumes where match('"+searchQuery+"') limit 0,"+str(limit))
		records=cursor.fetchall()
		searchResult={}
		searchResult['results']=[]
		for record in records:
			recordDict={
				"resumeID":record[0],
				"emailID":record[1],
				"mobileNo":record[2],
				"resumeURL":record[3],
				"createdYear":record[4],
				"weight":record[5]
			}
			searchResult['results'].append(recordDict)
		return searchResult

	def get(self,keyword):
		k=Keyword.objects.all()
		keywords=[]
		for i in k:
			key=i.keyword		
			keywords.append(key)
		data={'result':keywords}
		return Response(data,status=status.HTTP_200_OK)

class ZipResumes(APIView):
	
 	def post(self,request):
 		filepath=0
		data=request.data
 		filePaths=data.get('filePaths',None)
 		searchQuery=data.get('searchQuery',None)
 		finalword=str(searchQuery)
 		fileName="resumes_"
 		extension=".zip"
 		now= datetime.datetime.now()
 		todayDate=now.strftime("%Y-%m-%d")
 		zipFileName=fileName+todayDate+extension
		# Checks if the zipppedResumes folder exists
		zipPath=settings.BASE_DIR+'/media/myapp2/zippedResumes/'
		if os.path.exists(zipPath)==False:
			os.mkdir(zipPath)
		zipPath=zipPath+zipFileName
		text_file = open("0-SearchQuery.txt", "w")
		text_file.write(finalword)
		text_file.close()
		zf = zipfile.ZipFile(zipPath,"w")
		zf.write("0-SearchQuery.txt")
		os.remove("0-SearchQuery.txt")
		zipFileInstance=ZipFile.objects.create(fileName=zipFileName,url=zipPath)
		index=1
		for filePath in filePaths:
			filePath=settings.BASE_DIR+filePath
			fileDir,fileName = os.path.split(filePath)
			fileName=str(index)+'-'+fileName
			zipPath = os.path.join(fileName)
			zf.write(filePath, zipPath)
			index+=1
		zf.close()
		z=ZipFile.objects.all()
		zipFilePath=z[0].url
		test = str(zipFilePath)
		data = {}
		data['result'] = str(test)
		return Response(data['result'],status=status.HTTP_200_OK)
	def delete(self,request):
		zipObject=ZipFile.objects.all()
		zipObject.delete()
		if os.path.exists(settings.BASE_DIR+'/media/myapp2/zippedResumes'):
			shutil.rmtree(settings.BASE_DIR+'/media/myapp2/zippedResumes')
		return Response("success")

class SphinxIndexer(APIView):

	def get(self,request):
		try:# Indexing all the resumes for sphinx
			call(['indexer','candexresumes','--rotate'])
			return Response({"success":True},status=status.HTTP_200_OK)
		except Exception as e:
			return Response({"success":False},status=status.HTTP_503_SERVICE_UNAVAILABLE)		
		
	
class ResumesCount(APIView):

	def get(self,request):
		count=len(Resume.objects.all())
		data={}
		data['count']=count
		return Response(data,status=status.HTTP_200_OK)

	
			
