from django.urls import path
from . import views

urlpatterns = [
    path('portfolio/', views.portfolio_data, name='portfolio_data'),
    path('contact/', views.contact_form, name='contact_form'),
]
