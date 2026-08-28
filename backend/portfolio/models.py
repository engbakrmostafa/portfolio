from django.db import models


class HeroSettings(models.Model):
    name = models.CharField(max_length=100, default="Abdelrhaman")
    tagline = models.CharField(
        max_length=200,
        default="3D Creator & Motion Designer",
        help_text="Short tagline shown below the name (e.g. '3D Creator & Motion Designer')"
    )
    role_description = models.TextField(
        default="a 3d creator driven by crafting striking and unforgettable projects"
    )
    portrait = models.ImageField(upload_to='hero/', blank=True, null=True)

    class Meta:
        verbose_name = "Hero Settings"
        verbose_name_plural = "Hero Settings"

    def __str__(self):
        return f"Hero Settings: {self.name}"

    def save(self, *args, **kwargs):
        if not self.pk and HeroSettings.objects.exists():
            self.pk = HeroSettings.objects.first().pk
        super().save(*args, **kwargs)


class AboutSettings(models.Model):
    main_text = models.TextField(
        default="With more than five years of experience in design, i focus on branding, "
                "web design, and user experience, i truly enjoy working with businesses that "
                "aim to stand out and present their best image. Let's build something incredible together!"
    )
    years_experience = models.IntegerField(default=5, help_text="Years of experience counter")
    projects_completed = models.IntegerField(default=40, help_text="Projects completed counter")
    happy_clients = models.IntegerField(default=30, help_text="Happy clients counter")
    moon_icon = models.ImageField(upload_to='about/', blank=True, null=True)
    lego_icon = models.ImageField(upload_to='about/', blank=True, null=True)
    object_icon_1 = models.ImageField(upload_to='about/', blank=True, null=True)
    object_icon_2 = models.ImageField(upload_to='about/', blank=True, null=True)

    class Meta:
        verbose_name = "About Settings"
        verbose_name_plural = "About Settings"

    def __str__(self):
        return "About Settings"

    def save(self, *args, **kwargs):
        if not self.pk and AboutSettings.objects.exists():
            self.pk = AboutSettings.objects.first().pk
        super().save(*args, **kwargs)


class Service(models.Model):
    number = models.CharField(max_length=10, help_text="e.g. 01, 02")
    name = models.CharField(max_length=200)
    description = models.TextField()
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order', 'number']

    def __str__(self):
        return f"{self.number} - {self.name}"


class ProjectCategory(models.Model):
    """Fully manageable project categories — create/edit/delete from Admin panel."""
    name = models.CharField(
        max_length=100, unique=True,
        help_text="Category name shown on the website (e.g. 'Client', 'Personal', 'Mobile Dev')"
    )
    icon = models.CharField(
        max_length=10, default='✦',
        help_text="Emoji icon shown on the filter tab (e.g. 📊, 📱, 🎨)"
    )
    color = models.CharField(
        max_length=20, default='#B501A7',
        help_text="Accent hex color for this category (e.g. #10b981)"
    )
    order = models.IntegerField(default=0, help_text="Display order in filter tabs")

    class Meta:
        ordering = ['order', 'name']
        verbose_name = 'Project Category'
        verbose_name_plural = 'Project Categories'

    def __str__(self):
        return f"{self.icon} {self.name}"


class Project(models.Model):
    number = models.CharField(max_length=10, help_text="e.g. 01, 02")
    category = models.ForeignKey(
        ProjectCategory,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='projects',
        help_text="Select a category (manage categories in 'Project Categories')"
    )
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True, default="", help_text="Short project description")
    live_link = models.URLField(max_length=500, blank=True, null=True)
    video_url = models.URLField(
        max_length=500, blank=True, null=True,
        help_text="Optional YouTube/Vimeo/Direct video URL"
    )
    video_file = models.FileField(
        upload_to='projects/videos/', blank=True, null=True,
        help_text="Alternatively, upload a video file"
    )
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order', 'number']

    def __str__(self):
        cat = self.category.name if self.category else 'Uncategorized'
        return f"{self.number} - {self.name} [{cat}]"


class ProjectImage(models.Model):
    project = models.ForeignKey(Project, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='projects/images/')
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order', 'id']

    def __str__(self):
        return f"Image for {self.project.name} (order: {self.order})"


SKILL_CATEGORY_CHOICES = [
    ('3D', '3D & Rendering'),
    ('Design', 'Design'),
    ('Dev', 'Development'),
    ('Motion', 'Motion'),
    ('Other', 'Other'),
]


class Skill(models.Model):
    name = models.CharField(max_length=100)
    icon = models.CharField(
        max_length=10, blank=True, default="✦",
        help_text="Emoji or short symbol displayed on the skill card (e.g. 🎨, ⚡, 🔥)"
    )
    icon_image = models.FileField(
        upload_to='skills/icons/', blank=True, null=True,
        help_text="Upload an SVG or PNG icon for the floating animation (e.g. Django, Figma)"
    )
    category = models.CharField(
        max_length=20, choices=SKILL_CATEGORY_CHOICES, default='Other',
        help_text="Category used for filter tabs in the Skills section"
    )
    color = models.CharField(
        max_length=20, blank=True, default="#B501A7",
        help_text="Accent hex color for progress bar (e.g. #00F0FF)"
    )
    level = models.IntegerField(default=80, help_text="Skill level percentage (0 to 100)")
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order', 'name']

    def __str__(self):
        return f"{self.name} ({self.level}%)"


class MarqueeItem(models.Model):
    image_url = models.URLField(
        max_length=500, blank=True, null=True,
        help_text="Optional online image/GIF URL"
    )
    image_file = models.ImageField(
        upload_to='marquee/', blank=True, null=True,
        help_text="Alternatively, upload a file"
    )
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order', 'id']

    def __str__(self):
        return f"Marquee Item {self.id} (order: {self.order})"


class SocialLink(models.Model):
    platform = models.CharField(max_length=100, help_text="e.g. GitHub, LinkedIn, Behance")
    url = models.URLField(max_length=500)
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order', 'platform']

    def __str__(self):
        return f"{self.platform}: {self.url}"


class ContactMessage(models.Model):
    name = models.CharField(max_length=200)
    email = models.EmailField()
    subject = models.CharField(max_length=300, blank=True, default="")
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    class Meta:
        ordering = ['-created_at']
        verbose_name = "Contact Message"
        verbose_name_plural = "Contact Messages"

    def __str__(self):
        return f"Message from {self.name} ({self.email}) — {self.created_at.strftime('%Y-%m-%d %H:%M')}"


class SiteSettings(models.Model):
    """Singleton model — only one row. Manage from Admin panel."""
    notification_email = models.EmailField(
        default='body33768@gmail.com',
        help_text="Every new contact message will be emailed to this address."
    )
    email_sender_name = models.CharField(
        max_length=100, default='Portfolio Contact Form',
        help_text="The 'From' name shown in the notification email."
    )

    class Meta:
        verbose_name = "Site Settings"
        verbose_name_plural = "Site Settings"

    def __str__(self):
        return f"Site Settings (notify → {self.notification_email})"

    def save(self, *args, **kwargs):
        # Singleton: always reuse the first row
        if not self.pk and SiteSettings.objects.exists():
            self.pk = SiteSettings.objects.first().pk
        super().save(*args, **kwargs)

    @classmethod
    def get(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj
