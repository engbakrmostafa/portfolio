import shutil
from pathlib import Path

from django.conf import settings
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = 'Initialize persistent database and media storage from bundled data.'

    def handle(self, *args, **options):
        database_path = Path(settings.DATABASES['default']['NAME'])
        bundled_database = settings.BASE_DIR / 'db.sqlite3'

        database_path.parent.mkdir(parents=True, exist_ok=True)
        if database_path != bundled_database and not database_path.exists():
            shutil.copy2(bundled_database, database_path)
            self.stdout.write(self.style.SUCCESS('Initialized persistent database.'))

        media_root = Path(settings.MEDIA_ROOT)
        bundled_media = settings.BASE_DIR / 'media'
        media_root.mkdir(parents=True, exist_ok=True)

        if (
            media_root != bundled_media
            and bundled_media.exists()
            and not any(media_root.iterdir())
        ):
            shutil.copytree(bundled_media, media_root, dirs_exist_ok=True)
            self.stdout.write(self.style.SUCCESS('Initialized persistent media.'))
