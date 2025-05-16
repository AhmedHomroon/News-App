
from django.shortcuts import get_object_or_404, render
from rest_framework.views import APIView # type: ignore
from rest_framework.response import Response # type: ignore
# from main.api import serializer # type: ignore
from main.api.serializers import CategorySerializer, NewsSerializer, RateSerializer, UserSerializer 
# from web_app.api import serializer
from main.models import * # type: ignore
from django.http import JsonResponse
from .models import Category, News, Rate  
from rest_framework.decorators import api_view,permission_classes
from django.db.models import Q
from rest_framework.permissions import AllowAny
from django.contrib.auth.forms import UserCreationForm
from rest_framework.authtoken.models import Token 
import json  # Import the json library
from rest_framework.parsers import JSONParser
from django.views.decorators.csrf import csrf_exempt
import json
from django.contrib.auth import authenticate, login
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.authentication import TokenAuthentication
import logging
from rest_framework import parsers, renderers
@api_view(['GET'])
# @permission_classes([IsAuthenticated])  #  Require authentication
def current_user(request):
    # logger.debug(f"current_user view called. Request: {request}")  # Log the entire request
    # logger.debug(f"User from request: {request.user}")
    # logger.debug(f"Authentication: {request.auth}")
    try:
        serializer = UserSerializer(request.user)
        # logger.debug(f"Serializer data: {serializer.data}")
        return Response(serializer.data)
    except Exception as e:
        # logger.error(f"Error in current_user view: {e}", exc_info=True)  # Log the exception with traceback
        return Response({"error": "Internal Server Error"}, status=500)

logger = logging.getLogger(__name__)

class NewsCreateAPIView(APIView):
    serializer_class = NewsSerializer
    # parser_classes = (parsers.MultiPartParser, parsers.FormParser)  # Add parsers
    parser_classes = (parsers.JSONParser) # parsers.MultiPartParser
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)  #  SET THE USER HERE
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            print("Serializer Errors:", serializer.errors)  #  DEBUGGING
            return Response(serializer.errors, status=400)


