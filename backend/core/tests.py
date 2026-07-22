from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from .models import User, Station, FIR
import uuid

class DemoFeaturesTests(APITestCase):
    def setUp(self):
        self.station = Station.objects.create(name="Test Station", district="Central", jurisdiction_area="Downtown")
        self.citizen = User.objects.create(username="citizen1", role="citizen")
        
        self.fir = FIR.objects.create(
            citizen=self.citizen,
            station=self.station,
            incident_type="Theft",
            date="2026-07-22T10:00:00Z",
            location="Market",
            description="Someone stole my bag.",
            status="filed"
        )
        self.client.force_authenticate(user=self.citizen)

    def test_qr_code_generation_success(self):
        # Ensure tracking_code is set
        self.assertIsNotNone(self.fir.tracking_code)
        
        # Test qr code endpoint
        url = reverse('fir-qr', kwargs={'pk': self.fir.pk})
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response['Content-Type'], 'image/png')

    def test_qr_code_generation_unauthenticated(self):
        self.client.force_authenticate(user=None)
        url = reverse('fir-qr', kwargs={'pk': self.fir.pk})
        response = self.client.get(url)
        
        # Should be forbidden for unauthenticated
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_public_fir_status_success(self):
        url = reverse('public-fir-status', kwargs={'tracking_code': self.fir.tracking_code})
        # Note: public endpoint allows any, we can drop auth
        self.client.force_authenticate(user=None)
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'filed')
        self.assertIn('status_explainer', response.data)
        self.assertEqual(response.data['station_name'], 'Test Station')
        
    def test_public_fir_status_invalid_code(self):
        url = reverse('public-fir-status', kwargs={'tracking_code': 'invalid_code'})
        self.client.force_authenticate(user=None)
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_predict_section_success(self):
        url = reverse('predict-section')
        data = {"description": "Someone broke into my house and stole my laptop"}
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("suggestions", response.data)
        self.assertIn("disclaimer", response.data)

    def test_predict_section_missing_description(self):
        url = reverse('predict-section')
        response = self.client.post(url, {}, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", response.data)

    def test_run_escalations(self):
        from datetime import timedelta
        from django.utils import timezone
        from .models import Case, Notification
        
        admin = User.objects.create(username="admin_escalate", role="admin", station=self.station)
        officer = User.objects.create(username="officer_escalate", role="officer")
        
        # FIR auto-creates Case in signals or views, but here we just manually mock one or update existing
        if not hasattr(self.fir, 'case'):
            Case.objects.create(fir=self.fir)
            
        self.fir.case.assigned_officer = officer
        self.fir.case.save()
        Case.objects.filter(id=self.fir.case.id).update(last_updated=timezone.now() - timedelta(days=20))
        
        self.client.force_authenticate(user=admin)
        url = reverse('run-escalations')
        response = self.client.post(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['escalated_count'], 1)
        self.assertTrue(Case.objects.get(id=self.fir.case.id).is_escalated)
        self.assertTrue(Notification.objects.filter(recipient=officer).exists())
        self.assertTrue(Notification.objects.filter(recipient=admin).exists())

    def test_public_crime_trends(self):
        url = reverse('public-crime-trends')
        self.client.force_authenticate(user=None)
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("trends", response.data)

    def test_feedback_creation(self):
        if not hasattr(self.fir, 'case'):
            from .models import Case
            Case.objects.create(fir=self.fir)
        self.fir.status = 'disposed'
        self.fir.save()
        
        url = reverse('feedback-list')
        data = {"case_id": self.fir.case.id, "rating": 5, "comments": "Good"}
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['rating'], 5)

    def test_audio_transcription_mock(self):
        import io
        url = reverse('transcribe-audio')
        file_obj = io.BytesIO(b"fake audio data")
        file_obj.name = "audio.m4a"
        response = self.client.post(url, {"audio": file_obj}, format='multipart')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data.get('is_mock', False))
