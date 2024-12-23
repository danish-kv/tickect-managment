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



class UserViewSet(ModelViewSet):
    queryset = CustomUser.objects.all().exclude(is_superuser=True)
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['is_active']  
    search_fields = ['email', 'username']



class RegisterAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        data = request.data
        print('====',data)

        serializer = RegisterSerializer(data=data)
        if serializer.is_valid():
            try:
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response({'error' : str(e)}, status=status.HTTP_400_BAD_REQUEST)
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    


class CustomTokenObtainPairView(TokenObtainPairView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        print(request.data)
        res = super().post(request, *args, **kwargs)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.user

        user.last_login = now()
        user.save(update_fields=['last_login'])

        res.data['user'] = user.username
        res.data['userID'] = user.id
        res.data['role'] = 'admin' if user.is_superuser else 'user'

        return res
    


class Logout(APIView):
    def post(self, request):
        try:
            refresh = request.data.get('refresh')
            if not refresh:
                return Response({"detail": "Refresh token is required."}, status=status.HTTP_400_BAD_REQUEST)

            token = RefreshToken(refresh)
            token.blacklist()

            return Response({"detail": "Successfully logged out."}, status=status.HTTP_205_RESET_CONTENT)

        except TokenError as e:
            return Response({"detail": "Invalid or expired token."}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            print(e)
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        



class TicketViewSet(ModelViewSet):
    queryset = Ticket.objects.select_related('user', 'assigned_to').all()
    serializer_class = TicketSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = TicketPagination
    filter_backends = [
        django_filters.DjangoFilterBackend,
        filters.OrderingFilter
    ]
    filterset_class = TicketFilter
    ordering_fields = ['priority', 'status']


    def create(self, request, *args, **kwargs):
        print(request.data)
        print(request.user)
        return super().create(request, *args, **kwargs)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class CommentsViewSet(ModelViewSet):
    queryset = Comments.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

    
    def perform_create(self, serializer):
        print('user in perfrom create', self.request.user)
        serializer.save(user=self.request.user)


class DashboardAPIView(APIView):
    def get(self, request):
        total_ticket = Ticket.objects.count()
        total_open_ticket = Ticket.objects.filter(status='Open').count()
        total_inprogress_ticket = Ticket.objects.filter(status='In-Progress').count()
        total_resolved_ticket = Ticket.objects.filter(status='Resolved').count()

        # Get the 5 most recent tickets and users
        recent_ticket = Ticket.objects.all().order_by('-created_at')[:5]
        recent_users = CustomUser.objects.all().order_by('-date_joined').exclude(is_superuser=True)[:5]

        # Serialize the data
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
