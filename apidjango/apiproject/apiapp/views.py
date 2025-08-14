from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from apiapp.models import Vien
from apiapp.serializers import Member
from rest_framework import status
from rest_framework import serializers
from django.shortcuts import get_object_or_404

@api_view(['GET'])
def ApiOverview(request):
    api_urls = {
        'All Pages (Overview)': '/',
        'Add Item': '/insert/',
        'View All Items': '/display/',
        'View Single Member': '/member/<int:pk>/',
        'Update Member': '/member/update/<int:pk>/',
        'Delete Member': '/member/delete/<int:pk>/',
    }
    return Response(api_urls)

@api_view(['POST'])
def add_items(request):
	data = request.data.copy()
	if isinstance(data.get('language'), str):
		data['language'] = [lang.strip() for lang in data['language'].split(',') if lang.strip()]
	if isinstance(data.get('vehicle'), str):
		data['vehicle'] = [v.strip() for v in data['vehicle'].split(',') if v.strip()]
	member = Member(data=data)

	if Vien.objects.filter(**data).exists():
		# raise serializers.ValidationError('This data already exists')
		 return Response({"error": "This data already exists"}, status=400)

	if member.is_valid():
		member.save()
		return Response(member.data,status=201)
	else:
		return Response({
            "error": "Invalid input data",
            "details": member.errors
        }, status=400)

@api_view(['GET'])
def view_items(request):
	if request.query_params:
		members = Vien.objects.filter(**request.query_params.dict())
	else:
		members = Vien.objects.all()

	if members:
		serializer = Member(members, many=True)
		return Response(serializer.data)

	else:
		return Response(status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
def view_member(request, pk):
    member = get_object_or_404(Vien, pk=pk)
    serializer = Member(member)
    return Response(serializer.data)

@api_view(['PUT', 'PATCH'])
def update_items(request, pk):
	data = request.data.copy()
	if isinstance(data.get('language'), str):
		data['language'] = [lang.strip() for lang in data['language'].split(',') if lang.strip()]
	if isinstance(data.get('vehicle'), str):
		data['vehicle'] = [v.strip() for v in data['vehicle'].split(',') if v.strip()]

	member = get_object_or_404(Vien, pk=pk)
	serializer = Member(instance=member, data=request.data, partial=True)
	if serializer.is_valid():
		serializer.save()
		return Response(serializer.data, status=status.HTTP_200_OK)
	else:
		print("Serializer errors:", serializer.errors)  
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def delete_items(request, pk):
    member = get_object_or_404(Vien, pk=pk)
    member.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)



	
	
	







