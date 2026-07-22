from django.db import models
from django.contrib.auth.models import AbstractUser
import uuid

class User(AbstractUser):
    ROLE_CHOICES = (
        ('citizen', 'Citizen'),
        ('officer', 'Investigating Officer'),
        ('admin', 'Admin/SHO'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='citizen')
    firebase_uid = models.CharField(max_length=128, unique=True, null=True, blank=True)
    station = models.ForeignKey('Station', on_delete=models.SET_NULL, null=True, blank=True, related_name='staff')

    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"

class Station(models.Model):
    name = models.CharField(max_length=100)
    district = models.CharField(max_length=100)
    jurisdiction_area = models.TextField()

    def __str__(self):
        return f"{self.name} Station - {self.district}"

class FIR(models.Model):
    STATUS_CHOICES = (
        ('filed', 'Filed'),
        ('under_investigation', 'Under Investigation'),
        ('charge_sheet_filed', 'Charge Sheet Filed'),
        ('in_court', 'In Court'),
        ('disposed', 'Disposed'),
    )
    fir_number = models.CharField(max_length=50, unique=True, editable=False)
    citizen = models.ForeignKey(User, on_delete=models.CASCADE, related_name='filed_firs')
    station = models.ForeignKey(Station, on_delete=models.CASCADE, related_name='firs')
    incident_type = models.CharField(max_length=100)
    date = models.DateTimeField()
    location = models.CharField(max_length=255)
    description = models.TextField()
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='filed')
    tracking_code = models.CharField(max_length=32, unique=True, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.fir_number:
            self.fir_number = str(uuid.uuid4()).split('-')[0].upper()
        if not self.tracking_code:
            self.tracking_code = uuid.uuid4().hex[:12]
        super().save(*args, **kwargs)

    def __str__(self):
        return f"FIR {self.fir_number} - {self.status}"

class Case(models.Model):
    fir = models.OneToOneField(FIR, on_delete=models.CASCADE, related_name='case')
    assigned_officer = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_cases')
    current_stage = models.CharField(max_length=100, default='Initial Review')
    is_escalated = models.BooleanField(default=False)
    suggested_bns_section = models.CharField(max_length=50, blank=True, null=True)
    confirmed_bns_section = models.CharField(max_length=50, blank=True, null=True)
    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Case for FIR {self.fir.fir_number}"

class Evidence(models.Model):
    fir = models.ForeignKey(FIR, on_delete=models.CASCADE, related_name='evidence')
    file_reference = models.FileField(upload_to='evidence/')
    uploaded_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    file_hash = models.CharField(max_length=64, blank=True, null=True, help_text="SHA-256 hash for tamper evidence")

    def __str__(self):
        return f"Evidence for FIR {self.fir.fir_number}"

class HearingDate(models.Model):
    case = models.ForeignKey(Case, on_delete=models.CASCADE, related_name='hearings')
    date = models.DateTimeField()
    court_name = models.CharField(max_length=255)
    remarks = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Hearing on {self.date.strftime('%Y-%m-%d')} at {self.court_name}"

class Notification(models.Model):
    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"To {self.recipient.username}: {self.message[:20]}"

class Feedback(models.Model):
    case = models.OneToOneField(Case, on_delete=models.CASCADE, related_name='feedback')
    rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)])
    comments = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Feedback for Case {self.case.id} - Rating {self.rating}"
