from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
import firebase_admin
from firebase_admin import credentials, auth
from django.conf import settings
from .models import User

class FirebaseAuthentication(BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.META.get('HTTP_AUTHORIZATION')
        if not auth_header:
            return None
        
        try:
            # Format is expected to be "Bearer <token>"
            parts = auth_header.split(' ')
            if len(parts) == 2 and parts[0].lower() == 'bearer':
                id_token = parts[1]
            else:
                return None
        except Exception:
            return None

        # Initialize Firebase if not already initialized
        if not firebase_admin._apps:
            try:
                if hasattr(settings, 'FIREBASE_CREDENTIALS_PATH') and settings.FIREBASE_CREDENTIALS_PATH:
                    cred = credentials.Certificate(settings.FIREBASE_CREDENTIALS_PATH)
                    firebase_admin.initialize_app(cred)
                else:
                    # Fallback to default application credentials via GOOGLE_APPLICATION_CREDENTIALS env var
                    firebase_admin.initialize_app()
            except Exception:
                pass # Can't initialize, verification will fail downstream if apps not initialized

        try:
            decoded_token = auth.verify_id_token(id_token)
            uid = decoded_token.get('uid')
        except Exception as e:
            raise AuthenticationFailed(f'Invalid Firebase ID token: {str(e)}')

        # Map Firebase UID to Django User
        user, created = User.objects.get_or_create(firebase_uid=uid, defaults={
            'username': uid,
            'role': 'citizen'
        })

        return (user, None)
