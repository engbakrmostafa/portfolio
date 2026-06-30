import os
import sys
import django
import urllib.request
from io import BytesIO

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.core.files.base import ContentFile
from portfolio.models import Skill

# Icon sources — using devicon PNG files (reliable, high-quality)
SKILLS = [
    {
        "name": "Django",
        "category": "Dev",
        "level": 85,
        "color": "#092E20",
        "icon_url": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/django/django-plain.svg",
    },
    {
        "name": "Figma",
        "category": "Design",
        "level": 90,
        "color": "#F24E1E",
        "icon_url": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/figma/figma-original.svg",
    },
    {
        "name": "Flutter",
        "category": "Dev",
        "level": 80,
        "color": "#02569B",
        "icon_url": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/flutter/flutter-original.svg",
    },
    {
        "name": "Docker",
        "category": "Dev",
        "level": 75,
        "color": "#2496ED",
        "icon_url": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg",
    },
    {
        "name": "Python",
        "category": "Dev",
        "level": 90,
        "color": "#3776AB",
        "icon_url": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg",
    },
    {
        "name": "SQL",
        "category": "Dev",
        "level": 80,
        "color": "#4479A1",
        "icon_url": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg",
    },
    {
        "name": "Git",
        "category": "Dev",
        "level": 85,
        "color": "#F05032",
        "icon_url": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg",
    },
    {
        "name": "React",
        "category": "Dev",
        "level": 88,
        "color": "#61DAFB",
        "icon_url": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg",
    },
    {
        "name": "TypeScript",
        "category": "Dev",
        "level": 85,
        "color": "#3178C6",
        "icon_url": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg",
    },
    {
        "name": "Blender",
        "category": "3D",
        "level": 92,
        "color": "#F5792A",
        "icon_url": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/blender/blender-original.svg",
    },
]

print("Clearing old skills and populating fresh data...")
Skill.objects.all().delete()

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

for idx, data in enumerate(SKILLS):
    print(f"  [{idx+1}/{len(SKILLS)}] Downloading {data['name']}...")

    req = urllib.request.Request(data['icon_url'], headers=headers)
    response = urllib.request.urlopen(req)
    content = response.read()

    skill = Skill(
        name=data['name'],
        category=data['category'],
        level=data['level'],
        color=data['color'],
        order=idx,
    )

    ext = data['icon_url'].rsplit('.', 1)[-1]
    filename = f"{data['name'].lower()}.{ext}"
    skill.icon_image.save(filename, ContentFile(content), save=True)

print(f"\nDone! Added {len(SKILLS)} skills with icon images.")
print("Refresh your frontend to see the flight animation!")
