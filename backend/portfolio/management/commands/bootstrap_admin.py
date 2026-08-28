import os

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = 'Create or update the environment-configured Django administrator.'

    def handle(self, *args, **options):
        username = os.getenv('DJANGO_ADMIN_USERNAME', '').strip()
        password = os.getenv('DJANGO_ADMIN_PASSWORD', '')
        email = os.getenv('DJANGO_ADMIN_EMAIL', '').strip()

        if not username or not password:
            self.stdout.write('Admin bootstrap skipped: credentials are not configured.')
            return

        user_model = get_user_model()
        user, created = user_model.objects.get_or_create(username=username)

        user.is_active = True
        user.is_staff = True
        user.is_superuser = True
        if email:
            user.email = email
        user.set_password(password)
        user.save()

        action = 'Created' if created else 'Updated'
        self.stdout.write(self.style.SUCCESS(f'{action} Django administrator: {username}'))
