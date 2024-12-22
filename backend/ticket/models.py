from django.db import models
from django.contrib.auth.models import AbstractUser




class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    profile = models.ImageField(upload_to='profiles/', null=True, blank=True)
    number = models.CharField(max_length=15, null=True, blank=True) 
    otp = models.CharField(max_length=6, null=True, blank=True)
    is_verified = models.BooleanField(default=False)

    def __str__(self):
        return self.username


class Ticket(models.Model):
    PRIORITY_STATUS = [
        ('Low', 'Low'),
        ('Medium', 'Medium'),
        ('High', 'High'),
    ]
    CURRENT_STATUS = [
        ('Open', 'Open'),
        ('In-Progress', 'In-Progress'),
        ('Resolved', 'Resolved'),
    ]

    title = models.CharField(max_length=250, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    image = models.FileField(upload_to='uploads/tickets/', null=True, blank=True)  
    priority = models.CharField(max_length=10, choices=PRIORITY_STATUS, default='Low')
    status = models.CharField(max_length=15, choices=CURRENT_STATUS, default='Open')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='tickets_created')
    assigned_to = models.ForeignKey(
        CustomUser, on_delete=models.SET_NULL, null=True, blank=True, related_name='tickets_assigned'
    )

    def __str__(self):
        return f"Ticket: {self.title} ({self.status})"
