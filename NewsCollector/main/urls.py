from django.urls import path
from main.views import *

from rest_framework.authtoken.views import obtain_auth_token

urlpatterns = [
    path('news/',NewsListApi.as_view()),
    path('news/search/', search_news, name='news-search'),
    path('news/<int:id>/',NewsDetailAPI.as_view()),
    path("news/rate/",RateListAPI.as_view()),
    path("news/<int:news_id>/rate/",RateDetail.as_view()),
    path('news/rate/<str:user>/',UserRate.as_view()),
    
    path('news/category/',category),
    path("news/category/<int:id>/",news_category),
    path('api/news/category/<int:category_id>/', category_news_api, name='category-news'),
    
    path('signup/', signup_view, name='signup'),
    path('signin/', signin_view, name='signin'),
    path('api-token-auth/', obtain_auth_token, name='api_token_auth'),
    
    path('current_user/', current_user, name='current_user'),
    path('news/<int:pk>/update-delete/', NewsUpdateDeleteAPIView.as_view(), name='news-update-delete'),
    
    # path('test/', test_post),
    # path("news/<>/rate",UserRate1.as_view()),
]