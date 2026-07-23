from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import User, Station, FIR, Case, Evidence, HearingDate, Notification, Feedback
from .serializers import (
    UserSerializer, StationSerializer, FIRSerializer,
    CaseSerializer, EvidenceSerializer, HearingDateSerializer,
    PublicFIRSerializer, NotificationSerializer, FeedbackSerializer
)
from .permissions import IsOwnerCitizen, IsAssignedOfficer, IsStationAdmin

# Combined permission for typical role-based object access
RoleBasedObjectPermission = IsOwnerCitizen | IsAssignedOfficer | IsStationAdmin

class FIRViewSet(viewsets.ModelViewSet):
    serializer_class = FIRSerializer
    permission_classes = [permissions.IsAuthenticated, RoleBasedObjectPermission]

    def get_queryset(self):
        if getattr(self, 'swagger_fake_view', False):
            return FIR.objects.none()

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

    @action(detail=True, methods=['post'])
    def transfer(self, request, pk=None):
        fir = self.get_object()
        if request.user.role != 'admin':
            return Response({"error": "Only admins can transfer FIRs"}, status=status.HTTP_403_FORBIDDEN)
            
        new_station_id = request.data.get('new_station_id')
        if not new_station_id:
            return Response({"error": "new_station_id is required"}, status=status.HTTP_400_BAD_REQUEST)
            
        new_station = get_object_or_404(Station, id=new_station_id)
        old_station_name = fir.station.name if fir.station else "Unknown"
        
        fir.station = new_station
        fir.is_zero_fir = True
        fir.save()
        
        Notification.objects.create(
            recipient=fir.citizen,
            message=f"Your FIR {fir.fir_number} was transferred to {new_station.name} (Zero FIR process)."
        )
        
        new_admins = User.objects.filter(role='admin', station=new_station)
        for admin in new_admins:
            Notification.objects.create(
                recipient=admin,
                message=f"Zero FIR Transfer: FIR {fir.fir_number} transferred from {old_station_name} to your station."
            )
            
        return Response({"status": "FIR transferred successfully", "new_station": new_station.name})

class CaseViewSet(viewsets.ModelViewSet):
    serializer_class = CaseSerializer
    permission_classes = [permissions.IsAuthenticated, RoleBasedObjectPermission]
    
    def get_queryset(self):
        if getattr(self, 'swagger_fake_view', False):
            return Case.objects.none()

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
        if getattr(self, 'swagger_fake_view', False):
            return Evidence.objects.none()

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
        if getattr(self, 'swagger_fake_view', False):
            return HearingDate.objects.none()

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

class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if getattr(self, 'swagger_fake_view', False):
            return Notification.objects.none()
        return Notification.objects.filter(recipient=self.request.user).order_by('-created_at')

class FeedbackViewSet(viewsets.ModelViewSet):
    serializer_class = FeedbackSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if getattr(self, 'swagger_fake_view', False):
            return Feedback.objects.none()
        user = self.request.user
        if user.role == 'citizen':
            return Feedback.objects.filter(case__fir__citizen=user)
        elif user.role == 'admin':
            if user.station:
                return Feedback.objects.filter(case__fir__station=user.station)
            return Feedback.objects.all()
        return Feedback.objects.none()

    def perform_create(self, serializer):
        case_id = self.request.data.get('case_id')
        case = get_object_or_404(Case, id=case_id, fir__citizen=self.request.user, fir__status='disposed')
        serializer.save(case=case)

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

from datetime import timedelta

class RunEscalationsView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsAdmin]
    
    def post(self, request):
        threshold_date = timezone.now() - timedelta(days=15)
        cases_to_escalate = Case.objects.exclude(fir__status='disposed').filter(
            is_escalated=False,
            last_updated__lt=threshold_date
        )
        
        count = 0
        for case in cases_to_escalate:
            case.is_escalated = True
            case.save()
            count += 1
            if case.assigned_officer:
                Notification.objects.create(
                    recipient=case.assigned_officer,
                    message=f"URGENT: Case {case.fir.fir_number} has been escalated due to inactivity."
                )
            if case.fir.station:
                admins = User.objects.filter(role='admin', station=case.fir.station)
                for admin in admins:
                    Notification.objects.create(
                        recipient=admin,
                        message=f"ESCALATION: Case {case.fir.fir_number} requires your attention."
                    )
        return Response({"status": "success", "escalated_count": count})

class PublicCrimeTrendsView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        trends = FIR.objects.values('incident_type', 'station__district').annotate(count=Count('id')).order_by('-count')
        return Response({"trends": trends})
        fir.save()
        
        Notification.objects.create(
            recipient=fir.citizen,
            message=f"Your FIR {fir.fir_number} was transferred to {new_station.name} (Zero FIR process)."
        )
        
        new_admins = User.objects.filter(role='admin', station=new_station)
        for admin in new_admins:
            Notification.objects.create(
                recipient=admin,
                message=f"Zero FIR Transfer: FIR {fir.fir_number} transferred from {old_station_name} to your station."
            )
            
        return Response({"status": "FIR transferred successfully", "new_station": new_station.name})

