from django.urls import path
from . import views
from django.views.generic import TemplateView


urlpatterns = [
    path("register/", views.RegisterView.as_view(), name="register"),
    path("login/", views.LoginView.as_view(), name="login"),
    # path("login/", TemplateView.as_view(template_name="login.html")), 
]
