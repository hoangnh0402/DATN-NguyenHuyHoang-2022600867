// Copyright (c) 2025 HQC System Contributors

// Licensed under the GNU General Public License v3.0 (GPL-3.0)

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Modal, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Avatar from '../components/Avatar';
import { useAuth } from '../contexts/AuthContext';
import Constants from 'expo-constants';

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { user, logout } = useAuth();
  const userName = user?.full_name || user?.username || 'Người dùng';
  const userEmail = user?.email || 'user@example.com';
  const appVersion =
    (Constants.expoConfig as any)?.version ||
    (Constants.expoConfig as any)?.extra?.appVersion ||
    '1.0.0';

  // Modal States
  const [countryModalVisible, setCountryModalVisible] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('Việt Nam');

  const [notifyModalVisible, setNotifyModalVisible] = useState(false);
  const [pushNotify, setPushNotify] = useState(true);
  const [emailNotify, setEmailNotify] = useState(false);
  const [smsNotify, setSmsNotify] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      // Navigation will be handled by RootNavigator based on auth state
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Lỗi', 'Không thể đăng xuất. Vui lòng thử lại.');
    }
  };

  const renderItem = (
    label: string,
    icon: keyof typeof MaterialIcons.glyphMap,
    onPress: () => void,
    valueText?: string
  ) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <MaterialIcons name={icon} size={22} color="#111827" style={styles.menuIcon} />
      <Text style={styles.menuText}>{label}</Text>
      {valueText && <Text style={styles.menuValue}>{valueText}</Text>}
      <MaterialIcons name="chevron-right" size={22} color="#9CA3AF" />
    </TouchableOpacity>
  );

  const handleSupport = () => {
    navigation.navigate('Support' as never, {
      info: 'Nếu gặp sự cố, vui lòng liên hệ:\n• Email: support@hqcsystem.app\n• Điện thoại: 1900-1234\n• Thời gian: 8:00 - 21:00 hàng ngày',
    } as never);
  };

  const handleTerms = () => {
    navigation.navigate('Terms' as never, {
      content:
        'Bằng việc sử dụng ứng dụng, bạn đồng ý với các điều khoản về bảo mật dữ liệu, giới hạn trách nhiệm, và tuân thủ pháp luật hiện hành.',
    } as never);
  };

  const handleInvite = () => {
    Alert.alert('Mời bạn bè', 'Tính năng sẽ sớm ra mắt.');
  };

  const handleCountry = () => {
    setCountryModalVisible(true);
  };

  const handleNotifications = () => {
    setNotifyModalVisible(true);
  };

  const handleEditProfile = () => {
    navigation.navigate('PersonalInfo' as never);
  };

  const countries = ['Việt Nam', 'Hoa Kỳ', 'Nhật Bản', 'Hàn Quốc', 'Singapore', 'Khác'];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Hồ sơ</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.avatarSection}>
          <Avatar size={80} name={userName} uri={user?.avatar_url} />
          <Text style={styles.name}>{userName}</Text>
          <Text style={styles.email}>{userEmail}</Text>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tài khoản</Text>
          <View style={styles.menuSection}>
            {renderItem('Quốc gia', 'public', handleCountry, selectedCountry)}
            {renderItem('Cài đặt thông báo', 'notifications-none', handleNotifications)}
            {renderItem('Chỉnh sửa hồ sơ', 'person-outline', handleEditProfile)}
          </View>
        </View>

        {/* General Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Chung</Text>
          <View style={styles.menuSection}>
            {renderItem('Hỗ trợ', 'help-outline', handleSupport)}
            {renderItem('Điều khoản sử dụng', 'description', handleTerms)}
            {renderItem(`Phiên bản ứng dụng ${appVersion}`, 'info-outline', () =>
              Alert.alert('Phiên bản ứng dụng', appVersion)
            )}
          </View>
        </View>

        <TouchableOpacity
          style={[styles.menuItem, styles.logoutItem]}
          onPress={handleLogout}
        >
          <MaterialIcons name="logout" size={22} color="#E74C3C" style={styles.menuIcon} />
          <Text style={[styles.menuText, styles.logoutText]}>Đăng xuất</Text>
          <MaterialIcons name="chevron-right" size={22} color="#E5E7EB" />
        </TouchableOpacity>
      </ScrollView>

      {/* Country Modal */}
      <Modal
        visible={countryModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setCountryModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Chọn Quốc gia</Text>
              <TouchableOpacity onPress={() => setCountryModalVisible(false)}>
                <MaterialIcons name="close" size={24} color="#111827" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              {countries.map((country) => (
                <TouchableOpacity
                  key={country}
                  style={styles.radioItem}
                  onPress={() => {
                    setSelectedCountry(country);
                    setCountryModalVisible(false);
                  }}
                >
                  <Text style={[styles.radioText, selectedCountry === country && styles.radioTextActive]}>
                    {country}
                  </Text>
                  {selectedCountry === country && (
                    <MaterialIcons name="check" size={24} color="#20A957" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Notifications Modal */}
      <Modal
        visible={notifyModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setNotifyModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Cài đặt thông báo</Text>
              <TouchableOpacity onPress={() => setNotifyModalVisible(false)}>
                <MaterialIcons name="close" size={24} color="#111827" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              <View style={styles.switchItem}>
                <View style={styles.switchTextContainer}>
                  <Text style={styles.switchTitle}>Thông báo đẩy (Push)</Text>
                  <Text style={styles.switchDesc}>Nhận cảnh báo trực tiếp trên thiết bị</Text>
                </View>
                <Switch
                  value={pushNotify}
                  onValueChange={setPushNotify}
                  trackColor={{ false: '#D1D5DB', true: '#7BE882' }}
                  thumbColor={pushNotify ? '#20A957' : '#F9FAFB'}
                />
              </View>

              <View style={styles.switchItem}>
                <View style={styles.switchTextContainer}>
                  <Text style={styles.switchTitle}>Thông báo Email</Text>
                  <Text style={styles.switchDesc}>Nhận bản tin cập nhật qua email</Text>
                </View>
                <Switch
                  value={emailNotify}
                  onValueChange={setEmailNotify}
                  trackColor={{ false: '#D1D5DB', true: '#7BE882' }}
                  thumbColor={emailNotify ? '#20A957' : '#F9FAFB'}
                />
              </View>

              <View style={styles.switchItem}>
                <View style={styles.switchTextContainer}>
                  <Text style={styles.switchTitle}>Thông báo SMS</Text>
                  <Text style={styles.switchDesc}>Nhận mã OTP và thông báo khẩn qua SMS</Text>
                </View>
                <Switch
                  value={smsNotify}
                  onValueChange={setSmsNotify}
                  trackColor={{ false: '#D1D5DB', true: '#7BE882' }}
                  thumbColor={smsNotify ? '#20A957' : '#F9FAFB'}
                />
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingTop: 16,
    paddingBottom: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#20A957',
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  name: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginTop: 16,
  },
  email: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  menuSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  menuIcon: {
    width: 24,
    textAlign: 'center',
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    marginLeft: 12,
  },
  menuValue: {
    fontSize: 14,
    color: '#6B7280',
    marginRight: 8,
  },
  logoutItem: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    marginTop: 8,
  },
  logoutText: {
    color: '#E74C3C',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
    minHeight: '40%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  modalBody: {
    padding: 20,
  },
  radioItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F3F4F6',
  },
  radioText: {
    fontSize: 16,
    color: '#374151',
  },
  radioTextActive: {
    color: '#20A957',
    fontWeight: '600',
  },
  switchItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F3F4F6',
  },
  switchTextContainer: {
    flex: 1,
    paddingRight: 16,
  },
  switchTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 4,
  },
  switchDesc: {
    fontSize: 14,
    color: '#6B7280',
  },
});

export default ProfileScreen;

