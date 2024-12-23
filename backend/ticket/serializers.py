from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from .models import CustomUser, Ticket, Comments




class UserSerializer(ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['username', 'last_login', 'id', 'email', 'date_joined', 'is_active']


class RegisterSerializer(ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        password = validated_data.pop('password', '')
        user = CustomUser(**validated_data)

        user.set_password(password)
        user.save()

        return user
    
    
    def validate_email(self, value):
        if CustomUser.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError('Email is already exists')
        
        return value
    
    def validate_username(self, value):
        if CustomUser.objects.filter(username__iexact=value).exists():
            raise serializers.ValidationError('This username is already taken')
        return value
    
    def validate(self, attrs):
        password = attrs.get('password', '').strip()
        if len(password) < 6 :
            raise serializers.ValidationError({'password' : 'Passowrd must be at least 6 characters '})
        
        return attrs




class CommentSerializer(ModelSerializer):
    user = UserSerializer()
    class Meta:
        model = Comments
        fields = '__all__'



class TicketSerializer(ModelSerializer):
    comments = CommentSerializer(many=True, read_only=True)
    user = UserSerializer(required=False)
    assigned_to = serializers.PrimaryKeyRelatedField(queryset=Ticket.objects.all(), required=False)
    assigned_user = UserSerializer(source='assigned_to', read_only=True)
    class Meta:
        model = Ticket
        fields = '__all__'

    def validate_title(self, value):
        if not value.strip(): 
            raise serializers.ValidationError("Title cannot be empty or just whitespace.")
        return value

    def validate_description(self, value):
        if value and not value.strip(): 
            raise serializers.ValidationError("Description cannot be just whitespace.")
        return value

    def validate_image(self, value):
        if value and not value.name.endswith(('.png', '.jpg', '.jpeg')):
            raise serializers.ValidationError("Only image files are allowed.")
        return value


    def validate_priority(self, value):
        if value not in ['Low', 'Medium', 'High']:
            raise serializers.ValidationError("Priority must be Low, Medium, or High")
        
        return value
    
    def validate_status(self, value):
        if value not in ['Open', 'In-Progress', 'Resolved']:
            raise serializers.ValidationError("Status must be Open, In-Progress, or Resolved")
        
        return value
    
    def validate(self, data):
        if data.get('assigned_to') and data['status'] == 'Open':
            raise serializers.ValidationError("Tickets with Open status cannot be assigned to a user.")
        return data

    def get_queryset(self):
        if self.request.user.is_superuser:
            return Ticket.objects.all()
        return Ticket.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)