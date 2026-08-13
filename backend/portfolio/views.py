import json
import logging
from django.http import JsonResponse
from django.views.decorators.http import require_GET, require_POST
from django.views.decorators.csrf import csrf_exempt
from django.core.mail import send_mail
from django.utils.html import format_html
from .models import (
    HeroSettings, AboutSettings, Service, Project,
    ProjectCategory, Skill, MarqueeItem, SocialLink, ContactMessage, SiteSettings
)

logger = logging.getLogger(__name__)


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

    # ── Project Categories ────────────────────────────────────────────
    categories_list = [
        {
            "id": c.id,
            "name": c.name,
            "icon": c.icon,
            "color": c.color,
            "order": c.order,
        }
        for c in ProjectCategory.objects.all()
    ]

    # ── Projects ──────────────────────────────────────────────────────
    projects_list = []
    for p in Project.objects.all():
        images_list = [
            request.build_absolute_uri(img.image.url)
            for img in p.images.all()
        ]
        projects_list.append({
            "number": p.number,
            "category": p.category.name if p.category else "",
            "category_icon": p.category.icon if p.category else "✦",
            "category_color": p.category.color if p.category else "#B501A7",
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
        "project_categories": categories_list,
        "projects": projects_list,
    })


@csrf_exempt
@require_POST
def contact_form(request):
    """Accept contact form submissions, save to DB, and email the admin."""
    try:
        body = json.loads(request.body)
    except (json.JSONDecodeError, ValueError):
        return JsonResponse({"error": "Invalid JSON body."}, status=400)

    name    = body.get("name", "").strip()
    email   = body.get("email", "").strip()
    subject = body.get("subject", "").strip()
    message = body.get("message", "").strip()

    if not name or not email or not message:
        return JsonResponse(
            {"error": "name, email, and message are required fields."},
            status=400,
        )

    # 1. Save to database
    ContactMessage.objects.create(
        name=name, email=email, subject=subject, message=message
    )

    # 2. Send email notification
    try:
        settings = SiteSettings.get()
        recipient = settings.notification_email
        sender_name = settings.email_sender_name

        email_subject = f"[Portfolio] New message from {name}" + (f" — {subject}" if subject else "")

        # Plain text version
        plain_body = (
            f"You have a new contact form submission:\n\n"
            f"Name:    {name}\n"
            f"Email:   {email}\n"
            f"Subject: {subject or '(none)'}\n\n"
            f"Message:\n{message}\n\n"
            f"---\nReply directly to: {email}"
        )

        # HTML version
        html_body = f"""
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0f0f0f;color:#fff;border-radius:12px;overflow:hidden;">
          <div style="background:linear-gradient(135deg,#B501A7,#7B3DFF);padding:28px 32px;">
            <h2 style="margin:0;color:#fff;font-size:22px;">&#9993; New Portfolio Message</h2>
            <p style="margin:6px 0 0;color:rgba(255,255,255,0.75);font-size:14px;">Someone filled out your contact form</p>
          </div>
          <div style="padding:28px 32px;">
            <table style="width:100%;border-collapse:collapse;">
              <tr><td style="padding:10px 0;color:rgba(255,255,255,0.5);font-size:13px;width:80px;">From</td>
                  <td style="padding:10px 0;font-weight:600;">{name}</td></tr>
              <tr><td style="padding:10px 0;color:rgba(255,255,255,0.5);font-size:13px;">Email</td>
                  <td style="padding:10px 0;"><a href="mailto:{email}" style="color:#B501A7;">{email}</a></td></tr>
              <tr><td style="padding:10px 0;color:rgba(255,255,255,0.5);font-size:13px;">Subject</td>
                  <td style="padding:10px 0;">{subject or '(none)'}</td></tr>
            </table>
            <hr style="border:none;border-top:1px solid rgba(255,255,255,0.08);margin:18px 0;">
            <p style="color:rgba(255,255,255,0.5);font-size:12px;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:8px;">Message</p>
            <p style="background:rgba(255,255,255,0.05);padding:16px;border-radius:8px;line-height:1.7;white-space:pre-wrap;">{message}</p>
            <a href="mailto:{email}?subject=Re: {subject or 'Your message'}"
               style="display:inline-block;margin-top:20px;padding:12px 28px;background:linear-gradient(135deg,#B501A7,#7B3DFF);color:#fff;text-decoration:none;border-radius:8px;font-weight:600;font-size:14px;">
              &#8617; Reply to {name}
            </a>
          </div>
          <div style="padding:16px 32px;background:rgba(255,255,255,0.03);font-size:11px;color:rgba(255,255,255,0.25);">
            Sent by {sender_name} &bull; Admin panel: <a href="http://127.0.0.1:8000/admin/portfolio/contactmessage/" style="color:#B501A7;">View all messages</a>
          </div>
        </div>
        """

        send_mail(
            subject=email_subject,
            message=plain_body,
            from_email=None,  # uses DEFAULT_FROM_EMAIL from settings
            recipient_list=[recipient],
            html_message=html_body,
            fail_silently=False,
        )
        logger.info(f"Contact notification sent to {recipient}")

    except Exception as exc:
        # Don't fail the request if email fails — message is already saved
        logger.warning(f"Email notification failed: {exc}")

    return JsonResponse({"success": True, "detail": "Message received! I'll get back to you soon."})
