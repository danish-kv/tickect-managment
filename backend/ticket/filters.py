from rest_framework import filters
from django_filters import rest_framework as django_filters
from django.db.models import Q
from .models import Ticket


class TicketFilter(django_filters.FilterSet):
    status = django_filters.ChoiceFilter(
        choices = [
        ('Open', 'Open'),
        ('In-Progress', 'In-Progress'),
        ('Resolved', 'Resolved'),
        ]
    )

    priority = django_filters.ChoiceFilter(
        choices=[
        ('Low', 'Low'),
        ('Medium', 'Medium'),
        ('High', 'High'),
        ]
    )
    view_type = django_filters.CharFilter(method='filter_view_type')
    search = django_filters.CharFilter(method='filter_search')


    def filter_view_type(self, queryset, name, value):
        user = self.request.user
        if value == 'my-tickets':
            return queryset.filter(user=user)
        elif value == 'assigned-to-me':
            return queryset.filter(assigned_to=user)
        return queryset

    def filter_search(self, queryset, name, value):
        return queryset.filter(
            Q(title__icontains=value) |
            Q(description__icontains=value) |
            Q(user__username__icontains=value)
        )
    
    class Meta:
        model = Ticket
        fields = ['status', 'priority', 'view_type', 'search']
