from django.db import models
from django.contrib.auth.models import User

# Create your models here.

CATEGORIES_CHOICES=(
        ("GE","General"),
        ("BU","Business"),
        ("PO","Political"),
        ("SP","Sports"),
        ("SC","Science"),
        ("TE","Technology"),
        ("HE","Health"),
        ("AR","Art")
    )
class Category(models.Model):

    category=models.CharField(
        max_length=2,
        choices=CATEGORIES_CHOICES,
        default=CATEGORIES_CHOICES[0][0]
    )
    def __str__(self):
        return f'{self.get_category_display()}'
class News(models.Model):
    title=models.CharField(max_length=300)
    content=models.TextField()
    source=models.CharField(max_length=300)
    category=models.ForeignKey(Category,on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)#,
    updated_at = models.DateTimeField(auto_now=True,null=True,blank=True)#,
    image_url = models.CharField(max_length=500, blank=True, null=True)
    user=models.ForeignKey(User,on_delete=models.CASCADE)
    image_name = models.CharField(max_length=255, blank=True, null=True)  # <-- ADD THIS LINE

    # rate=models.ForeignKey(Rate,on_delete=models.CASCADE,null=True,blank=True)

    def __str__(self):
        return self.title


class Rate(models.Model):    
    RATES=(
    ('1', 'Strongly Disagree'),
    ('2', 'Somewhat Disagree'),
    ('3', 'Neither Agree Nor Disagree'),
    ('4', 'Somewhat Agree'),
    ('5', 'Strongly Agree')
    )
    rate=models.CharField(
        max_length=1,
        choices=RATES,
        default=RATES[2][0]
    )
    user=models.ForeignKey(User,on_delete=models.CASCADE)
    news = models.ForeignKey(News, on_delete=models.CASCADE, related_name='rates') 
    

    class Meta:
        unique_together = ('user', 'news')




    def __str__(self) -> str:
        return f'{self.get_rate_display()}'
        


