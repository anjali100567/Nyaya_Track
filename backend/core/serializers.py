from rest_framework import serializers
from .models import User, Station, FIR, Case, Evidence, HearingDate

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'firebase_uid', 'first_name', 'last_name']
        read_only_fields = ['id', 'role']  # Role changes should be restricted

class StationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Station
        fields = '__all__'

class EvidenceSerializer(serializers.ModelSerializer):
    uploaded_by_name = serializers.CharField(source='uploaded_by.username', read_only=True)

    class Meta:
        model = Evidence
        fields = ['id', 'fir', 'file_reference', 'uploaded_by', 'uploaded_by_name', 'timestamp', 'file_hash']
        read_only_fields = ['id', 'uploaded_by', 'timestamp', 'file_hash']

class HearingDateSerializer(serializers.ModelSerializer):
    class Meta:
        model = HearingDate
        fields = '__all__'

class CaseSerializer(serializers.ModelSerializer):
    assigned_officer_name = serializers.CharField(source='assigned_officer.username', read_only=True, default=None)
    hearings = HearingDateSerializer(many=True, read_only=True)

    class Meta:
        model = Case
        fields = ['id', 'fir', 'assigned_officer', 'assigned_officer_name', 'current_stage', 'last_updated', 'hearings']

class FIRSerializer(serializers.ModelSerializer):
    citizen_name = serializers.CharField(source='citizen.username', read_only=True)
    station_name = serializers.CharField(source='station.name', read_only=True)
    case_details = CaseSerializer(source='case', read_only=True)
    evidence = EvidenceSerializer(many=True, read_only=True)

    class Meta:
        model = FIR
        fields = [
            'id', 'fir_number', 'citizen', 'citizen_name', 'station', 'station_name',
            'incident_type', 'date', 'location', 'description', 'status', 'created_at',
            'case_details', 'evidence'
        ]
        read_only_fields = ['id', 'fir_number', 'citizen', 'status', 'created_at']
