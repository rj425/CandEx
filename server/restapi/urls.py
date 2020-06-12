"""restapi URL Configuration
The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/dev/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.contrib import admin
admin.autodiscover()

from django.conf.urls import url, include
from rest_framework import routers
from rest_framework.authtoken import views as rest_framework_views
from myapp.views import masterViews,emailViews, requestViews, userViews ,candidateViews,chartViews
from myapp import views
from myapp2 import views as views2
from django.conf import settings
from django.conf.urls.static import static

router = routers.DefaultRouter()
router.register(r'users', userViews.UserViewSet)
router.register(r'groups', userViews.GroupViewSet)
router.register(r'permissions', userViews.PermissionViewSet)

router.register(r'sources', masterViews.SourceViewSet)
router.register(r'courses', masterViews.CourseViewSet)
router.register(r'skills', masterViews.SkillsViewSet)
router.register(r'emailTemplates',masterViews.EmailTemplatesViewSet)
router.register(r'institutions',masterViews.EducationalInstitutionViewSet)
router.register(r'panelMembersDirectory',masterViews.PanelMembersDirectoryViewSet)
router.register(r'department',masterViews.DepartmentViewSet)
router.register(r'designation',masterViews.DesignationViewSet)
router.register(r'position',masterViews.PositionViewSet)
router.register(r'engagementActions',masterViews.EngagementActionsViewSet)

router.register(r'requests',requestViews.RequestViewSet)
router.register(r'candidates',candidateViews.CandidateViewSet)
router.register(r'candidateFeedback',candidateViews.CandidateFeedbackViewSet)
router.register(r'candidatePersonal',candidateViews.CandidatePersonalViewSet)
router.register(r'candidateEducation',candidateViews.CandidateEducationViewSet)
router.register(r'candidateProfessional',candidateViews.CandidateProfessionalViewSet)
router.register(r'candidateProcess',candidateViews.CandidateProcessViewSet)
router.register(r'candidateOffer',candidateViews.CandidateOfferViewSet)
router.register(r'candidateCost',candidateViews.CandidateCostViewSet)
router.register(r'candidateSkills',candidateViews.CandidateSkillViewSet)
router.register(r'panellist',candidateViews.PanellistViewSet)
router.register(r'interviewRound',candidateViews.InterviewRoundViewSet)
router.register(r'interviewLevel',candidateViews.InterviewLevelViewSet)
router.register(r'resumes',candidateViews.ResumeViewSet)
router.register(r'candidateEngagement',candidateViews.CandidateEngagementViewSet),
router.register(r'uploadResume',views2.UploadResumeViewSet),
# router.register(r'resume/download/',views2.DownloadResumeViewSet),

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    url(r'^', include(router.urls)),
    url(r'^admin/', admin.site.urls),
    url(r'^authToken/',rest_framework_views.obtain_auth_token),
    url(r'^sendmail/', emailViews.SendMail.as_view()),

    url(r'^chartRequests/',chartViews.CandidatesOrderedByRequests.as_view()),
    url(r'^sourceGenderGeoMix/',chartViews.SourceGenderGeoMix.as_view()),
    url(r'^returnRequests/',chartViews.returnRequests.as_view()),
    url(r'^costPerHire/',chartViews.CostPerHire.as_view()),
    url(r'^noticePeriod/',chartViews.NoticePeriod.as_view()),
    url(r'^employerReport/',chartViews.EmployerReport.as_view()),
    url(r'^educationReport/',chartViews.EducationReport.as_view()),
    url(r'^requestAgeing/',chartViews.RequestionAgeing.as_view()),
    url(r'^futureStarts/',chartViews.FutureStarts.as_view()),
    url(r'^weeklyInterviews/',chartViews.WeeklyInterviewHours.as_view()),
    url(r'^processTime/',chartViews.ProcessTimeAtEachLevel.as_view()),
    url(r'^currentWeekInterviews',chartViews.CurrentWeekInterviews.as_view()),
    url(r'^basicMetrics/',chartViews.BasicMetrics.as_view()),  
    
    url(r'^changePassword/',userViews.ChangePassword.as_view()),
    url(r'^getUser/',views.getUser),
    url(r'^authUser/',userViews.AuthenticateUser.as_view()),
    url(r'^searchResume/',views2.ResumeSearch.as_view()),
    url(r'^resume/zip/',views2.ZipResumes.as_view()),
    url(r'^indexResumes/',views2.SphinxIndexer.as_view()),
    url(r'^resumesCount/',views2.ResumesCount.as_view())
   

    # url(r'^candexJobs/',candexBatchJobs.CandexBatchJobs.as_view()),



]
# if settings.DEBUG:
#     urlpatterns +=patterns('',
#         (r'^resume/download/(?P<path>.*)$','django.views.static.serve',   {'document_root':'/path/to/media'}
#     )
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)