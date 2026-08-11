import os, sys, django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from portfolio.models import ProjectCategory

defaults = [
    {'name': 'Client',                   'icon': '\U0001f91d', 'color': '#B501A7', 'order': 0},
    {'name': 'Personal',                 'icon': '\u2726',       'color': '#a78bfa', 'order': 1},
    {'name': 'Financial Data Analysis',  'icon': '\U0001f4ca', 'color': '#10b981', 'order': 2},
    {'name': 'Mobile Development',       'icon': '\U0001f4f1', 'color': '#3b82f6', 'order': 3},
    {'name': 'Full Stack Development',   'icon': '\U0001f9e9', 'color': '#f59e0b', 'order': 4},
    {'name': 'Design',                   'icon': '\U0001f3a8', 'color': '#ec4899', 'order': 5},
]

for d in defaults:
    obj, created = ProjectCategory.objects.get_or_create(name=d['name'], defaults=d)
    sys.stdout.buffer.write(f"{'Created' if created else 'Exists'}: {obj.name}\n".encode('utf-8'))

sys.stdout.buffer.write(b"All categories ready!\n")
