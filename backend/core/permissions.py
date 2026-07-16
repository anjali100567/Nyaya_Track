from rest_framework import permissions

class IsAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == 'admin')

class IsOfficer(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == 'officer')

class IsCitizen(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == 'citizen')

class IsAdminOrOfficer(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role in ['admin', 'officer'])

class IsOwnerCitizen(permissions.BasePermission):
    """Object-level permission to only allow owners of an object to access it."""
    def has_object_permission(self, request, view, obj):
        if request.user.role in ['admin', 'officer']:
            return True  # Admins/Officers will be filtered by other permissions or querysets
        if hasattr(obj, 'citizen'):
            return obj.citizen == request.user
        if hasattr(obj, 'fir') and hasattr(obj.fir, 'citizen'):
            return obj.fir.citizen == request.user
        return False

class IsAssignedOfficer(permissions.BasePermission):
    """Object-level permission to only allow assigned officer to access it."""
    def has_object_permission(self, request, view, obj):
        if request.user.role == 'admin':
            return True
        if hasattr(obj, 'assigned_officer'):
            return obj.assigned_officer == request.user
        if hasattr(obj, 'case') and hasattr(obj.case, 'assigned_officer'):
            return obj.case.assigned_officer == request.user
        if hasattr(obj, 'fir') and hasattr(obj.fir, 'case') and hasattr(obj.fir.case, 'assigned_officer'):
            return obj.fir.case.assigned_officer == request.user
        return False

class IsStationAdmin(permissions.BasePermission):
    """Object-level permission ensuring admin only accesses objects within their station."""
    def has_object_permission(self, request, view, obj):
        if request.user.role != 'admin':
            return False
        
        if not request.user.station:
            return False

        if hasattr(obj, 'station'):
            return obj.station == request.user.station
        if hasattr(obj, 'fir') and hasattr(obj.fir, 'station'):
            return obj.fir.station == request.user.station
        if hasattr(obj, 'case') and hasattr(obj.case, 'fir'):
            return obj.case.fir.station == request.user.station
        return False
