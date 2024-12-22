from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from .models import CustomUser, Ticket




class UserSerializer(ModelSerializer):
    class Meta:
        model = CustomUser
        fields = '__all__'


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


    
class TicketSerializer(ModelSerializer):
    class Meta:
        model = Ticket
        fields = '__all__'

    def get_queryset(self):
        if self.request.user.is_superuser:
            return Ticket.objects.all()
        return Ticket.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