@api_view(['POST'])
@permission_classes([AllowAny])
def signup_view(request):
    if request.method == 'POST':
        form = UserCreationForm(request.data)  # Use request.data from DRF
        if form.is_valid():
            user = form.save()
            token, _ = Token.objects.get_or_create(user=user)
            return Response({'token': token.key, 'message': 'User created successfully'}, status=201)
        else:
            return Response(form.errors, status=status.HTTP_400_BAD_REQUEST)
    return Response({'error': 'Invalid request method'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

@api_view(['POST'])
@permission_classes([AllowAny])
def signin_view(request):
    if request.method == 'POST':
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            token, _ = Token.objects.get_or_create(user=user)
            return Response({'token': token.key, 'message': 'Login successful'}, status=200)
        else:
            return Response({'error': 'Invalid credentials'}, status=401)
        
@api_view(['GET'])  # Apply to the view function
@permission_classes([AllowAny])
def search_news(request):
    search_query = request.GET.get('q', '')
    
    if not search_query:

        return Response({"error": "Please provide a search query parameter 'q'"},status=400)
    
    results = News.objects.filter(title__icontains=search_query)
    
    serializer = NewsSerializer(results, many=True)
    return Response(serializer.data, status=200)




@api_view(['GET'])  # Apply to the view function
@permission_classes([AllowAny])
def category(request):
    category=Category.objects.all()
    serializer=CategorySerializer(category,many=True)
    return Response(serializer.data,status=200)
@api_view(["GET"])
@permission_classes([AllowAny])
def news_category(request,id):
    news=News.objects.filter(category_id=id)
    serializer=NewsSerializer(news,many=True)
    return Response(serializer.data,status=200)
@permission_classes([AllowAny])

def category_news_api(request, category_id):
    try:
        category = Category.objects.get(id=category_id)
        news_items = News.objects.filter(category=category).values( 'id',  'title',  'content',  'created_at', 'category_id'
        )
        return JsonResponse(list(news_items), safe=False)
    except Category.DoesNotExist:
        return JsonResponse({'error': 'Category not found'}, status=404)
    




class NewsListApi(APIView):
    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAuthenticated()]

    def get(self, request):
        news = News.objects.all()
        # rates = Rate.objects.filter(news=news)
        serializer = NewsSerializer(news, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        logger.debug(f"Received data: {request.data}")  # Log the incoming data
        serializer = NewsSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            logger.debug(f"Serializer data: {serializer.data}")  # Log the serialized data
            return Response(serializer.data, status=201)
        logger.error(f"Serializer errors: {serializer.errors}")  # Log any errors
        return Response(serializer.errors, status=400)

class NewsDetailAPI(APIView):
    permission_classes = [AllowAny]  # Class-level permission

    def get(self, request, id):
        try:
            news = News.objects.prefetch_related('rates').get(pk=id)  #  This is GOOD!
            serializer = NewsSerializer(news)
            return Response(serializer.data)
        except News.DoesNotExist:
            return Response({"message": "News not found"}, status=404)

    def patch(self, request, id):
        news = get_object_or_404(News, id=id)
        serializer = NewsSerializer(instance=news, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id):
        news = get_object_or_404(News, id=id)
        news.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# @api_view(['GET'])
# @permission_classes([AllowAny])
# def search_news(request):
#     query = request.GET.get('q')
#     if query:
#         news = News.objects.filter(Q(title__icontains=query) | Q(content__icontains=query))
#         serializer = NewsSerializer(news, many=True)
#         return Response(serializer.data)
#     else:
#         return Response(NewsSerializer(News.objects.none(), many=True).data)
    

class RateListAPI(APIView):
    @permission_classes([AllowAny])

    def get (self,request):
        rate=Rate.objects.all()
        serializer=RateSerializer(rate,many=True)
        return Response(serializer.data,status=200)
    def post(self, request):
        serializer = RateSerializer(data=request.data)
        if serializer.is_valid():
            news_id = serializer.validated_data['news'].id  # Assuming 'news' is a ForeignKey
            user = request.user  # <--- THIS IS WHERE 'user' IS DEFINED

            # Check if a rating from this user for this news already exists
            existing_rate = Rate.objects.filter(user=user, news_id=news_id).first()

            if existing_rate:
                return Response({"error": "You have already rated this news article."}, status=status.HTTP_400_BAD_REQUEST)
            else:
                serializer.save(user=user)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class RateDetail(APIView):
    @permission_classes([AllowAny])

    def get(self,request,news_id):
        # news_id = self.kwargs['news_id']
        # news=News.objects.get(id=news_id)
        # rate=Rate.objects.get(news__id=1)
        rate=Rate.objects.filter(news_id=news_id)

        # rate=Rate.objects.get(rate='3')
        serializer=RateSerializer(rate,many=True)
        return Response(serializer.data,status=200)
    permission_classes = [IsAuthenticated]  # Require user to be logged in

    def post(self, request, news_id):
        try:
            news = News.objects.get(pk=news_id)
        except News.DoesNotExist:
            return Response({"error": "News item not found."}, status=status.HTTP_404_NOT_FOUND)

        user = request.user  # User is available because of IsAuthenticated

        rate_value = request.data.get('rate')

        if not rate_value or rate_value not in [choice[0] for choice in Rate.RATES]:
            return Response({"error": "Invalid rate value."}, status=400)

        # Check if the user has already rated this news item
        existing_rating = Rate.objects.filter(user=user, news=news).first()

        if existing_rating:
            return Response({"error": "You have already rated this news item."}, status=409)

        rate = Rate(user=user, news=news, rate=rate_value)
        try:
            rate.save()
            serializer = RateSerializer(rate)
            return Response(serializer.data, status=201)
        except Exception as e:
            return Response({"error": f"Failed to save rating: {str(e)}"}, status=500)
    
    # def post(self,request,news_id): Update/Create/delete in rate
    def put(self, request, news_id):
        user = request.user
        try:
            rate = Rate.objects.get(news_id=news_id, user=user)
        except Rate.DoesNotExist:
            return Response({"error": "You haven't rated this news yet."}, status=status.HTTP_404_NOT_FOUND)
        serializer = RateSerializer(rate, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def delete(self, request, news_id):
        user = request.user
        try:
            rate = Rate.objects.get(news_id=news_id, user=user)
        except Rate.DoesNotExist:
            return Response({"error": "Rate not found."}, status=status.HTTP_404_NOT_FOUND)
        
        rate.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    
class UserRate(APIView):
    def get_object(self,id):
            return get_object_or_404(Rate,id=id)
    def get(self,request,user):
        # news=
        current=request.user
        # print("current id",current.id)
        if(user==current.username):
            # print("get user name ")
        
            current_news=Rate.objects.filter(user_id=current.id)
            # print("cureent_news id ",current_news.id)
            # get_specific_rate=
            rate=Rate.objects.filter(user_id=current.id)
            serializer=RateSerializer(rate,many=True)
            # print("the data")
            return Response(serializer.data,status=200)
        else:
            return Response({'detail': 'No rates found for this user.'},status=500)
    def post(self,request,user):
        # def get_object_username(self,user):
        #     current=self.request.id
        #     print(current , "eee",News.objects.get(username=user))
        #     # if (new = News.objects.get(username=user ,id=current))
        #     #     return Rate.objects.get()
        # get_object_username(self,user)
        serializer=RateSerializer(data=request.data)
        # user = request.user  # assumes user is authenticated
        # news=request.data.news_id
        # print("the news is ", news)
        # current_user1=request.user
        # print("cureent user for POST",current_user1.id)
        # print(serializer)
        if serializer.is_valid():
            # validated = serializer.validated_data
            news = serializer.validated_data['news']
            # user = serializer.validated_data['user']
            rate = serializer.validated_data['rate']

            if Rate.objects.filter(news_id=news, user_id=request.user, rate=rate).exists():
                return Response({'error': 'Duplicate comment'}, status=400)
            # news = validated.get('news')
            # user = request.user
            # print("the news ",news)
            # print("the data ",user)
            # if (Rate.objects.filter(user_id=user,news_id=news).exists):
            #     return(Response({'detail': 'No rates found for this user.'},status=500))
            print("seria",serializer)
            serializer.save(user=self.request.user)
            # serializer.save()
            return Response(serializer.data,status=201)
        return Response(serializer.errors,status=400)
        # if serializer.is_valid():
        #     serializer.save()
        #     return Response(serializer.data,status=201)
        # return Response(serializer.errors,status=400)
    def patch(self, request, username, *args, **kwargs):
        
        instance = get_object_or_404(Rate, user__username=username)
        serializer = RateSerializer(instance, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data)
        return Response(serializer.errors)
        # return Response(serializer.errors)
    def delete(self,request,user):
        user = request.user  # assumes user is authenticated
        news=Rate.news_id
        print("The news is ", news)
        rate = get_object_or_404(Rate, user=user)
        rate.delete()
        return Response(status=204)

    
class AddRatingAPI(APIView):
    def post(self, request, news_id):
        try:
            news = News.objects.get(pk=news_id)
        except News.DoesNotExist:
            return Response({"error": "News item not found."}, status=status.HTTP_404_NOT_FOUND)
        user = request.user  # Assuming user authentication is in place
        if not user.is_authenticated:
            return Response({"error": "Authentication required."}, status=status.HTTP_401_UNAUTHORIZED)
        rate_value = request.data.get('rate')

        if not rate_value or rate_value not in [choice[0] for choice in Rate.RATES]:
            return Response({"error": "Invalid rate value."}, status=status.HTTP_400_BAD_REQUEST)
        # Check if the user has already rated this news item
        existing_rating = Rate.objects.filter(user=user, news=news).first()
        if existing_rating:
            return Response({"error": "You have already rated this news item."}, status=status.HTTP_409_CONFLICT)  # 409 Conflict

        # Create and save the new rating
        rate = Rate(user=user, news=news, rate=rate_value)
        try:
            rate.save()
            serializer = RateSerializer(rate)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": f"Failed to save rating: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class NewsUpdateDeleteAPIView(APIView):
    permission_classes = [IsAuthenticated]  # Only logged-in users can edit/delete

    def put(self, request, pk):
        # logger.debug(f"Updating news with pk: {pk}, user: {request.user}")
        news = get_object_or_404(News, pk=pk, user=request.user)  # Only allow owner to update
        serializer = NewsSerializer(news, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):

        news = get_object_or_404(News, pk=pk, user=request.user)  # Only allow owner to delete
        news.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)    