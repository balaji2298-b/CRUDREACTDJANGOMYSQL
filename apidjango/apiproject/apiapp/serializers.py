from rest_framework import serializers
from apiapp.models import Vien
from django.db.models import fields



class Member(serializers.ModelSerializer):
    class Meta:
        model = Vien
        fields = (
            'id','name','mobilenumber','age','city','gender','language','degree','vehicle'
        )

    def validate(self, data):
        mobilenumber = data.get('mobilenumber')
        qs = Vien.objects.filter(mobilenumber=mobilenumber)
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise serializers.ValidationError({
                "mobilenumber": "This mobile number already exists."
            })
        return data