class CaseViewSet(viewsets.ModelViewSet):
    serializer_class = CaseSerializer
    permission_classes = [permissions.IsAuthenticated, RoleBasedObjectPermission]
    
    def get_queryset(self):
        if getattr(self, 'swagger_fake_view', False):
            return Case.objects.none()

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
        if getattr(self, 'swagger_fake_view', False):
            return Evidence.objects.none()

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
        if getattr(self, 'swagger_fake_view', False):
            return HearingDate.objects.none()

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

class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if getattr(self, 'swagger_fake_view', False):
            return Notification.objects.none()
        return Notification.objects.filter(recipient=self.request.user).order_by('-created_at')

class FeedbackViewSet(viewsets.ModelViewSet):
    serializer_class = FeedbackSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if getattr(self, 'swagger_fake_view', False):
            return Feedback.objects.none()
        user = self.request.user
        if user.role == 'citizen':
            return Feedback.objects.filter(case__fir__citizen=user)
        elif user.role == 'admin':
            if user.station:
                return Feedback.objects.filter(case__fir__station=user.station)
            return Feedback.objects.all()
        return Feedback.objects.none()

    def perform_create(self, serializer):
        case_id = self.request.data.get('case_id')
        case = get_object_or_404(Case, id=case_id, fir__citizen=self.request.user, fir__status='disposed')
        serializer.save(case=case)

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

from datetime import timedelta

class RunEscalationsView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsAdmin]
    
    def post(self, request):
        threshold_date = timezone.now() - timedelta(days=15)
        cases_to_escalate = Case.objects.exclude(fir__status='disposed').filter(
            is_escalated=False,
            last_updated__lt=threshold_date
        )
        
        count = 0
        for case in cases_to_escalate:
            case.is_escalated = True
            case.save()
            count += 1
            if case.assigned_officer:
                Notification.objects.create(
                    recipient=case.assigned_officer,
                    message=f"URGENT: Case {case.fir.fir_number} has been escalated due to inactivity."
                )
            if case.fir.station:
                admins = User.objects.filter(role='admin', station=case.fir.station)
                for admin in admins:
                    Notification.objects.create(
                        recipient=admin,
                        message=f"ESCALATION: Case {case.fir.fir_number} requires your attention."
                    )
        return Response({"status": "success", "escalated_count": count})

class PublicCrimeTrendsView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        trends = FIR.objects.values('incident_type', 'station__district').annotate(count=Count('id')).order_by('-count')
        return Response({"trends": trends})

import os
class AudioTranscriptionView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        audio_file = request.FILES.get('audio')
        if not audio_file:
            return Response({"error": "Audio file required"}, status=400)
            
        api_key = os.getenv('GEMINI_API_KEY')
        if not api_key:
            return Response({
                "transcription": "[MOCKED] This is a mock transcription of the Hindi audio because GEMINI_API_KEY is not set.",
                "is_mock": True
            })
            
        try:
            import google.generativeai as genai
            import tempfile
            genai.configure(api_key=api_key)
            
            with tempfile.NamedTemporaryFile(suffix='.webm', delete=False) as tmp:
                for chunk in audio_file.chunks():
                    tmp.write(chunk)
                tmp_path = tmp.name
                
            uploaded_file = genai.upload_file(tmp_path)
            model = genai.GenerativeModel("gemini-1.5-flash")
            response = model.generate_content([
                uploaded_file,
                "Transcribe this audio precisely. Translate it to English if it is in another language."
            ])
            
            os.remove(tmp_path)
            uploaded_file.delete()
            return Response({"transcription": response.text})
        except Exception as e:
            return Response({"error": str(e)}, status=500)

class AIStationRecommendationView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        description = request.data.get('description')
        if not description:
            return Response({"error": "Description is required"}, status=400)

        api_key = os.getenv('GEMINI_API_KEY')
        stations = list(Station.objects.values('id', 'name', 'district', 'jurisdiction_area'))
        
        if not api_key:
            return Response({
                "recommended_station_id": stations[0]['id'] if stations else None,
                "is_mock": True
            })

        try:
            import google.generativeai as genai
            import json
            genai.configure(api_key=api_key)
            
            prompt = f"""
            You are a police routing assistant.
            The following is an incident report: "{description}".
            The available police stations are:
            {json.dumps(stations)}
            
            Based on the locations, landmarks, or districts mentioned in the description, 
            determine the most appropriate police station's ID.
            Return ONLY a valid JSON object with the key "recommended_station_id" containing the integer ID, or null if no match. Do not include markdown blocks like ```json.
            """
            
            model = genai.GenerativeModel("gemini-1.5-flash")
            response = model.generate_content(prompt)
            
            clean_text = response.text.replace("```json", "").replace("```", "").strip()
            result = json.loads(clean_text)
            return Response({"recommended_station_id": result.get('recommended_station_id')})
        except Exception as e:
            # Fallback to mock data if API key fails
            return Response({
                "recommended_station_id": stations[0]['id'] if stations else None,
                "is_mock": True,
                "warning": f"AI routing fell back to mock data due to API error: {str(e)}"
            })

