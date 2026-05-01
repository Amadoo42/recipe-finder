from django.shortcuts import render
from .models import ImageModel
from .tensorflow_classifier import Classifier

classifier = Classifier()
def index(request):
    if request.method == 'POST':
        url = request.POST.get('imageURL')
        if url:
            pred_class, confidence = classifier.predict_from_url(url)
            context = {
                "pred_class": pred_class,
                "confidence": confidence
            }
            print(f"CLASS: {pred_class}\n CONFIDENCE: {confidence}")
            return render(request, 'classifier.html', context)
        
        img = request.FILES.get('image')
        if img:
            pred_class, confidence = classifier.predict(img)
            context = {
                "pred_class": pred_class,
                "confidence": confidence
            }
            print(f"CLASS: {pred_class}\n CONFIDENCE: {confidence}")
            return render(request, 'classifier.html', context)
    
    return render(request, 'classifier.html')