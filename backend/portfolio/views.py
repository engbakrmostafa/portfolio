import json
from django.http import JsonResponse
from django.views.decorators.http import require_GET, require_POST
from django.views.decorators.csrf import csrf_exempt
from .models import (
    HeroSettings, AboutSettings, Service, Project,
    Skill, MarqueeItem, SocialLink, ContactMessage
)


@require_GET
def portfolio_data(request):
    # ── Hero ──────────────────────────────────────────────────────────────
    hero = HeroSettings.objects.first()
    if not hero:
        hero_data = {
            "name": "Abdelrhaman",
            "tagline": "3D Creator & Motion Designer",
            "role_description": "a 3d creator driven by crafting striking and unforgettable projects",
            "portrait": None,
        }
    else:
        hero_data = {
            "name": hero.name,
            "tagline": hero.tagline,
            "role_description": hero.role_description,
            "portrait": request.build_absolute_uri(hero.portrait.url) if hero.portrait else None,
        }

    # ── About ─────────────────────────────────────────────────────────────
    about = AboutSettings.objects.first()
    if not about:
        about_data = {
            "main_text": (
                "With more than five years of experience in design, i focus on branding, "
                "web design, and user experience, i truly enjoy working with businesses that "
                "aim to stand out and present their best image. Let's build something incredible together!"
            ),
            "years_experience": 5,
            "projects_completed": 40,
            "happy_clients": 30,
            "moon_icon": None,
            "lego_icon": None,
            "object_icon_1": None,
            "object_icon_2": None,
        }
    else:
        about_data = {
            "main_text": about.main_text,
            "years_experience": about.years_experience,
            "projects_completed": about.projects_completed,
            "happy_clients": about.happy_clients,
            "moon_icon": request.build_absolute_uri(about.moon_icon.url) if about.moon_icon else None,
            "lego_icon": request.build_absolute_uri(about.lego_icon.url) if about.lego_icon else None,
            "object_icon_1": request.build_absolute_uri(about.object_icon_1.url) if about.object_icon_1 else None,
            "object_icon_2": request.build_absolute_uri(about.object_icon_2.url) if about.object_icon_2 else None,
        }

    # ── Services ──────────────────────────────────────────────────────────
    services_list = [
        {"number": s.number, "name": s.name, "description": s.description}
        for s in Service.objects.all()
    ]

    # ── Skills ────────────────────────────────────────────────────────────
    skills_list = [
        {
            "name": sk.name,
            "icon": sk.icon,
            "icon_image": request.build_absolute_uri(sk.icon_image.url) if sk.icon_image else None,
            "category": sk.category,
            "color": sk.color,
            "level": sk.level,
        }
        for sk in Skill.objects.all()
    ]

    # ── Marquee ───────────────────────────────────────────────────────────
    marquee_list = []
    for mq in MarqueeItem.objects.all():
        url = mq.image_url
        if mq.image_file:
            url = request.build_absolute_uri(mq.image_file.url)
        if url:
            marquee_list.append(url)

    # ── Social Links ──────────────────────────────────────────────────────
    social_list = [
        {"platform": sl.platform, "url": sl.url}
        for sl in SocialLink.objects.all()
    ]

    # ── Projects ──────────────────────────────────────────────────────────
    projects_list = []
    for p in Project.objects.all():
        images_list = [
            request.build_absolute_uri(img.image.url)
            for img in p.images.all()
        ]
        projects_list.append({
            "number": p.number,
            "category": p.category,
            "name": p.name,
            "description": p.description,
            "live_link": p.live_link,
            "video_url": p.video_url,
            "video_file": request.build_absolute_uri(p.video_file.url) if p.video_file else None,
            "images": images_list,
        })

    return JsonResponse({
        "hero": hero_data,
        "about": about_data,
        "services": services_list,
        "skills": skills_list,
        "marquee": marquee_list,
        "socials": social_list,
        "projects": projects_list,
    })


@csrf_exempt
@require_POST
def contact_form(request):
    """Accept contact form submissions and save them to the database."""
    try:
        body = json.loads(request.body)
    except (json.JSONDecodeError, ValueError):
        return JsonResponse({"error": "Invalid JSON body."}, status=400)

    name = body.get("name", "").strip()
    email = body.get("email", "").strip()
    subject = body.get("subject", "").strip()
    message = body.get("message", "").strip()

    if not name or not email or not message:
        return JsonResponse(
            {"error": "name, email, and message are required fields."},
            status=400,
        )

    ContactMessage.objects.create(
        name=name,
        email=email,
        subject=subject,
        message=message,
    )

    return JsonResponse({"success": True, "detail": "Message received! I'll get back to you soon."})
