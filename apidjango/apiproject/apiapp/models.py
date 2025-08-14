from django.db import models


class Vien(models.Model):
	name = models.CharField(max_length=20)
	mobilenumber = models.CharField(max_length=10)
	age = models.CharField(max_length=2)
	city = models.CharField(max_length=10)
	gender = models.CharField(max_length=10)
	language = models.JSONField()
	degree =models.CharField(max_length=3)
	vehicle = models.JSONField()
