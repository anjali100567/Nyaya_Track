from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import User, Station, FIR, Case, Evidence, HearingDate
from .serializers import (
    UserSerializer, StationSerializer, FIRSerializer,
    CaseSerializer, EvidenceSerializer, HearingDateSerializer,
    PublicFIRSerializer
)
from .permissions import IsOwnerCitizen, IsAssignedOfficer, IsStationAdmin

# Combined permission for typical role-based object access
RoleBasedObjectPermission = IsOwnerCitizen | IsAssignedOfficer | IsStationAdmin

class FIRViewSet(viewsets.ModelViewSet):
    serializer_class = FIRSerializer
    permission_classes = [permissions.IsAuthenticated, RoleBasedObjectPermission]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'citizen':
            return FIR.objects.filter(citizen=user)
        elif user.role == 'officer':
            return FIR.objects.filter(case__assigned_officer=user)
        elif user.role == 'admin':
            if user.station:
                return FIR.objects.filter(station=user.station)
            return FIR.objects.all()
        return FIR.objects.none()

    def perform_create(self, serializer):
        serializer.save(citizen=self.request.user)

    @action(detail=True, methods=['get'])
    def qr(self, request, pk=None):
        import qrcode
        import io
        from django.http import HttpResponse
        from rest_framework.reverse import reverse

        fir = self.get_object()
        if not fir.tracking_code:
            return Response({"error": "Tracking code not generated yet"}, status=status.HTTP_400_BAD_REQUEST)
        
        public_url = request.build_absolute_uri(reverse('public-fir-status', kwargs={'tracking_code': fir.tracking_code}))
        
        img = qrcode.make(public_url)
        buf = io.BytesIO()
        img.save(buf, format='PNG')
        buf.seek(0)
        return HttpResponse(buf, content_type='image/png')

class CaseViewSet(viewsets.ModelViewSet):
    serializer_class = CaseSerializer
    permission_classes = [permissions.IsAuthenticated, RoleBasedObjectPermission]
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'citizen':
            return Case.objects.filter(fir__citizen=user)
        elif user.role == 'officer':
            return Case.objects.filter(assigned_officer=user)
        elif user.role == 'admin':
            if user.station:
                return Case.objects.filter(fir__station=user.station)
            return Case.objects.all()
        return Case.objects.none()

    @action(detail=True, methods=['post'])
    def assign(self, request, pk=None):
        case = self.get_object()
        
        # Only admins should assign cases
        if request.user.role != 'admin':
            return Response({"error": "Only admins can assign cases"}, status=status.HTTP_403_FORBIDDEN)
            
        officer_id = request.data.get('officer_id')
        if not officer_id:
            return Response({"error": "officer_id is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            officer = User.objects.get(id=officer_id, role='officer')
        except User.DoesNotExist:
            return Response({"error": "Valid officer not found"}, status=status.HTTP_404_NOT_FOUND)

        case.assigned_officer = officer
        case.save()
        return Response({"status": "Officer assigned successfully"})

class EvidenceViewSet(viewsets.ModelViewSet):
    serializer_class = EvidenceSerializer
    permission_classes = [permissions.IsAuthenticated, RoleBasedObjectPermission]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'citizen':
            return Evidence.objects.filter(fir__citizen=user)
        elif user.role == 'officer':
            return Evidence.objects.filter(fir__case__assigned_officer=user)
        elif user.role == 'admin':
            if user.station:
                return Evidence.objects.filter(fir__station=user.station)
            return Evidence.objects.all()
        return Evidence.objects.none()

    def perform_create(self, serializer):
        serializer.save(uploaded_by=self.request.user)

class HearingDateViewSet(viewsets.ModelViewSet):
    serializer_class = HearingDateSerializer
    permission_classes = [permissions.IsAuthenticated, RoleBasedObjectPermission]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'citizen':
            return HearingDate.objects.filter(case__fir__citizen=user)
        elif user.role == 'officer':
            return HearingDate.objects.filter(case__assigned_officer=user)
        elif user.role == 'admin':
            if user.station:
                return HearingDate.objects.filter(case__fir__station=user.station)
            return HearingDate.objects.all()
        return HearingDate.objects.none()

from django.db.models import Count
from django.utils import timezone
from rest_framework.views import APIView
from .permissions import IsAdmin
from django.shortcuts import get_object_or_404

class PublicFIRStatusView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, tracking_code):
        fir = get_object_or_404(FIR, tracking_code=tracking_code)
        serializer = PublicFIRSerializer(fir)
        return Response(serializer.data)

from .ai_utils import suggest_sections

class BNSSectionPredictView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        description = request.data.get('description')
        if not description:
            return Response({"error": "Description is required"}, status=status.HTTP_400_BAD_REQUEST)

        suggestions = suggest_sections(description)
        
        return Response({
            "suggestions": suggestions,
            "disclaimer": "Suggested by AI — not legal advice. Final section to be confirmed by the investigating officer."
        })

class AnalyticsView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsAdmin]

    def get(self, request):
        user = request.user
        
        if user.station:
            firs = FIR.objects.filter(station=user.station)
            cases = Case.objects.filter(fir__station=user.station)
        else:
            firs = FIR.objects.all()
            cases = Case.objects.all()

        status_counts = firs.values('status').annotate(count=Count('id'))
        
        disposed_firs = firs.filter(status='disposed')
        total_days = 0
        disposed_count = disposed_firs.count()
        if disposed_count > 0:
            for fir in disposed_firs:
                if hasattr(fir, 'case'):
                    days = (fir.case.last_updated - fir.created_at).days
                    total_days += days
            avg_resolution_days = total_days / disposed_count
        else:
            avg_resolution_days = 0

        active_cases = cases.exclude(fir__status='disposed')
        now = timezone.now()
        risk_data = []
        for case in active_cases:
            days_inactive = (now - case.last_updated).days
            risk_level = "Low"
            if days_inactive > 30:
                risk_level = "High"
            elif days_inactive > 15:
                risk_level = "Medium"
                
            risk_data.append({
                "case_id": case.id,
                "fir_number": case.fir.fir_number,
                "days_inactive": days_inactive,
                "risk_level": risk_level
            })

        return Response({
            "status_counts": status_counts,
            "avg_resolution_days": avg_resolution_days,
            "delay_risk_analysis": risk_data
        })
