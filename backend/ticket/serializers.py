from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from .models import CustomUser, Ticket, Comments

# Serialize user details
class UserSerializer(ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['username', 'last_login', 'id', 'email', 'date_joined', 'is_active']

# Serializer for user registration
class RegisterSerializer(ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'password']

    # Hash password before saving
    def create(self, validated_data):
        password = validated_data.pop('password', '')
        user = CustomUser(**validated_data)
        user.set_password(password)
        user.save()
        return user
    
    # Validate email uniqueness
    def validate_email(self, value):
        if CustomUser.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError('Email is already exists')
        return value
    
    # Validate username uniqueness
    def validate_username(self, value):
        if CustomUser.objects.filter(username__iexact=value).exists():
            raise serializers.ValidationError('This username is already taken')
        return value
    
    # Validate password length
    def validate(self, attrs):
        password = attrs.get('password', '').strip()
        if len(password) < 6:
            raise serializers.ValidationError({'password': 'Password must be at least 6 characters long'})
        return attrs

# Serialize comment data
class CommentSerializer(ModelSerializer):
    user = UserSerializer(required=False)

    class Meta:
        model = Comments
        fields = '__all__'

# Serialize ticket details
class TicketSerializer(ModelSerializer):
    comments = CommentSerializer(many=True, read_only=True)
    user = UserSerializer(required=False)
    assigned_to = serializers.PrimaryKeyRelatedField(queryset=CustomUser.objects.all(), required=False)
    assigned_user = UserSerializer(source='assigned_to', read_only=True)

    class Meta:
        model = Ticket
        fields = '__all__'

    # Validate ticket title
    def validate_title(self, value):
        if not value.strip(): 
            raise serializers.ValidationError("Title cannot be empty or just whitespace.")
        return value

    # Validate ticket description
    def validate_description(self, value):
        if value and not value.strip(): 
            raise serializers.ValidationError("Description cannot be just whitespace.")
        return value

    # Validate image format
    def validate_image(self, value):
        if value and not value.name.endswith(('.png', '.jpg', '.jpeg')):
            raise serializers.ValidationError("Only image files are allowed.")
        return value

    # Validate priority values
    def validate_priority(self, value):
        if value not in ['Low', 'Medium', 'High']:
            raise serializers.ValidationError("Priority must be Low, Medium, or High")
        return value
    
    # Validate status values
    def validate_status(self, value):
        if value not in ['Open', 'In-Progress', 'Resolved']:
            raise serializers.ValidationError("Status must be Open, In-Progress, or Resolved")
        return value
    
    # Overall ticket validation
    def validate(self, data):
        status = data.get('status')

        # Prevent assigning tickets with "Open" status
        if data.get('assigned_to') and status == 'Open':
            raise serializers.ValidationError("Tickets with Open status cannot be assigned to a user.")
        return data
