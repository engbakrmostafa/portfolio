from django.contrib import admin
from .models import (
    HeroSettings, AboutSettings, Service, Project, ProjectImage,
    Skill, MarqueeItem, SocialLink, ContactMessage
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


class ProjectImageInline(admin.TabularInline):
    model = ProjectImage
    extra = 3


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('number', 'name', 'category', 'order', 'live_link')
    list_editable = ('order',)
    list_filter = ('category',)
    search_fields = ('name', 'description', 'category')
    inlines = [ProjectImageInline]
    ordering = ('order', 'number')
    fieldsets = (
        ('Project Info', {'fields': ('number', 'name', 'category', 'description', 'order')}),
        ('Links', {'fields': ('live_link', 'video_url', 'video_file')}),
    )


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
