from django.db import models
from django.contrib.auth.models import AbstractUser




class CustomUser(AbstractUser):
    email = models.EmailField(unique=True, db_index=True)
    profile = models.ImageField(upload_to='profiles/', null=True, blank=True)

    def __str__(self):
        return self.username
    
    class Meta:
        ordering = ['-id']


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

    title = models.CharField(max_length=250, null=True, blank=True,db_index=True)
    description = models.TextField(null=True, blank=True)
    image = models.FileField(upload_to='uploads/tickets/', null=True, blank=True)  
    priority = models.CharField(max_length=10, choices=PRIORITY_STATUS, default='Low',db_index=True)
    status = models.CharField(max_length=15, choices=CURRENT_STATUS, default='Open', db_index=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='tickets_created', null=True, db_index=True)
    assigned_to = models.ForeignKey(
        CustomUser, on_delete=models.SET_NULL, null=True, blank=True, related_name='tickets_assigned', db_index=True
    )

    def __str__(self):
        return f"Ticket: {self.title} ({self.status})"
    
    class Meta:
        ordering = ['-created_at']


class Comments(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='comments', null=True)
    ticket = models.ForeignKey(Ticket, on_delete=models.CASCADE, related_name='comments')
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Comment by {self.user} on {self.ticket.title}"
