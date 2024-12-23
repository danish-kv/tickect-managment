from rest_framework.viewsets import ModelViewSet
from rest_framework.views import APIView
from .models import CustomUser, Ticket, Comments
from .serializers import UserSerializer, TicketSerializer, RegisterSerializer, CommentSerializer
from rest_framework import status, filters
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.utils.timezone import now
from common.base_pagination import TicketPagination
from django_filters import rest_framework as django_filters
from django_filters.rest_framework import DjangoFilterBackend
from .filters import TicketFilter
from django.db.models import Q


# User ViewSet to handle CRUD operations for users (excluding superusers)
class UserViewSet(ModelViewSet):
    queryset = CustomUser.objects.all().exclude(is_superuser=True)
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]  # Only authenticated users can access
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['is_active']  # Filter users by active status
    search_fields = ['email', 'username']  # Allow search by email and username


# Register API view for user registration
class RegisterAPIView(APIView):
    permission_classes = [AllowAny]  # Open registration for everyone

    def post(self, request):
        data = request.data
        serializer = RegisterSerializer(data=data)
        
        if serializer.is_valid():
            try:
                serializer.save()  # Create a new user
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Custom Token Obtain Pair view to extend JWT response with user details
class CustomTokenObtainPairView(TokenObtainPairView):
    permission_classes = [AllowAny]  # Open for all

    def post(self, request, *args, **kwargs):
        res = super().post(request, *args, **kwargs)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.user

        user.last_login = now()  # Update the last login time
        user.save(update_fields=['last_login'])

        # Adding custom data to the response (username, userID, role)
        res.data['user'] = user.username
        res.data['userID'] = user.id
        res.data['role'] = 'admin' if user.is_superuser else 'user'

        return res


# Logout API to blacklist the refresh token
class Logout(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        try:
            refresh = request.data.get('refresh')
            if not refresh:
                return Response({"detail": "Refresh token is required."}, status=status.HTTP_400_BAD_REQUEST)

            token = RefreshToken(refresh)
            token.blacklist()  # Blacklist the token

            return Response({"detail": "Successfully logged out."}, status=status.HTTP_205_RESET_CONTENT)

        except TokenError:
            return Response({"detail": "Invalid or expired token."}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)


# Ticket ViewSet to handle CRUD operations for tickets
class TicketViewSet(ModelViewSet):
    queryset = Ticket.objects.select_related('user', 'assigned_to').all()  # Optimize queries with select_related
    serializer_class = TicketSerializer
    permission_classes = [IsAuthenticated]  # Only authenticated users can access
    pagination_class = TicketPagination  # Apply custom pagination
    filter_backends = [django_filters.DjangoFilterBackend, filters.OrderingFilter]
    filterset_class = TicketFilter  # Apply custom filtering logic
    ordering_fields = ['priority', 'status']  # Allow sorting by priority and status

    # Overriding perform_create to associate the current user with the ticket
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    # Custom query for the tickets a user has access to (admin sees all, others see theirs or assigned)
    def get_queryset(self):
        if self.request.user.is_superuser:
            return Ticket.objects.all()  # Admin sees all tickets
        return Ticket.objects.filter(Q(user=self.request.user) | Q(assigned_to=self.request.user))  # User sees their own and assigned tickets

    # Overriding perform_update to ensure users can only edit their own tickets or if they're an admin
    def perform_update(self, serializer):
        obj = self.get_object()
        if obj.user != self.request.user and not self.request.user.is_superuser:
            raise PermissionDenied("You do not have permission to edit this ticket.")
        serializer.save()

    # Overriding perform_destroy to ensure users can only delete their own tickets or if they're an admin
    def perform_destroy(self, instance):
        obj = self.get_object()
        if obj.user != self.request.user and not self.request.user.is_superuser:
            raise PermissionDenied("You do not have permission to delete this ticket.")
        instance.delete()


# Comment ViewSet to handle comment CRUD operations
class CommentsViewSet(ModelViewSet):
    queryset = Comments.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]  # Only authenticated users can create comments

    # Overriding perform_create to associate the current user with the comment
    def perform_create(self, serializer):
        print('User in perform create:', self.request.user)
        serializer.save(user=self.request.user)


# Dashboard API to provide statistics on tickets and recent users/tickets
class DashboardAPIView(APIView):
    def get(self, request):
        # Counting the total number of tickets in various statuses
        total_ticket = Ticket.objects.count()
        total_open_ticket = Ticket.objects.filter(status='Open').count()
        total_inprogress_ticket = Ticket.objects.filter(status='In-Progress').count()
        total_resolved_ticket = Ticket.objects.filter(status='Resolved').count()

        # Getting the 5 most recent tickets and users
        recent_ticket = Ticket.objects.all().order_by('-created_at')[:5]
        recent_users = CustomUser.objects.all().order_by('-date_joined').exclude(is_superuser=True)[:5]

        # Serialize the recent data
        recent_ticket_data = TicketSerializer(recent_ticket, many=True).data
        recent_users_data = UserSerializer(recent_users, many=True).data

        data = {
            'total_ticket': total_ticket,
            'total_open_ticket': total_open_ticket,
            'total_inprogress_ticket': total_inprogress_ticket,
            'total_resolved_ticket': total_resolved_ticket,
            'recent_ticket': recent_ticket_data,
            'recent_users': recent_users_data
        }

        return Response(data)


# Landing Page API to show active and resolved ticket counts
class LandingPageAPIView(APIView):
    def get(self, request):
        # Counting the active and resolved tickets
        active_ticket = Ticket.objects.filter(status='Open').count()
        resolved_ticket = Ticket.objects.filter(status='Resolved').count()

        data = {
            "active_ticket": active_ticket,
            'resolved_ticket': resolved_ticket
        }
        return Response(data)
