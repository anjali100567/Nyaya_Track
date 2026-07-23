from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    FIRViewSet, CaseViewSet, EvidenceViewSet, HearingDateViewSet, AnalyticsView, 
    PublicFIRStatusView, BNSSectionPredictView,
    NotificationViewSet, FeedbackViewSet, RunEscalationsView, PublicCrimeTrendsView, AudioTranscriptionView,
    AIStationRecommendationView, DuplicateFIRCheckView, AIExtractFIRView
)

router = DefaultRouter()
router.register(r'firs', FIRViewSet, basename='fir')
router.register(r'cases', CaseViewSet, basename='case')
router.register(r'evidence', EvidenceViewSet, basename='evidence')
router.register(r'hearings', HearingDateViewSet, basename='hearing')
router.register(r'notifications', NotificationViewSet, basename='notification')
router.register(r'feedback', FeedbackViewSet, basename='feedback')

urlpatterns = [
    path('', include(router.urls)),
    path('analytics/', AnalyticsView.as_view(), name='analytics'),
    path('public/fir-status/<str:tracking_code>/', PublicFIRStatusView.as_view(), name='public-fir-status'),
    path('public/crime-trends/', PublicCrimeTrendsView.as_view(), name='public-crime-trends'),
    path('predict-section/', BNSSectionPredictView.as_view(), name='predict-section'),
    path('cron/run-escalations/', RunEscalationsView.as_view(), name='run-escalations'),
    path('transcribe-audio/', AudioTranscriptionView.as_view(), name='transcribe-audio'),
    path('recommend-station/', AIStationRecommendationView.as_view(), name='recommend-station'),
    path('check-duplicate-fir/', DuplicateFIRCheckView.as_view(), name='check-duplicate-fir'),
    path('ai-extract-fir/', AIExtractFIRView.as_view(), name='ai-extract-fir'),
]
