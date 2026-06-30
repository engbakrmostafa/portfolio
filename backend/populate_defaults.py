import os
import django
import urllib.request
from django.core.files.base import ContentFile

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from portfolio.models import Service, Project, ProjectImage

def populate_services():
    if Service.objects.exists():
        print("Services already exist, skipping.")
        return

    default_services = [
        {
            'number': '01',
            'name': '3D Modeling',
            'description': 'Creation of detailed objects, characters, or environments tailored to specific client needs, ideal for games, products, and visualizations.',
            'order': 1
        },
        {
            'number': '02',
            'name': 'Rendering',
            'description': 'High-quality, photorealistic renders that showcase designs with custom lighting, textures, and materials to bring concepts to life.',
            'order': 2
        },
        {
            'number': '03',
            'name': 'Motion Design',
            'description': 'Dynamic animations and motion graphics that add energy and storytelling to brands, products, and digital experiences.',
            'order': 3
        },
        {
            'number': '04',
            'name': 'Branding',
            'description': "Crafting cohesive visual identities -- from logos to full brand systems -- that communicate a clear and memorable presence.",
            'order': 4
        },
        {
            'number': '05',
            'name': 'Web Design',
            'description': 'Designing clean, modern, and conversion-focused websites with attention to layout, typography, and user experience.',
            'order': 5
        }
    ]

    for ds in default_services:
        s = Service.objects.create(
            number=ds['number'],
            name=ds['name'],
            description=ds['description'],
            order=ds['order']
        )
        print(f"Created Service: {s.name}")

def populate_projects():
    if Project.objects.exists():
        print("Projects already exist, skipping.")
        return

    default_projects = [
        {
            'number': '01',
            'category': 'Client',
            'name': 'Nextlevel Studio',
            'live_link': 'https://github.com',
            'images': [
                'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055344_5eff02e0-87a5-41ce-b64f-eb08da8f33db.png&w=1280&q=85',
                'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055431_11d841fd-8b41-46a5-82e4-b04f2407a7d8.png&w=1280&q=85',
                'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055451_e317bf2d-28d4-48cc-86b0-6f72f25b6327.png&w=1280&q=85',
            ],
            'order': 1
        },
        {
            'number': '02',
            'category': 'Personal',
            'name': 'Aura Brand Identity',
            'live_link': 'https://github.com',
            'images': [
                'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055654_911201c5-36d9-4bc6-bac7-331adfce159f.png&w=1280&q=85',
                'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055723_5ceda0b8-d9c2-4665-b2e3-83ba19ba76d1.png&w=1280&q=85',
                'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055753_adc5dcbd-a8e6-49c0-b43a-9b030d835cea.png&w=1280&q=85',
            ],
            'order': 2
        },
        {
            'number': '03',
            'category': 'Client',
            'name': 'Solaris Digital',
            'live_link': 'https://github.com',
            'images': [
                'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055759_963cfb0b-4bd1-4b0f-9d0a-09bd6cf95b2f.png&w=1280&q=85',
                'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_060108_438f781a-9846-4dcc-89ab-c4e6cb830f5b.png&w=1280&q=85',
                'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055818_9d062121-ad7e-46b9-999a-1a6a692ef1ee.png&w=1280&q=85',
            ],
            'order': 3
        }
    ]

    for dp in default_projects:
        p = Project.objects.create(
            number=dp['number'],
            category=dp['category'],
            name=dp['name'],
            live_link=dp['live_link'],
            order=dp['order']
        )
        print(f"Created Project: {p.name}")

        for idx, img_url in enumerate(dp['images']):
            try:
                print(f"Downloading image {idx+1} for {p.name}...")
                headers = {'User-Agent': 'Mozilla/5.0'}
                req = urllib.request.Request(img_url, headers=headers)
                with urllib.request.urlopen(req, timeout=15) as response:
                    content = response.read()
                filename = f"proj_{p.number}_{idx+1}.png"
                
                project_img = ProjectImage(project=p)
                project_img.image.save(filename, ContentFile(content), save=True)
                print(f"Successfully saved image {filename}")
            except Exception as e:
                print(f"Failed to download image {img_url}: {e}")

if __name__ == '__main__':
    print("Populating default services...")
    populate_services()
    print("Populating default projects and downloading images...")
    populate_projects()
    print("Done populating database.")
