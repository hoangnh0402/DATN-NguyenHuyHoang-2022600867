// Copyright (c) 2025 HQC System Contributors
// Licensed under the GNU General Public License v3.0 (GPL-3.0)

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

const TermsScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  const termsData = [
    {
      id: '1',
      icon: 'privacy-tip' as any,
      title: 'Bảo mật dữ liệu cá nhân',
      content: 'HQC System cam kết bảo vệ thông tin cá nhân của bạn. Dữ liệu vị trí và hình ảnh phản ánh chỉ được sử dụng cho mục đích cải thiện cộng đồng.',
    },
    {
      id: '2',
      icon: 'gavel' as any,
      title: 'Tuân thủ pháp luật',
      content: 'Người dùng chịu trách nhiệm về tính xác thực của thông tin cung cấp. Các hành vi xuyên tạc, chống phá sẽ bị xử lý theo quy định của pháp luật.',
    },
    {
      id: '3',
      icon: 'security' as any,
      title: 'Giới hạn trách nhiệm',
      content: 'Chúng tôi không chịu trách nhiệm cho những gián đoạn dịch vụ phát sinh từ sự cố mạng, bảo trì định kỳ hoặc các yếu tố bất khả kháng.',
    },
    {
      id: '4',
      icon: 'copyright' as any,
      title: 'Quyền sở hữu trí tuệ',
      content: 'Mọi tài nguyên, thiết kế và mã nguồn của HQC System đều thuộc quyền sở hữu của nhóm phát triển. Nghiêm cấm sao chép dưới mọi hình thức.',
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Điều khoản & Dịch vụ</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.heroSection}>
          <LinearGradient
            colors={['#ECFDF3', '#D1F4E0']}
            style={styles.iconCircle}
          >
            <MaterialIcons name="description" size={36} color="#20A957" />
          </LinearGradient>
          <Text style={styles.heroTitle}>Thỏa thuận người dùng</Text>
          <Text style={styles.heroSubtitle}>
            Vui lòng đọc kỹ các điều khoản dưới đây trước khi sử dụng HQC System. Cập nhật lần cuối: Tháng 4, 2026.
          </Text>
        </View>

        <View style={styles.termsList}>
          {termsData.map((item, index) => (
            <View key={item.id} style={styles.termCard}>
              <View style={styles.termHeader}>
                <View style={styles.termIconWrapper}>
                  <MaterialIcons name={item.icon} size={20} color="#20A957" />
                </View>
                <Text style={styles.termTitle}>{item.title}</Text>
              </View>
              <Text style={styles.termContent}>{item.content}</Text>
              {index < termsData.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.acceptButton} onPress={() => navigation.goBack()}>
          <Text style={styles.acceptButtonText}>Tôi đã hiểu & Đồng ý</Text>
        </TouchableOpacity>
        
        <Text style={styles.footerText}>© 2026 HQC System. All rights reserved.</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingHorizontal: 8,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  heroSection: {
    alignItems: 'center',
    paddingVertical: 24,
    marginBottom: 8,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 16,
  },
  termsList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 24,
  },
  termCard: {
    marginBottom: 8,
  },
  termHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  termIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ECFDF3',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  termTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
  },
  termContent: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 22,
    marginLeft: 44,
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 16,
    marginLeft: 44,
  },
  acceptButton: {
    backgroundColor: '#20A957',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#20A957',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  acceptButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  footerText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#9CA3AF',
  },
});

export default TermsScreen;

