from rest_framework.views import APIView
from django.core.mail import send_mail,EmailMessage
from django.conf import settings
from rest_framework.response import Response
from django.utils.html import format_html,html_safe,escape
from django.utils.safestring import mark_safe
from django.template.loader import render_to_string
from django.template import loader
from django.core.files import File
from myapp.models import EmailTemplates
from rest_framework import status


# @csrf_exempt
class SendMail(APIView):

    def post(self,request):
        if(request.GET.get('mailType')=='new'):
            deliveredMails=self.sendComposedMail(request.data)
        else:
            deliveredMails=self.sendMail(request.data)
        if(deliveredMails>=1):
            return Response(None,status=status.HTTP_200_OK)
        elif(deliveredMails==0):
            return Response(None,status=status.HTTP_400_BAD_REQUEST)


    def sendComposedMail(self,data):
        templateData=None
        from_email=data.get('from')
        to=data.get('to')
        recipients=[to]
        cc=data.get('cc')
        subject=data.get('subject')
        body=data.get('body')
        to=[to]
        if(subject!=None and body!=None and to!=None):
            with open('myapp/templates/myapp/email.html','w') as f:
                myFile=File(f)
                myFile.write(body)
            html_message=render_to_string('myapp/email.html')
            deliveredMails=send_mail(subject,'', from_email, to , fail_silently=False,html_message=html_message)
            return deliveredMails
        else:
            return 0


    def sendMail(self,data):
        html_message=None
        templateData=data.get('templateData',None)
        templateData=self.flattenTemplateData(templateData)
        templateName=data.get('templateName',None)
        recipients=data.get('recipients',None)
        recipients=[recipients]
        subject,body=self.get_Body_Subject(templateName)
        if(subject!=None and body!=None and templateData!=None):
            with open('myapp/templates/myapp/email.html','w') as f:
                myFile=File(f)
                myFile.write(body)
            header=render_to_string('myapp/header.html')
            content=render_to_string('myapp/email.html',templateData)
            footer=render_to_string('myapp/footer.html')
            html_message=header+content+footer
            deliveredMails=send_mail(subject,'', "TeamCandEx@viasat.com",recipients, fail_silently=False,html_message=html_message)
            return deliveredMails
        else:
            return 0    

    def get_Body_Subject(self,templateName):
        if(templateName!=None):
            template=EmailTemplates.objects.get(templateName=templateName)
            return(template.emailSubject,template.emailBody)
        else:
            return(None,None)           


    def flattenTemplateData(self,templateData):
        def items():
            for key,value in templateData.items():
                if isinstance(value,dict):
                    for subKey,subValue in self.flattenTemplateData(value).items():
                        if(subKey=='createdDate' or subKey=='modifiedDate'):
                            pass
                        else:
                            yield subKey,subValue
                else:
                    if(key=='createdDate' or key=='modifiedDate'):
                        pass
                    else:
                        yield key,value
        return dict(items())