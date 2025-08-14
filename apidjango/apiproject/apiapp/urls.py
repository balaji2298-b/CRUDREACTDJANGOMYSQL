from django.urls import path
from apiapp import views


urlpatterns = [
    path('',views.ApiOverview, name='home'),
    path('insert/', views.add_items, name='add_items'),
    path('display/', views.view_items, name='view_items'),
    path('member/<int:pk>/', views.view_member, name='view_member'),
    path('member/update/<int:pk>/', views.update_items, name='update_items'),
    path('member/delete/<int:pk>/', views.delete_items, name='delete_items'),  
]