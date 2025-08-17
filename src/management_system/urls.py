from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from django.views.generic import TemplateView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/docs/", SpectacularSwaggerView.as_view(url_name="schema")),
    path("api/v1/", include("users.urls")),
    path("api/v1/", include("courses.urls")),

    path("", TemplateView.as_view(template_name="login.html")),       
    path("courses/", TemplateView.as_view(template_name="index.html")),  
    path("register/", TemplateView.as_view(template_name="register.html"), name="html-register")
]