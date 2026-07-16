from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FIRViewSet, CaseViewSet, EvidenceViewSet, HearingDateViewSet, AnalyticsView

router = DefaultRouter()
router.register(r'firs', FIRViewSet, basename='fir')
router.register(r'cases', CaseViewSet, basename='case')
router.register(r'evidence', EvidenceViewSet, basename='evidence')
router.register(r'hearings', HearingDateViewSet, basename='hearing')

urlpatterns = [
    path('', include(router.urls)),
    path('analytics/', AnalyticsView.as_view(), name='analytics'),
]
