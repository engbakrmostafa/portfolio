from django.contrib import admin
from django.utils.html import format_html
from .models import (
    HeroSettings, AboutSettings, Service,
    ProjectCategory, Project, ProjectImage,
    Skill, MarqueeItem, SocialLink, ContactMessage, SiteSettings
)


@admin.register(HeroSettings)
class HeroSettingsAdmin(admin.ModelAdmin):
    list_display = ('name', 'tagline', 'role_description')
    fieldsets = (
        ('Identity', {'fields': ('name', 'tagline', 'portrait')}),
        ('Description', {'fields': ('role_description',)}),
    )

    def has_add_permission(self, request):
        return not HeroSettings.objects.exists()


@admin.register(AboutSettings)
class AboutSettingsAdmin(admin.ModelAdmin):
    list_display = ('__str__', 'years_experience', 'projects_completed', 'happy_clients')
    fieldsets = (
        ('Text Content', {'fields': ('main_text',)}),
        ('Stats Counters', {'fields': ('years_experience', 'projects_completed', 'happy_clients')}),
        ('Floating Icons', {'fields': ('moon_icon', 'lego_icon', 'object_icon_1', 'object_icon_2')}),
    )

    def has_add_permission(self, request):
        return not AboutSettings.objects.exists()


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('number', 'name', 'order')
    list_editable = ('order',)
    ordering = ('order', 'number')
    search_fields = ('name', 'description')


@admin.register(ProjectCategory)
class ProjectCategoryAdmin(admin.ModelAdmin):
    list_display = ('color_preview', 'icon', 'name', 'project_count', 'order')
    list_editable = ('icon', 'name', 'order')
    ordering = ('order', 'name')
    search_fields = ('name',)
    fieldsets = (
        ('Category Details', {
            'fields': ('name', 'icon', 'color', 'order'),
            'description': '💡 Tip: Use a single emoji for the icon (e.g. 📊 📱 🎨 🧩). Pick any hex color.'
        }),
    )

    def color_preview(self, obj):
        return format_html(
            '<span style="display:inline-block;width:18px;height:18px;border-radius:50%;'
            'background:{};border:2px solid rgba(0,0,0,0.15);vertical-align:middle;"></span>',
            obj.color
        )
    color_preview.short_description = 'Color'

    def project_count(self, obj):
        count = obj.projects.count()
        return format_html('<strong>{}</strong> project{}', count, 's' if count != 1 else '')
    project_count.short_description = 'Projects'


class ProjectImageInline(admin.TabularInline):
    model = ProjectImage
    extra = 3


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('number', 'name', 'get_category', 'order', 'live_link')
    list_editable = ('order',)
    list_filter = ('category',)
    search_fields = ('name', 'description', 'category__name')
    inlines = [ProjectImageInline]
    ordering = ('order', 'number')
    fieldsets = (
        ('Project Info', {'fields': ('number', 'name', 'category', 'description', 'order')}),
        ('Links', {'fields': ('live_link', 'video_url', 'video_file')}),
    )

    def get_category(self, obj):
        if obj.category:
            return format_html(
                '<span style="color:{};font-weight:600;">{} {}</span>',
                obj.category.color, obj.category.icon, obj.category.name
            )
        return '—'
    get_category.short_description = 'Category'


@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ('name', 'icon', 'icon_image', 'category', 'level', 'color', 'order')
    list_editable = ('icon', 'category', 'level', 'color', 'order')
    list_filter = ('category',)
    ordering = ('order', 'name')
    search_fields = ('name', 'category')
    fieldsets = (
        ('Basic Information', {'fields': ('name', 'category', 'level', 'color', 'order')}),
        ('Icons (Choose one)', {'fields': ('icon', 'icon_image'), 'description': 'You can use a text emoji OR upload an image (e.g. Django/Figma SVG) for the flight animation.'}),
    )


@admin.register(MarqueeItem)
class MarqueeItemAdmin(admin.ModelAdmin):
    list_display = ('id', 'order', 'image_url', 'image_file')
    list_editable = ('order',)
    ordering = ('order', 'id')


@admin.register(SocialLink)
class SocialLinkAdmin(admin.ModelAdmin):
    list_display = ('platform', 'url', 'order')
    list_editable = ('order',)
    ordering = ('order', 'platform')


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'subject', 'created_at', 'is_read')
    list_filter = ('is_read', 'created_at')
    list_editable = ('is_read',)
    search_fields = ('name', 'email', 'subject', 'message')
    readonly_fields = ('name', 'email', 'subject', 'message', 'created_at')
    ordering = ('-created_at',)


@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    list_display = ('notification_email_display', 'email_sender_name')
    fieldsets = (
        ('📧 Email Notifications', {
            'fields': ('notification_email', 'email_sender_name'),
            'description': (
                '💡 Every new contact form submission will be emailed to the address above. '
                'Change it here anytime — no code changes needed.<br><br>'
                '⚠️ Make sure EMAIL_HOST_PASSWORD in settings.py is set to your Gmail App Password.'
            ),
        }),
    )

    def notification_email_display(self, obj):
        return format_html(
            '<strong style="color:#B501A7;">{}</strong>', obj.notification_email
        )
    notification_email_display.short_description = 'Notification Email'

    def has_add_permission(self, request):
        return not SiteSettings.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False  # Prevent accidental deletion of the singleton

