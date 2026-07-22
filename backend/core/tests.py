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
