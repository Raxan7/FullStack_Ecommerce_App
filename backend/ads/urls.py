from django.urls import path
from .views import (
    AdSubmissionView,
    AdApprovalView,
    ActiveAdsView,
    UserAdsView,
    PendingApprovalAdsView
)

urlpatterns = [
    path('submit/', AdSubmissionView.as_view(), name='ad-submission'),
    path('approve/<int:pk>/', AdApprovalView.as_view(), name='ad-approval'),
    path('active/', ActiveAdsView.as_view(), name='active-ads'),
    path('my-ads/', UserAdsView.as_view(), name='user-ads'),
    path('pending/', PendingApprovalAdsView.as_view(), name='pending-ads'),
]