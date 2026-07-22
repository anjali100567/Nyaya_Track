from rest_framework import serializers
from .models import User, Station, FIR, Case, Evidence, HearingDate

STATUS_EXPLANATIONS = {
    'filed': 'Your complaint has been successfully recorded and is awaiting assignment to an investigating officer.',
    'under_investigation': 'An officer has been assigned and the investigation is actively ongoing.',
    'charge_sheet_filed': 'The investigation is complete and a charge sheet has been submitted to the court.',
    'in_court': 'The case is currently being heard in court.',
    'disposed': 'The case has been formally closed or disposed of by the authorities.'
}

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

class PublicFIRSerializer(serializers.ModelSerializer):
    station_name = serializers.CharField(source='station.name', read_only=True)
    status_explainer = serializers.SerializerMethodField()
    filed_date = serializers.DateTimeField(source='created_at', read_only=True)

    def get_status_explainer(self, obj):
        return STATUS_EXPLANATIONS.get(obj.status, "Status unknown.")

    class Meta:
        model = FIR
        fields = ['tracking_code', 'status', 'status_explainer', 'filed_date', 'station_name']

class FIRSerializer(serializers.ModelSerializer):
    citizen_name = serializers.CharField(source='citizen.username', read_only=True)
    station_name = serializers.CharField(source='station.name', read_only=True)
    case_details = CaseSerializer(source='case', read_only=True)
    evidence = EvidenceSerializer(many=True, read_only=True)
    status_explainer = serializers.SerializerMethodField()
    qr_code_url = serializers.SerializerMethodField()

    def get_status_explainer(self, obj):
        return STATUS_EXPLANATIONS.get(obj.status, "Status unknown.")

    def get_qr_code_url(self, obj):
        request = self.context.get('request')
        if request and obj.pk:
            from rest_framework.reverse import reverse
            return request.build_absolute_uri(reverse('fir-qr', kwargs={'pk': obj.pk}))
        return None

    class Meta:
        model = FIR
        fields = [
            'id', 'fir_number', 'tracking_code', 'citizen', 'citizen_name', 'station', 'station_name',
            'incident_type', 'date', 'location', 'description', 'status', 'status_explainer', 'created_at',
            'case_details', 'evidence', 'qr_code_url'
        ]
        read_only_fields = ['id', 'fir_number', 'tracking_code', 'citizen', 'status', 'created_at']
