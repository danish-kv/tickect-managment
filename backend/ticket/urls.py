from django.urls import path, include
from .views import UserViewSet, RegisterAPIView, TicketViewSet, Logout, CustomTokenObtainPairView
from rest_framework.routers import DefaultRouter

routers = DefaultRouter()

routers.register(r'users', UserViewSet, basename='users')
routers.register(r'ticket', TicketViewSet, basename='ticket')

urlpatterns = [
    path('', include(routers.urls)),
    path('register/', RegisterAPIView.as_view(), name='register'),
    path('login/token/', CustomTokenObtainPairView.as_view(), name='token'),
    path('logout/', Logout.as_view(), name='logout')

]