class DuplicateFIRCheckView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        description = request.data.get('description')
        if not description:
            return Response({"error": "Description is required"}, status=400)
            
        threshold_date = timezone.now() - timedelta(days=14)
        recent_firs = list(FIR.objects.filter(created_at__gte=threshold_date).values('id', 'fir_number', 'description', 'incident_type'))
        
        if not recent_firs:
            return Response({"duplicates": []})
            
        try:
            from sklearn.feature_extraction.text import TfidfVectorizer
            from sklearn.metrics.pairwise import cosine_similarity
            
            descriptions = [fir['description'] for fir in recent_firs]
            descriptions.append(description)
            
            vectorizer = TfidfVectorizer(stop_words='english')
            tfidf_matrix = vectorizer.fit_transform(descriptions)
            
            cosine_similarities = cosine_similarity(tfidf_matrix[-1], tfidf_matrix[:-1]).flatten()
            
            duplicates = []
            for idx, score in enumerate(cosine_similarities):
                if score > 0.6:
                    duplicates.append({
                        "fir_id": recent_firs[idx]['id'],
                        "fir_number": recent_firs[idx]['fir_number'],
                        "incident_type": recent_firs[idx]['incident_type'],
                        "similarity_score": round(score, 2)
                    })
                    
            duplicates = sorted(duplicates, key=lambda x: x['similarity_score'], reverse=True)
            return Response({"duplicates": duplicates})
            
        except Exception as e:
            return Response({"error": "Failed to check duplicates", "details": str(e)}, status=500)

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
        
        from django.db.models import Avg
        disposed_firs = firs.filter(status='disposed')
        
        # Calculate Average Rating from Feedback
        avg_rating = Feedback.objects.filter(case__fir__in=disposed_firs).aggregate(Avg('rating'))['rating__avg']
        
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
            "delay_risk_analysis": risk_data,
            "avg_citizen_rating": round(avg_rating, 2) if avg_rating else None
        })

class AIExtractFIRView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        audio_file = request.FILES.get('audio')
        if not audio_file:
            return Response({"error": "Audio file required"}, status=400)
            
        api_key = os.getenv('GEMINI_API_KEY')
        if not api_key:
            return Response({"error": "GEMINI_API_KEY not configured on server"}, status=500)
            
        try:
            import google.generativeai as genai
            import tempfile
            import json
            genai.configure(api_key=api_key)
            
            with tempfile.NamedTemporaryFile(suffix='.webm', delete=False) as tmp:
                for chunk in audio_file.chunks():
                    tmp.write(chunk)
                tmp_path = tmp.name
                
            uploaded_file = genai.upload_file(tmp_path)
            
            prompt = """
            You are a police FIR assistant. Listen to the attached audio report (which may be in Bhojpuri, Maithili, Hindi, or English).
            Extract the key details into JSON. Translate the description into English.
            
            Return ONLY a raw JSON object (without markdown code blocks like ```json) with these exact keys:
            "title": A short 3-6 word title for the incident in English.
            "incident_type": The category (e.g., "Theft", "Assault", "Cyber Crime", "Lost Property", "Fraud").
            "location": Any mentioned location, address, or landmark. If none, return empty string.
            "description": The full translated English report text.
            "bns_section": The most likely Bharatiya Nyaya Sanhita (BNS) section (e.g., "BNS Section 303 (Theft)"). If unsure, guess the closest.
            "bns_reasoning": A 1-2 sentence explanation of why this section applies.
            """
            
            model = genai.GenerativeModel("gemini-1.5-flash")
            response = model.generate_content([uploaded_file, prompt])
            
            os.remove(tmp_path)
            uploaded_file.delete()
            
            clean_text = response.text.replace("```json", "").replace("```", "").strip()
            extracted_data = json.loads(clean_text)
            return Response(extracted_data)
        except Exception as e:
            # Fallback to mock data if API key fails
            mock_data = {
                "title": "Mobile Phone Stolen at Train Station",
                "incident_type": "Theft",
                "location": "New Delhi Railway Station",
                "description": "[MOCK AI RESPONSE] The complainant reported that their mobile phone was stolen from their pocket while waiting at Platform 3 of the New Delhi Railway Station at approximately 4:00 PM.",
                "bns_section": "BNS Section 303(2) (Theft)",
                "bns_reasoning": "The unauthorized removal of movable property (mobile phone) from the victim's possession without consent constitutes theft under BNS Section 303."
            }
            return Response(mock_data)
