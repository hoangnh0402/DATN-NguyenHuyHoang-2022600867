// Copyright (c) 2025 HQC System Contributors
// Licensed under the GNU General Public License v3.0 (GPL-3.0)

'use client';

import { useEffect, useState, useRef } from 'react';
import { Bell, Shield, Palette, User, Mail, Phone, Building, Save, Camera, Key, Globe, Moon, Sun, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/components/providers/auth-provider';
import { authService, UserProfile } from '@/lib/auth-service';

export default function SettingsPage() {
  const { user, logout, refreshUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications' | 'appearance'>('profile');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editedProfile, setEditedProfile] = useState<Partial<UserProfile>>({});

  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });

  const [notificationSettings, setNotificationSettings] = useState({
    email_notifications: true,
    push_notifications: true,
    report_alerts: true,
    system_updates: false,
    weekly_summary: true,
  });

  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: 'system' as 'light' | 'dark' | 'system',
    language: 'vi',
    timezone: 'Asia/Ho_Chi_Minh',
  });

  useEffect(() => {
    // Load user profile from useAuth
    if (user) {
      setProfile(user);
      setEditedProfile(user);
    }
  }, [user]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (Max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Kích thước ảnh không được vượt quá 2MB');
      return;
    }

    // Read file as Base64
    const reader = new FileReader();
    reader.onloadend = () => {
      setEditedProfile({ ...editedProfile, avatar_url: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);
      // API call to update profile
      const updatedUser = await authService.updateProfile({
        full_name: editedProfile.full_name,
        phone: editedProfile.phone,
        department: editedProfile.department,
        position: editedProfile.position,
        avatar_url: editedProfile.avatar_url,
      });
      
      setProfile(updatedUser);
      await refreshUser();
      toast.success('Đã cập nhật thông tin cá nhân');
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Không thể cập nhật thông tin');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!passwordForm.current_password || !passwordForm.new_password) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (passwordForm.new_password !== passwordForm.confirm_password) {
      toast.error('Mật khẩu xác nhận không khớp');
      return;
    }

    if (passwordForm.new_password.length < 8) {
      toast.error('Mật khẩu phải có ít nhất 8 ký tự');
      return;
    }

    try {
      setIsChangingPassword(true);
      await authService.changePassword(passwordForm.current_password, passwordForm.new_password);
      toast.success('Đã thay đổi mật khẩu');
      setPasswordForm({
        current_password: '',
        new_password: '',
        confirm_password: '',
      });
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Không thể thay đổi mật khẩu');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleSaveNotifications = async () => {
    try {
      localStorage.setItem('notification_settings', JSON.stringify(notificationSettings));
      toast.success('Đã lưu cài đặt thông báo');
    } catch (error) {
      toast.error('Không thể lưu cài đặt');
    }
  };

  const handleSaveAppearance = async () => {
    try {
      localStorage.setItem('appearance_settings', JSON.stringify(appearanceSettings));
      toast.success('Đã lưu cài đặt giao diện');
      
      // Apply theme
      if (appearanceSettings.theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else if (appearanceSettings.theme === 'light') {
        document.documentElement.classList.remove('dark');
      } else {
        // System preference
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    } catch (error) {
      toast.error('Không thể lưu cài đặt');
    }
  };

  const tabs = [
    { id: 'profile' as const, label: 'Hồ sơ cá nhân', icon: User },
    { id: 'security' as const, label: 'Bảo mật', icon: Shield },
    { id: 'notifications' as const, label: 'Thông báo', icon: Bell },
    { id: 'appearance' as const, label: 'Giao diện', icon: Palette },
  ];

  if (!profile) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Cài đặt</h1>
        <p className="mt-2 text-muted-foreground">
          Quản lý thông tin cá nhân và cấu hình hệ thống
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-xl border border-border p-4 space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-green-50 dark:bg-green-950/20 text-green-600 font-medium'
                      : 'text-muted-foreground hover:bg-secondary'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="bg-card rounded-xl border border-border p-6 space-y-6">
              <div>
                <h2 className="text-xl font-bold text-foreground mb-4">Thông tin cá nhân</h2>
                
                {/* Avatar */}
                <div className="flex items-center gap-6 mb-6">
                  <div className="relative">
                    <div className="h-24 w-24 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white text-3xl font-bold overflow-hidden border-2 border-border shadow-sm">
                      {editedProfile.avatar_url ? (
                        <img src={editedProfile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        profile.full_name?.charAt(0).toUpperCase() || 'A'
                      )}
                    </div>
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-0 right-0 p-2 bg-green-600 text-white rounded-full hover:bg-green-700 shadow-md transition-transform hover:scale-105"
                      title="Đổi ảnh đại diện"
                    >
                      <Camera className="h-4 w-4" />
                    </button>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleAvatarChange}
                      accept="image/png, image/jpeg, image/jpg"
                      hidden 
                    />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Avatar</p>
                    <p className="text-xs text-muted-foreground mt-1">JPG, PNG. Max 2MB</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      <Mail className="h-4 w-4 inline mr-2" />
                      Email
                    </label>
                    <input
                      type="email"
                      value={editedProfile.email || ''}
                      disabled
                      className="w-full px-4 py-2 rounded-lg border border-border bg-secondary text-muted-foreground cursor-not-allowed"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Email đăng nhập không thể thay đổi</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      <User className="h-4 w-4 inline mr-2" />
                      Tên đăng nhập
                    </label>
                    <input
                      type="text"
                      value={editedProfile.email?.split('@')[0] || ''}
                      disabled
                      className="w-full px-4 py-2 rounded-lg border border-border bg-secondary text-muted-foreground cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Họ tên đầy đủ
                    </label>
                    <input
                      type="text"
                      value={editedProfile.full_name || ''}
                      onChange={(e) => setEditedProfile({ ...editedProfile, full_name: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      <Phone className="h-4 w-4 inline mr-2" />
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      value={editedProfile.phone || ''}
                      onChange={(e) => setEditedProfile({ ...editedProfile, phone: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      <Building className="h-4 w-4 inline mr-2" />
                      Phòng ban
                    </label>
                    <input
                      type="text"
                      value={editedProfile.department || ''}
                      onChange={(e) => setEditedProfile({ ...editedProfile, department: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Chức vụ
                    </label>
                    <input
                      type="text"
                      value={editedProfile.position || ''}
                      onChange={(e) => setEditedProfile({ ...editedProfile, position: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground"
                    />
                  </div>
                </div>

                <button
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="mt-6 flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                >
                  {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
                </button>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="bg-card rounded-xl border border-border p-6 space-y-6">
              <div>
                <h2 className="text-xl font-bold text-foreground mb-4">Bảo mật</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Mật khẩu hiện tại
                    </label>
                    <input
                      type="password"
                      value={passwordForm.current_password}
                      onChange={(e) => setPasswordForm({ ...passwordForm, current_password: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground"
                      placeholder="••••••••"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Mật khẩu mới
                    </label>
                    <input
                      type="password"
                      value={passwordForm.new_password}
                      onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground"
                      placeholder="••••••••"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Ít nhất 8 ký tự</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Xác nhận mật khẩu mới
                    </label>
                    <input
                      type="password"
                      value={passwordForm.confirm_password}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirm_password: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground"
                      placeholder="••••••••"
                    />
                  </div>

                  <button
                    onClick={handleChangePassword}
                    disabled={isChangingPassword}
                    className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-70 disabled:cursor-not-allowed transition-all w-max"
                  >
                    {isChangingPassword ? <Loader2 className="h-4 w-4 animate-spin" /> : <Key className="h-4 w-4" />}
                    {isChangingPassword ? 'Đang cập nhật...' : 'Đổi mật khẩu'}
                  </button>
                </div>

                <div className="mt-8 pt-8 border-t border-border">
                  <h3 className="font-semibold text-foreground mb-4">Phiên đăng nhập</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                      <div>
                        <p className="font-medium text-foreground">MacBook Pro • Chrome</p>
                        <p className="text-sm text-muted-foreground">Hà Nội, Việt Nam • Đang hoạt động</p>
                      </div>
                      <button 
                        onClick={logout}
                        className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
                      >
                        Đăng xuất thiết bị này
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="bg-card rounded-xl border border-border p-6">
              <h2 className="text-xl font-bold text-foreground mb-4">Cài đặt thông báo</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">Thông báo email</p>
                    <p className="text-sm text-muted-foreground">Nhận thông báo qua email</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificationSettings.email_notifications}
                      onChange={(e) => setNotificationSettings({ ...notificationSettings, email_notifications: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">Thông báo đẩy</p>
                    <p className="text-sm text-muted-foreground">Nhận thông báo trên trình duyệt</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificationSettings.push_notifications}
                      onChange={(e) => setNotificationSettings({ ...notificationSettings, push_notifications: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">Cảnh báo báo cáo</p>
                    <p className="text-sm text-muted-foreground">Thông báo khi có báo cáo mới</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificationSettings.report_alerts}
                      onChange={(e) => setNotificationSettings({ ...notificationSettings, report_alerts: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">Cập nhật hệ thống</p>
                    <p className="text-sm text-muted-foreground">Thông báo về các cập nhật mới</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificationSettings.system_updates}
                      onChange={(e) => setNotificationSettings({ ...notificationSettings, system_updates: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">Báo cáo tuần</p>
                    <p className="text-sm text-muted-foreground">Báo cáo tổng hợp hàng tuần</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificationSettings.weekly_summary}
                      onChange={(e) => setNotificationSettings({ ...notificationSettings, weekly_summary: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                  </label>
                </div>

                <button
                  onClick={handleSaveNotifications}
                  className="mt-6 flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <Save className="h-4 w-4" />
                  Lưu cài đặt
                </button>
              </div>
            </div>
          )}

          {/* Appearance Tab */}
          {activeTab === 'appearance' && (
            <div className="bg-card rounded-xl border border-border p-6">
              <h2 className="text-xl font-bold text-foreground mb-4">Giao diện</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">
                    Chủ đề
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => setAppearanceSettings({ ...appearanceSettings, theme: 'light' })}
                      className={`p-4 rounded-lg border-2 transition-colors ${
                        appearanceSettings.theme === 'light'
                          ? 'border-green-600 bg-green-50 dark:bg-green-950/20'
                          : 'border-border hover:border-green-300'
                      }`}
                    >
                      <Sun className="h-6 w-6 mx-auto mb-2" />
                      <p className="text-sm font-medium">Sáng</p>
                    </button>
                    <button
                      onClick={() => setAppearanceSettings({ ...appearanceSettings, theme: 'dark' })}
                      className={`p-4 rounded-lg border-2 transition-colors ${
                        appearanceSettings.theme === 'dark'
                          ? 'border-green-600 bg-green-50 dark:bg-green-950/20'
                          : 'border-border hover:border-green-300'
                      }`}
                    >
                      <Moon className="h-6 w-6 mx-auto mb-2" />
                      <p className="text-sm font-medium">Tối</p>
                    </button>
                    <button
                      onClick={() => setAppearanceSettings({ ...appearanceSettings, theme: 'system' })}
                      className={`p-4 rounded-lg border-2 transition-colors ${
                        appearanceSettings.theme === 'system'
                          ? 'border-green-600 bg-green-50 dark:bg-green-950/20'
                          : 'border-border hover:border-green-300'
                      }`}
                    >
                      <Globe className="h-6 w-6 mx-auto mb-2" />
                      <p className="text-sm font-medium">Hệ thống</p>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Ngôn ngữ
                  </label>
                  <select
                    value={appearanceSettings.language}
                    onChange={(e) => setAppearanceSettings({ ...appearanceSettings, language: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground"
                  >
                    <option value="vi">Tiếng Việt</option>
                    <option value="en">English</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Múi giờ
                  </label>
                  <select
                    value={appearanceSettings.timezone}
                    onChange={(e) => setAppearanceSettings({ ...appearanceSettings, timezone: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground"
                  >
                    <option value="Asia/Ho_Chi_Minh">Giờ Việt Nam (GMT+7)</option>
                    <option value="Asia/Bangkok">Giờ Bangkok (GMT+7)</option>
                    <option value="Asia/Singapore">Giờ Singapore (GMT+8)</option>
                  </select>
                </div>

                <button
                  onClick={handleSaveAppearance}
                  className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <Save className="h-4 w-4" />
                  Lưu cài đặt
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
