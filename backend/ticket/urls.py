from django.urls import path, include
from .views import ( UserViewSet, RegisterAPIView, TicketViewSet, Logout, 
                    CustomTokenObtainPairView, CommentsViewSet, DashboardAPIView,LandingPageAPIView )
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView

routers = DefaultRouter()

routers.register(r'users', UserViewSet, basename='users')
routers.register(r'tickets', TicketViewSet, basename='ticket')
routers.register(r'comment', CommentsViewSet, basename='comment')

urlpatterns = [
    path('', include(routers.urls)),
    path('register/', RegisterAPIView.as_view(), name='register'),
    path('login/token/', CustomTokenObtainPairView.as_view(), name='token'),
    path("api/token/refresh", TokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', Logout.as_view(), name='logout'),
    path('dashboard/', DashboardAPIView.as_view(), name='dashboard'),
    path('landing/', LandingPageAPIView.as_view(), name='landing'),

]
