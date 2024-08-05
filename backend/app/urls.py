from django.urls import path
from .views import create_user_profile, get_all_users, update_user_profile

urlpatterns = [
    path("create_user_profile/", create_user_profile, name="create_user_profile"),
    path("get_all_users/", get_all_users, name="get_all_users"),
    path(
        "update_user_profile/<str:user_id>/",
        update_user_profile,
        name="update_user_profile",
    ),
]
