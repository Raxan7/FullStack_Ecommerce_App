from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.authentication import SessionAuthentication
from rest_framework.authentication import BasicAuthentication  # Import if needed
from rest_framework.authentication import TokenAuthentication  # Import if needed
from .models import AdCampaign
from .serializers import AdCampaignSerializer
from datetime import datetime, timedelta
from django.conf import settings
from rest_framework.throttling import AnonRateThrottle


# Define CsrfExemptSessionAuthentication if it's custom
class CsrfExemptSessionAuthentication(SessionAuthentication):
    def enforce_csrf(self, request):
        return  # Disable CSRF checks

from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

class AdSubmissionView(APIView):
    throttle_classes = [AnonRateThrottle]
    parser_classes = (MultiPartParser, FormParser)
    
    def post(self, request):
        data = request.data.copy()
        
        # Debug: Print received data
        print("Received data:", {k: v for k, v in data.items() if k not in ['ad_file', 'payment_proof']})
        
        try:
            # Set default duration
            duration_days = int(data.get('duration_days', 30))
            
            # Calculate dates
            today = datetime.now().date()
            data['start_date'] = today
            data['end_date'] = today + timedelta(days=duration_days)
            
            serializer = AdCampaignSerializer(data=data)
            
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            
            # Return detailed validation errors
            return Response({
                'status': 'error',
                'errors': serializer.errors,
                'message': 'Validation failed',
                'received_data': {k: v for k, v in data.items() if k not in ['ad_file', 'payment_proof']}
            }, status=status.HTTP_400_BAD_REQUEST)
            
        except Exception as e:
            return Response({
                'status': 'error',
                'message': str(e),
                'error_type': type(e).__name__
            }, status=status.HTTP_400_BAD_REQUEST)

    

class AdApprovalView(APIView):
    permission_classes = [permissions.IsAdminUser]
    
    def put(self, request, pk):
        try:
            ad = AdCampaign.objects.get(pk=pk)
            if not ad.is_approved:
                ad.is_approved = True
                ad.is_active = True
                ad.save()
                
                # Here you might want to send an email notification to the user
                # about their ad being approved
                
                return Response(
                    {"detail": "Ad approved and activated successfully"}, 
                    status=status.HTTP_200_OK
                )
            return Response(
                {"detail": "Ad is already approved"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        except AdCampaign.DoesNotExist:
            return Response(
                {"detail": "Ad not found"}, 
                status=status.HTTP_404_NOT_FOUND
            )

class ActiveAdsView(APIView):
    def get(self, request):
        today = datetime.now().date()
        active_ads = AdCampaign.objects.filter(
            is_approved=True,
            is_active=True,
            start_date__lte=today,
            end_date__gte=today
        ).order_by('?')
        serializer = AdCampaignSerializer(active_ads, many=True)
        return Response(serializer.data)

class UserAdsView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        user_ads = AdCampaign.objects.filter(user=request.user)
        serializer = AdCampaignSerializer(user_ads, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class PendingApprovalAdsView(APIView):
    permission_classes = [permissions.IsAdminUser]
    
    def get(self, request):
        pending_ads = AdCampaign.objects.filter(is_approved=False)
        serializer = AdCampaignSerializer(pending_ads, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

class PendingApprovalAdsView(APIView):
    permission_classes = [permissions.IsAdminUser]
    
    def get(self, request):
        pending_ads = AdCampaign.objects.filter(is_approved=False)
        serializer = AdCampaignSerializer(pending_ads, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)