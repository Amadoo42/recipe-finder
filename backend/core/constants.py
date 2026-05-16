from django.urls import reverse_lazy

LOGIN_URL = reverse_lazy('core:login')
USER_DASHBOARD_URL = reverse_lazy('user_app:user_dashboard')
ADMIN_DASHBOARD_URL = reverse_lazy('admin_app:admin_dashboard')
INDEX_URL = reverse_lazy('core:index')