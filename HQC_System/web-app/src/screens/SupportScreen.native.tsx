// Copyright (c) 2025 HQC System Contributors
// Licensed under the GNU General Public License v3.0 (GPL-3.0)

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

const SupportScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  const handleEmail = () => {
    Linking.openURL('mailto:support@hqcsystem.app').catch(() => {});
  };

  const handlePhone = () => {
    Linking.openURL('tel:19001234').catch(() => {});
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Trung tâm hỗ trợ</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={['#20A957', '#7BE882']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroSection}
        >
          <View style={styles.heroIconContainer}>
            <MaterialIcons name="support-agent" size={48} color="#20A957" />
          </View>
          <Text style={styles.heroTitle}>Chúng tôi có thể giúp gì cho bạn?</Text>
          <Text style={styles.heroSubtitle}>Đội ngũ HQC System luôn sẵn sàng hỗ trợ bạn giải quyết mọi vấn đề 24/7.</Text>
        </LinearGradient>

        <Text style={styles.sectionTitle}>Phương thức liên hệ</Text>

        <View style={styles.contactGrid}>
          <TouchableOpacity style={styles.contactCard} onPress={handlePhone} activeOpacity={0.7}>
            <View style={[styles.iconWrapper, { backgroundColor: '#EFF6FF' }]}>
              <MaterialIcons name="phone-in-talk" size={28} color="#3B82F6" />
            </View>
            <Text style={styles.contactTitle}>Tổng đài</Text>
            <Text style={styles.contactValue}>1900-1234</Text>
            <Text style={styles.contactHint}>Miễn phí cước gọi</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactCard} onPress={handleEmail} activeOpacity={0.7}>
            <View style={[styles.iconWrapper, { backgroundColor: '#FEF2F2' }]}>
              <MaterialIcons name="email" size={28} color="#EF4444" />
            </View>
            <Text style={styles.contactTitle}>Email</Text>
            <Text style={styles.contactValue}>support@hqc.app</Text>
            <Text style={styles.contactHint}>Phản hồi trong 24h</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <MaterialIcons name="access-time" size={20} color="#6B7280" />
            <Text style={styles.infoText}>Thời gian làm việc: 8:00 - 21:00 (T2-CN)</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <MaterialIcons name="location-on" size={20} color="#6B7280" />
            <Text style={styles.infoText}>Trụ sở: Tòa nhà HQC, Ngã Tư Sở, Thanh Xuân, Hà Nội</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.faqButton}>
          <Text style={styles.faqButtonText}>Xem câu hỏi thường gặp (FAQ)</Text>
          <MaterialIcons name="open-in-new" size={18} color="#20A957" />
        </TouchableOpacity>
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
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#20A957',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  heroIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
    marginLeft: 4,
  },
  contactGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  contactCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  iconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  contactTitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  contactValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  contactHint: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 4,
  },
  faqButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ECFDF3',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  faqButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#20A957',
  },
});

export default SupportScreen;

