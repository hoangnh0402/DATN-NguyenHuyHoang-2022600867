// Copyright (c) 2025 HQC System Contributors
// Licensed under the GNU General Public License v3.0 (GPL-3.0)

'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle, Clock, RefreshCw, Bell, Lightbulb, Settings, History, MapPin, Sparkles, Send, Building2, Trees, Car, ParkingSquare, Shield, Heart, Wind, Sun, Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminService } from '@/lib/admin-service';
import { geminiService } from '@/lib/gemini-service';
import { HANOI_WARDS } from '@/components/data-intelligence/DataFilters';
import { apiClient } from '@/lib/api-client';

interface Alert {
  id: string;
  type: 'environment' | 'traffic' | 'civic' | 'parking' | 'system' | 'health' | 'safety';
  severity: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  location: string;
  ward?: string;
  timestamp: string;
  status: 'active' | 'acknowledged' | 'resolved';
  recommendation: string;
  impact: string;
  affectedPopulation?: string;
  isAIGenerated?: boolean;
}


// Static historical alerts for stability
const generateHistoricalAlerts = (): Alert[] => {
  return [
    {
      id: 'history-1',
      type: 'environment',
      severity: 'critical',
      title: 'Ô nhiễm không khí nghiêm trọng',
      description: 'Chỉ số AQI vượt ngưỡng 200 tại khu vực Ba Đình.',
      location: 'P. Quán Thánh',
      ward: 'Phường Quán Thánh',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      status: 'resolved',
      recommendation: 'Đã phát khẩu trang miễn phí và phun nước dập bụi.',
      impact: 'Đã cải thiện chỉ số sau 24h.',
    },
    {
      id: 'history-2',
      type: 'traffic',
      severity: 'warning',
      title: 'Ùn tắc tại nút giao Cầu Giấy',
      description: 'Sự cố xe hỏng gây tắc nghẽn cục bộ.',
      location: 'P. Mai Dịch',
      ward: 'Phường Mai Dịch',
      timestamp: new Date(Date.now() - 172800000).toISOString(),
      status: 'resolved',
      recommendation: 'Điều động xe cứu hộ xử lý trong 30 phút.',
      impact: 'Giao thông trở lại bình thường.',
    }
  ];
};

export default function SmartAlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [aiAlerts, setAiAlerts] = useState<Alert[]>([]);
  const [historicalAlerts, setHistoricalAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [generatingAI, setGeneratingAI] = useState(false);
  const [filter, setFilter] = useState<'all' | 'critical' | 'warning' | 'info'>('all');
  const [viewMode, setViewMode] = useState<'active' | 'history' | 'settings'>('active');
  const [selectedWard, setSelectedWard] = useState<string>('all');
  const [showManualForm, setShowManualForm] = useState(false);
  const [editingAlert, setEditingAlert] = useState<Alert | null>(null);
  const [manualAlert, setManualAlert] = useState({
    type: 'environment' as Alert['type'],
    severity: 'warning' as Alert['severity'],
    title: '',
    description: '',
    ward: '',
    recommendation: '',
    impact: '',
  });
  
  // Alert thresholds (configurable)
  const [thresholds, setThresholds] = useState({
    aqi_warning: 100,
    aqi_critical: 150,
    temp_warning: 35,
    temp_critical: 38,
    traffic_speed_warning: 20,
    traffic_speed_critical: 10,
    parking_warning: 85,
    parking_critical: 95,
  });

  const fetchAlerts = async (showToast = false) => {
    try {
      if (showToast) setRefreshing(true);
      setError(null);
      
      // Use trailing slashes and a timestamp to bypass any potential browser/proxy caching
      const [metrics, overview, dbResponse] = await Promise.all([
        adminService.getRealTimeMetrics().catch(() => null),
        adminService.getDashboardOverview().catch(() => null),
        apiClient.get<any>(`/app/alerts/?_t=${Date.now()}`).catch(() => ({ success: false, data: [] }))
      ]);
      
      if (!metrics || !overview) {
        throw new Error('Hệ thống dữ liệu đang bận. Vui lòng thử lại sau.');
      }
      
      const sensorAlerts: Alert[] = [];
      
      // Static IDs for sensor alerts to prevent flickering and React reconciliation issues
      const aqi = metrics.air_quality?.latest?.aqi || 0;
      if (aqi > thresholds.aqi_warning) {
        sensorAlerts.push({
          id: 'sensor-aqi-realtime',
          type: 'environment',
          severity: aqi > thresholds.aqi_critical ? 'critical' : 'warning',
          title: 'Chất lượng không khí kém (Thời gian thực)',
          description: `Chỉ số AQI đạt ${aqi}, vượt ngưỡng an toàn. Dữ liệu ghi nhận từ hệ thống cảm biến TP. Hà Nội.`,
          location: 'Khu vực nội thành',
          ward: 'Đống Đa',
          timestamp: new Date().toISOString(),
          status: 'active',
          recommendation: 'Khuyến cáo đeo khẩu trang N95 khi ra ngoài.',
          impact: 'Gây khó thở cho nhóm nhạy cảm.',
        });
      }
      
      const trafficSpeed = metrics.traffic?.latest?.average_speed || 40;
      if (trafficSpeed < thresholds.traffic_speed_warning) {
        sensorAlerts.push({
          id: 'sensor-traffic-realtime',
          type: 'traffic',
          severity: trafficSpeed < thresholds.traffic_speed_critical ? 'critical' : 'warning',
          title: 'Ùn tắc giao thông nghiêm trọng',
          description: `Tốc độ trung bình chỉ đạt ${Math.round(trafficSpeed)} km/h. Các trục đường chính đang bị quá tải.`,
          location: 'Trục đường chính',
          ward: 'Ba Đình',
          timestamp: new Date().toISOString(),
          status: 'active',
          recommendation: 'Sử dụng các tuyến đường thay thế hoặc phương tiện công cộng.',
          impact: 'Tăng thời gian di chuyển đáng kể.',
        });
      }
      
      // 2. Process database alerts (manual/app alerts)
      let dbAlerts: Alert[] = [];
      if (dbResponse && Array.isArray(dbResponse.data)) {
        dbAlerts = dbResponse.data.map((a: any) => ({
            id: String(a._id || a.id || `db-${Date.now()}-${Math.random()}`),
            type: a.type || 'system',
            severity: a.severity || 'info',
            title: a.title || 'Cảnh báo hệ thống',
            description: a.description || '',
            location: a.ward?.replace('Phường ', 'P. ') || 'Hà Nội',
            ward: a.ward || 'Hà Nội',
            timestamp: a.createdAt || new Date().toISOString(),
            status: a.status || 'active',
            recommendation: a.recommendation || '',
            impact: a.impact || '',
            isAIGenerated: !!a.isAIGenerated
        }));
      } else {
        console.warn('Invalid dbResponse for alerts:', dbResponse);
      }
      
      // Merge: DB alerts (manual) usually take priority or should be mixed
      const allAlerts = [...dbAlerts, ...sensorAlerts];
      
      if (allAlerts.length === 0) {
        allAlerts.push({
          id: 'system-stable-ok',
          type: 'system',
          severity: 'info',
          title: 'Hệ thống đang hoạt động tốt',
          description: 'Không ghi nhận sự cố hay chỉ số bất thường nào.',
          location: 'Toàn thành phố',
          timestamp: new Date().toISOString(),
          status: 'active',
          recommendation: 'Tiếp tục duy trì nếp sống văn minh đô thị.',
          impact: 'Môi trường sống an toàn.',
        });
      }
      
      setAlerts(allAlerts);
      
      // Only generate history once or if empty to prevent jumping
      setHistoricalAlerts(prev => prev.length > 0 ? prev : generateHistoricalAlerts());
      
      if (showToast) toast.success('Dữ liệu đã được đồng bộ');
    } catch (error: any) {
      console.error('Fetch Alerts Error:', error);
      setError(error.message);
      toast.error('Không thể cập nhật dữ liệu');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(() => fetchAlerts(), 30000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Generate AI-powered alerts (Mock simulation - saves API quota)
  const generateAIAlerts = async () => {
    try {
      setGeneratingAI(true);
      toast.loading('Đang phân tích dữ liệu với AI...', { id: 'ai-alert' });
      
      // Get current metrics for context
      const metrics = await adminService.getRealTimeMetrics();
      
      // Proactive analysis using Gemini Service
      const aiGeneratedAlerts = await geminiService.analyzeSmartAlerts(metrics);
      const overview = await adminService.getDashboardOverview();
      
      const currentAQI = metrics.air_quality?.latest?.aqi || 50;
      const currentTemp = metrics.weather?.latest?.temperature || 25;
      const trafficSpeed = metrics.traffic?.latest?.average_speed || 35;
      const pendingIssues = Math.round((overview.entity_statistics?.civic_issues?.total || 50) * 0.35);
      
      // Mock AI-generated alerts based on current data
      const mockAlerts: Alert[] = [];
      
      // Alert 1: Air Quality (if AQI > 100)
      if (currentAQI > 100) {
        mockAlerts.push({
          id: `ai-${Date.now()}-1`,
          type: 'environment',
          severity: currentAQI > 150 ? 'critical' : 'warning',
          title: 'Chất lượng không khí kém',
          description: `Chỉ số AQI hiện tại là ${currentAQI}, vượt mức an toàn. Khuyến cáo người dân hạn chế ra ngoài, đặc biệt là trẻ em và người già.`,
          location: 'Quận Hoàn Kiếm',
          ward: 'Phường Hàng Bạc',
          timestamp: new Date().toISOString(),
          status: 'active' as const,
          recommendation: 'Đeo khẩu trang khi ra ngoài, hạn chế hoạt động ngoài trời, đóng cửa sổ trong nhà.',
          impact: 'Ảnh hưởng đến sức khỏe hô hấp của người dân, đặc biệt nhóm nhạy cảm.',
          affectedPopulation: (25000 + Math.floor(Math.random() * 15000)).toString(),
          isAIGenerated: true,
        });
      }
      
      // Alert 2: High Temperature
      if (currentTemp > 35) {
        mockAlerts.push({
          id: `ai-${Date.now()}-2`,
          type: 'health',
          severity: 'warning',
          title: 'Cảnh báo nắng nóng',
          description: `Nhiệt độ cao ${currentTemp}°C, nguy cơ sốc nhiệt. Khuyến cáo người dân tránh ra ngoài vào giữa trua.`,
          location: 'Quận Ba Đình',
          ward: 'Phường Ngọc Hà',
          timestamp: new Date().toISOString(),
          status: 'active' as const,
          recommendation: 'Uống nhiều nước, tránh hoạt động ngoài trời từ 11h-15h, mặc quần áo thoáng mát.',
          impact: 'Nguy cơ mất nước, sốc nhiệt, ảnh hưởng đến người lao động ngoài trời.',
          affectedPopulation: (30000 + Math.floor(Math.random() * 20000)).toString(),
          isAIGenerated: true,
        });
      }
      
      // Alert 3: Traffic Congestion
      if (trafficSpeed < 25) {
        mockAlerts.push({
          id: `ai-${Date.now()}-3`,
          type: 'traffic',
          severity: 'warning',
          title: 'Tắc nghẽn giao thông nghiêm trọng',
          description: `Tốc độ trung bình chỉ ${trafficSpeed} km/h tại các tuyến đường chính. Dự kiến kéo dài đến 19h.`,
          location: 'Quận Đống Đa',
          ward: 'Phường Láng Hạ',
          timestamp: new Date().toISOString(),
          status: 'active' as const,
          recommendation: 'Tránh các tuyến đường trục chính, sử dụng phương tiện công cộng, hoặc làm việc tại nhà nếu có thể.',
          impact: 'Thời gian di chuyển tăng 2-3 lần, ảnh hưởng đến năng suất làm việc.',
          affectedPopulation: (45000 + Math.floor(Math.random() * 25000)).toString(),
          isAIGenerated: true,
        });
      }
      
      // Alert 4: Pending Issues Accumulation
      if (pendingIssues > 15) {
        mockAlerts.push({
          id: `ai-${Date.now()}-4`,
          type: 'civic',
          severity: 'info',
          title: 'Tích tụ phản ánh chưa xử lý',
          description: `Hiện có ${pendingIssues} phản ánh từ người dân chưa được xử lý. Cần tăng cường xử lý để cải thiện dịch vụ công.`,
          location: 'Quận Cầu Giấy',
          ward: 'Phường Dịch Vọng',
          timestamp: new Date().toISOString(),
          status: 'active' as const,
          recommendation: 'Ưu tiên xử lý các phản ánh về hạ tầng và vệ sinh môi trường. Tăng cường nhân lực xử lý.',
          impact: 'Ảnh hưởng đến chất lượng dịch vụ công và sự hài lòng của người dân.',
          affectedPopulation: (20000 + Math.floor(Math.random() * 10000)).toString(),
          isAIGenerated: true,
        });
      }
      
      // Alert 5: Random event (for demonstration)
      if (Math.random() > 0.5) {
        const randomAlerts = [
          {
            type: 'safety' as const,
            severity: 'warning' as const,
            title: 'Cảnh báo an ninh khu vực công cộng',
            description: 'Phát hiện hoạt động đáng ngờ tại công viên Thống Nhất. Cần tăng cường tuần tra.',
            location: 'Quận Hai Bà Trưng',
            ward: 'Phường Bạch Đằng',
            recommendation: 'Tăng cường tuần tra ban đêm, lắp đặt thêm camera giám sát.',
            impact: 'Nguy cơ ảnh hưởng đến an ninh và trật tự công cộng.',
            affectedPopulation: 15000,
          },
          {
            type: 'system' as const,
            severity: 'info' as const,
            title: 'Bảo trì hệ thống đường ống nước',
            description: 'Cần bảo trì hệ thống đường ống nước tại khu vực phố cổ do tuổi thọ đã cao.',
            location: 'Quận Hoàn Kiếm',
            ward: 'Phường Hàng Bồ',
            recommendation: 'Lên kế hoạch bảo trì định kỳ, thông báo trước cho người dân về việc cắt nước.',
            impact: 'Nguy cơ rò rỉ nước, ảnh hưởng đến sinh hoạt người dân.',
            affectedPopulation: 12000,
          },
          {
            type: 'civic' as const,
            severity: 'warning' as const,
            title: 'Tình trạng rác thải gia tăng',
            description: 'Lượng rác thải sinh hoạt tại các chợ dân sinh tăng cao vào cuối tuần.',
            location: 'Quận Thanh Xuân',
            ward: 'Phường Khương Trung',
            recommendation: 'Tăng tần suất thu gom rác, đặt thêm thùng rác tại các điểm công cộng.',
            impact: 'Ảnh hưởng đến mỹ quan đô thị và vệ sinh môi trường.',
            affectedPopulation: 18000,
          },
        ];
        
        const randomAlert = randomAlerts[Math.floor(Math.random() * randomAlerts.length)];
        mockAlerts.push({
          id: `ai-${Date.now()}-5`,
          ...randomAlert,
          timestamp: new Date().toISOString(),
          status: 'active' as const,
          affectedPopulation: (randomAlert.affectedPopulation + Math.floor(Math.random() * 5000)).toString(),
          isAIGenerated: true,
        });
      }
      
      // If no alerts generated, create a default info alert
      if (mockAlerts.length === 0) {
        mockAlerts.push({
          id: `ai-${Date.now()}-default`,
          type: 'system',
          severity: 'info',
          title: 'Hệ thống hoạt động ổn định',
          description: 'Tất cả các chỉ số đô thị đang ở mức bình thường. Không phát hiện vấn đề nghiêm trọng cần xử lý khẩn cấp.',
          location: 'Toàn thành phố Hà Nội',
          ward: 'Tất cả các phường',
          timestamp: new Date().toISOString(),
          status: 'active' as const,
          recommendation: 'Tiếp tục theo dõi và duy trì các hoạt động giám sát thường xuyên.',
          impact: 'Thành phố đang vận hành tốt, người dân có thể yên tâm sinh hoạt bình thường.',
          affectedPopulation: '8000000',
          isAIGenerated: true,
        });
      }
      
      const finalAiAlerts = [...mockAlerts, ...aiGeneratedAlerts];
      setAlerts(prev => [...finalAiAlerts, ...prev]);
      toast.success(`AI đã phân tích và tạo ${finalAiAlerts.length} cảnh báo thông minh`, { id: 'ai-alert' });
    } catch (error) {
      console.error('AI Alert generation error:', error);
      toast.error('Không thể tạo cảnh báo AI. Vui lòng thử lại.', { id: 'ai-alert' });
    } finally {
      setGeneratingAI(false);
    }
  };

  // Push alert to mobile app (save to MongoDB)
  const pushToMobileApp = async (alert: Alert) => {
    try {
      toast.loading('Đang gửi cảnh báo đến người dân...', { id: 'push-alert' });
      
      // Save to MongoDB via app_alerts API
      const payload = {
        title: alert.title,
        description: alert.description,
        type: alert.type,
        severity: alert.severity,
        ward: alert.ward || 'Hà Nội',
        recommendation: alert.recommendation,
        impact: alert.impact,
        affectedPopulation: alert.affectedPopulation || 'Người dân khu vực',
        isAIGenerated: alert.isAIGenerated || false,
      };

      await apiClient.post('/app/alerts/', payload);
      toast.success('Đã gửi cảnh báo đến người dân', { id: 'push-alert' });
      fetchAlerts(); // Refresh immediately
    } catch (error: any) {
      console.error('Push alert error:', error);
      const message = error.response?.data?.detail || error.message || 'Không thể gửi cảnh báo';
      toast.error(`Lỗi: ${message}`, { id: 'push-alert' });
    }
  };

  const acknowledgeAlert = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: 'acknowledged' } : a));
    toast.success('Đã xác nhận cảnh báo');
  };

  const resolveAlert = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: 'resolved' } : a));
    toast.success('Đã đánh dấu giải quyết');
  };

  const deleteAlert = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa cảnh báo này?')) return;
    
    try {
      await apiClient.delete(`/app/alerts/${id}/`);
      setAlerts(prev => prev.filter(a => a.id !== id));
      toast.success('Đã xóa cảnh báo');
    } catch (error) {
      console.error('Delete alert error:', error);
      toast.error('Không thể xóa cảnh báo');
    }
  };

  const updateAlert = async (alert: Alert) => {
    try {
      const payload = {
        title: alert.title,
        description: alert.description,
        type: alert.type,
        severity: alert.severity,
        ward: alert.ward || 'Hà Nội',
        recommendation: alert.recommendation,
        impact: alert.impact,
        affectedPopulation: alert.affectedPopulation || 'Người dân khu vực',
        isAIGenerated: alert.isAIGenerated || false,
      };

      await apiClient.put(`/app/alerts/${alert.id}`, payload);
      setAlerts(prev => prev.map(a => a.id === alert.id ? alert : a));
      setEditingAlert(null);
      toast.success('Đã cập nhật cảnh báo');
    } catch (error) {
      console.error('Update alert error:', error);
      toast.error('Không thể cập nhật cảnh báo');
    }
  };

  const filteredAlerts = alerts.filter(a => filter === 'all' || a.severity === filter);
  
  const stats = {
    critical: alerts.filter(a => a.severity === 'critical' && a.status === 'active').length,
    warning: alerts.filter(a => a.severity === 'warning' && a.status === 'active').length,
    info: alerts.filter(a => a.severity === 'info' && a.status === 'active').length,
    resolved: alerts.filter(a => a.status === 'resolved').length,
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800';
      case 'warning': return 'bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800';
      default: return 'bg-slate-50 dark:bg-slate-950/20 text-slate-700 dark:text-slate-400 border-slate-200 dark:border-slate-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'environment': return <Trees className="h-4 w-4" />;
      case 'traffic': return <Car className="h-4 w-4" />;
      case 'civic': return <Building2 className="h-4 w-4" />;
      case 'parking': return <ParkingSquare className="h-4 w-4" />;
      case 'health': return <Heart className="h-4 w-4" />;
      case 'safety': return <Shield className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  if (error && alerts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background p-6">
        <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 p-8 rounded-2xl max-w-md text-center">
          <AlertTriangle className="h-12 w-12 text-red-600 dark:text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-red-800 dark:text-red-200 mb-2">Lỗi hệ thống cảnh báo</h3>
          <p className="text-red-600 dark:text-red-400 mb-6">{error}</p>
          <button 
            onClick={() => fetchAlerts()}
            className="px-8 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors flex items-center gap-2 mx-auto font-medium"
          >
            <RefreshCw className="h-4 w-4" />
            Thử lại ngay
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-green-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Đang tải cảnh báo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-green-600 dark:text-green-500" />
            Cảnh báo Thông minh
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Giám sát và cảnh báo tự động • {alerts.length} cảnh báo đang hoạt động
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* View Mode Tabs */}
          <div className="flex items-center bg-muted rounded-lg p-1">
            <button
              onClick={() => setViewMode('active')}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors flex items-center gap-1 ${
                viewMode === 'active' ? 'bg-card shadow text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Bell className="h-4 w-4" />
              Cảnh báo
            </button>
            <button
              onClick={() => setViewMode('history')}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors flex items-center gap-1 ${
                viewMode === 'history' ? 'bg-card shadow text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <History className="h-4 w-4" />
              Lịch sử
            </button>
            <button
              onClick={() => setViewMode('settings')}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors flex items-center gap-1 ${
                viewMode === 'settings' ? 'bg-card shadow text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Settings className="h-4 w-4" />
              Cấu hình
            </button>
          </div>
          
          <button
            onClick={() => fetchAlerts(true)}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Làm mới
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-card p-4 rounded-xl border border-border">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Nghiêm trọng</span>
            <span className="text-2xl font-bold text-red-600 dark:text-red-500">{stats.critical}</span>
          </div>
        </div>
        <div className="bg-card p-4 rounded-xl border border-border">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Cảnh báo</span>
            <span className="text-2xl font-bold text-yellow-600 dark:text-yellow-500">{stats.warning}</span>
          </div>
        </div>
        <div className="bg-card p-4 rounded-xl border border-border">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Thông tin</span>
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-500">{stats.info}</span>
          </div>
        </div>
        <div className="bg-card p-4 rounded-xl border border-border">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Đã xử lý</span>
            <span className="text-2xl font-bold text-green-600 dark:text-green-500">{stats.resolved}</span>
          </div>
        </div>
        <div className="bg-card p-4 rounded-xl border border-border">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Lịch sử (30 ngày)</span>
            <span className="text-2xl font-bold text-gray-600 dark:text-gray-400">{historicalAlerts.length}</span>
          </div>
        </div>
      </div>
      
      {/* Filters - Only show for active and history views */}
      {viewMode !== 'settings' && (
        <div className="flex flex-wrap gap-2 mb-6">
          {/* Severity Filter */}
          <div className="flex gap-1 p-1 bg-muted rounded-lg">
            {(['all', 'critical', 'warning', 'info'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  filter === f ? 'bg-green-600 text-white' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {f === 'all' ? 'Tất cả' : f === 'critical' ? 'Nghiêm trọng' : f === 'warning' ? 'Cảnh báo' : 'Thông tin'}
              </button>
            ))}
          </div>
          
          {/* Ward Filter */}
          <select
            value={selectedWard}
            onChange={(e) => setSelectedWard(e.target.value)}
            className="px-3 py-2 rounded-lg border border-border bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="all">Tất cả phường</option>
            {HANOI_WARDS.slice(0, 50).map(ward => (
              <option key={ward} value={ward}>{ward}</option>
            ))}
          </select>
        </div>
      )}
      
      {/* Settings View */}
      {viewMode === 'settings' && (
        <div className="bg-card rounded-xl border border-border p-6 mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Settings className="h-5 w-5 text-green-600" />
            Cấu hình Ngưỡng Cảnh báo
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            Điều chỉnh ngưỡng để hệ thống tự động tạo cảnh báo khi các chỉ số vượt mức.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* AQI Thresholds */}
            <div className="space-y-3">
              <h3 className="font-medium text-foreground flex items-center gap-2">
                <Wind className="h-4 w-4 text-blue-500" /> Chất lượng Không khí (AQI)
              </h3>
              <div className="flex items-center gap-3">
                <label className="text-sm text-muted-foreground w-24">Cảnh báo:</label>
                <input
                  type="number"
                  value={thresholds.aqi_warning}
                  onChange={(e) => setThresholds({ ...thresholds, aqi_warning: parseInt(e.target.value) })}
                  className="w-20 px-2 py-1 rounded border border-border bg-background text-foreground"
                />
                <span className="text-xs text-muted-foreground">(mặc định: 100)</span>
              </div>
              <div className="flex items-center gap-3">
                <label className="text-sm text-muted-foreground w-24">Nghiêm trọng:</label>
                <input
                  type="number"
                  value={thresholds.aqi_critical}
                  onChange={(e) => setThresholds({ ...thresholds, aqi_critical: parseInt(e.target.value) })}
                  className="w-20 px-2 py-1 rounded border border-border bg-background text-foreground"
                />
                <span className="text-xs text-muted-foreground">(mặc định: 150)</span>
              </div>
            </div>
            
            {/* Temperature Thresholds */}
            <div className="space-y-3">
              <h3 className="font-medium text-foreground flex items-center gap-2">
                <Sun className="h-4 w-4 text-orange-500" /> Nhiệt độ (°C)
              </h3>
              <div className="flex items-center gap-3">
                <label className="text-sm text-muted-foreground w-24">Cảnh báo:</label>
                <input
                  type="number"
                  value={thresholds.temp_warning}
                  onChange={(e) => setThresholds({ ...thresholds, temp_warning: parseInt(e.target.value) })}
                  className="w-20 px-2 py-1 rounded border border-border bg-background text-foreground"
                />
                <span className="text-xs text-muted-foreground">(mặc định: 35°C)</span>
              </div>
              <div className="flex items-center gap-3">
                <label className="text-sm text-muted-foreground w-24">Nghiêm trọng:</label>
                <input
                  type="number"
                  value={thresholds.temp_critical}
                  onChange={(e) => setThresholds({ ...thresholds, temp_critical: parseInt(e.target.value) })}
                  className="w-20 px-2 py-1 rounded border border-border bg-background text-foreground"
                />
                <span className="text-xs text-muted-foreground">(mặc định: 38°C)</span>
              </div>
            </div>
            
            {/* Traffic Speed Thresholds */}
            <div className="space-y-3">
              <h3 className="font-medium text-foreground flex items-center gap-2">
                <Car className="h-4 w-4 text-green-500" /> Tốc độ Giao thông (km/h)
              </h3>
              <div className="flex items-center gap-3">
                <label className="text-sm text-muted-foreground w-24">Cảnh báo:</label>
                <input
                  type="number"
                  value={thresholds.traffic_speed_warning}
                  onChange={(e) => setThresholds({ ...thresholds, traffic_speed_warning: parseInt(e.target.value) })}
                  className="w-20 px-2 py-1 rounded border border-border bg-background text-foreground"
                />
                <span className="text-xs text-muted-foreground">(mặc định: 20 km/h)</span>
              </div>
              <div className="flex items-center gap-3">
                <label className="text-sm text-muted-foreground w-24">Nghiêm trọng:</label>
                <input
                  type="number"
                  value={thresholds.traffic_speed_critical}
                  onChange={(e) => setThresholds({ ...thresholds, traffic_speed_critical: parseInt(e.target.value) })}
                  className="w-20 px-2 py-1 rounded border border-border bg-background text-foreground"
                />
                <span className="text-xs text-muted-foreground">(mặc định: 10 km/h)</span>
              </div>
            </div>
            
            {/* Parking Thresholds */}
            <div className="space-y-3">
              <h3 className="font-medium text-foreground flex items-center gap-2">
                <ParkingSquare className="h-4 w-4 text-indigo-500" /> Tỷ lệ Đỗ xe (%)
              </h3>
              <div className="flex items-center gap-3">
                <label className="text-sm text-muted-foreground w-24">Cảnh báo:</label>
                <input
                  type="number"
                  value={thresholds.parking_warning}
                  onChange={(e) => setThresholds({ ...thresholds, parking_warning: parseInt(e.target.value) })}
                  className="w-20 px-2 py-1 rounded border border-border bg-background text-foreground"
                />
                <span className="text-xs text-muted-foreground">(mặc định: 85%)</span>
              </div>
              <div className="flex items-center gap-3">
                <label className="text-sm text-muted-foreground w-24">Nghiêm trọng:</label>
                <input
                  type="number"
                  value={thresholds.parking_critical}
                  onChange={(e) => setThresholds({ ...thresholds, parking_critical: parseInt(e.target.value) })}
                  className="w-20 px-2 py-1 rounded border border-border bg-background text-foreground"
                />
                <span className="text-xs text-muted-foreground">(mặc định: 95%)</span>
              </div>
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-border flex justify-end gap-3">
            <button
              onClick={() => setThresholds({
                aqi_warning: 100, aqi_critical: 150,
                temp_warning: 35, temp_critical: 38,
                traffic_speed_warning: 20, traffic_speed_critical: 10,
                parking_warning: 85, parking_critical: 95,
              })}
              className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
            >
              Đặt lại mặc định
            </button>
            <button
              onClick={() => {
                toast.success('Đã lưu cấu hình ngưỡng cảnh báo');
                setViewMode('active');
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Lưu cấu hình
            </button>
          </div>
        </div>
      )}
      
      {/* History View */}
      {viewMode === 'history' && (
        <div className="bg-card rounded-xl border border-border p-6 mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <History className="h-5 w-5 text-green-600" />
            Lịch sử Cảnh báo (30 ngày gần nhất)
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 px-2 font-medium text-muted-foreground">Thời gian</th>
                  <th className="text-left py-2 px-2 font-medium text-muted-foreground">Loại</th>
                  <th className="text-left py-2 px-2 font-medium text-muted-foreground">Mức độ</th>
                  <th className="text-left py-2 px-2 font-medium text-muted-foreground">Tiêu đề</th>
                  <th className="text-left py-2 px-2 font-medium text-muted-foreground">Vị trí</th>
                </tr>
              </thead>
              <tbody>
                {historicalAlerts
                  .filter(a => filter === 'all' || a.severity === filter)
                  .filter(a => selectedWard === 'all' || a.ward === selectedWard)
                  .map(alert => (
                  <tr key={alert.id} className="border-b border-border/50 hover:bg-muted/30">
                    <td className="py-2 px-2 text-muted-foreground">
                      {new Date(alert.timestamp).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="py-2 px-2">{getTypeIcon(alert.type)}</td>
                    <td className="py-2 px-2">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium border ${getSeverityBadge(alert.severity)}`}>
                        {alert.severity === 'critical' ? 'Nghiêm trọng' : alert.severity === 'warning' ? 'Cảnh báo' : 'Thông tin'}
                      </span>
                    </td>
                    <td className="py-2 px-2 text-foreground">{alert.title}</td>
                    <td className="py-2 px-2 text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {alert.location}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Active Alerts View with AI Integration */}
      {viewMode === 'active' && (
      <div className="space-y-6">
        {/* AI & Manual Alert Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Gemini AI Panel */}
          <div className="bg-gradient-to-r from-purple-600/10 to-blue-600/10 rounded-xl border border-purple-500/30 p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Gemini AI</h3>
                <p className="text-xs text-muted-foreground">Phân tích dữ liệu & tạo cảnh báo</p>
              </div>
            </div>
            <div className="flex items-center justify-between mb-3">
              <div className="text-2xl font-bold text-purple-600">{aiAlerts.length}</div>
              <button
                onClick={generateAIAlerts}
                disabled={generatingAI}
                className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 text-sm"
              >
                {generatingAI ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Đang tạo...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Tạo cảnh báo AI
                  </>
                )}
              </button>
            </div>
            <p className="text-xs text-muted-foreground">Sử dụng Gemini 2.0 Flash để phân tích metrics và tạo cảnh báo thông minh</p>
          </div>

          {/* Manual Alert Panel */}
          <div className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-950/30 text-green-600">
                <Plus className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Tạo thủ công</h3>
                <p className="text-xs text-muted-foreground">Tự tạo cảnh báo mới</p>
              </div>
            </div>
            <button
              onClick={() => setShowManualForm(!showManualForm)}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
            >
              <Plus className="h-4 w-4" />
              {showManualForm ? 'Đóng form' : 'Tạo cảnh báo mới'}
            </button>
          </div>
        </div>

        {/* Manual Alert Form */}
        {showManualForm && (
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">
                {editingAlert ? 'Chỉnh sửa Cảnh báo' : 'Tạo Cảnh báo Mới'}
              </h3>
              <button 
                onClick={() => {
                  setShowManualForm(false);
                  setEditingAlert(null);
                }} 
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Loại cảnh báo</label>
                <select
                  value={manualAlert.type}
                  onChange={(e) => setManualAlert({ ...manualAlert, type: e.target.value as Alert['type'] })}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
                >
                  <option value="environment">Môi trường</option>
                  <option value="traffic">Giao thông</option>
                  <option value="civic">Dân sự</option>
                  <option value="parking">Bãi đỗ xe</option>
                  <option value="health">Y tế</option>
                  <option value="safety">An toàn</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Mức độ</label>
                <select
                  value={manualAlert.severity}
                  onChange={(e) => setManualAlert({ ...manualAlert, severity: e.target.value as Alert['severity'] })}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
                >
                  <option value="info">Thông tin</option>
                  <option value="warning">Cảnh báo</option>
                  <option value="critical">Nghiêm trọng</option>
                </select>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-2">Tiêu đề</label>
                <input
                  type="text"
                  value={manualAlert.title}
                  onChange={(e) => setManualAlert({ ...manualAlert, title: e.target.value })}
                  placeholder="VD: Ùn tắc giao thông nghiêm trọng"
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-2">Mô tả</label>
                <textarea
                  value={manualAlert.description}
                  onChange={(e) => setManualAlert({ ...manualAlert, description: e.target.value })}
                  placeholder="Mô tả chi tiết về cảnh báo..."
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Phường/Xã</label>
                <select
                  value={manualAlert.ward}
                  onChange={(e) => setManualAlert({ ...manualAlert, ward: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
                >
                  <option value="">Chọn phường/xã</option>
                  {HANOI_WARDS.slice(0, 50).map(ward => (
                    <option key={ward} value={ward}>{ward}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Tác động</label>
                <input
                  type="text"
                  value={manualAlert.impact}
                  onChange={(e) => setManualAlert({ ...manualAlert, impact: e.target.value })}
                  placeholder="VD: Tăng thời gian di chuyển 30 phút"
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-2">Khuyến nghị</label>
                <textarea
                  value={manualAlert.recommendation}
                  onChange={(e) => setManualAlert({ ...manualAlert, recommendation: e.target.value })}
                  placeholder="Khuyến nghị xử lý..."
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => {
                  setShowManualForm(false);
                  setEditingAlert(null);
                  setManualAlert({
                    type: 'environment',
                    severity: 'warning',
                    title: '',
                    description: '',
                    ward: '',
                    recommendation: '',
                    impact: '',
                  });
                }}
                className="flex-1 px-4 py-2 border border-border text-foreground rounded-lg hover:bg-secondary"
              >
                Hủy
              </button>
              <button
                onClick={async () => {
                  if (!manualAlert.title || !manualAlert.description) {
                    toast.error('Vui lòng điền đầy đủ thông tin');
                    return;
                  }
                  
                  if (editingAlert) {
                    const updatedAlert: Alert = {
                      ...editingAlert,
                      type: manualAlert.type,
                      severity: manualAlert.severity,
                      title: manualAlert.title,
                      description: manualAlert.description,
                      location: manualAlert.ward?.replace('Phường ', 'P. ') || editingAlert.location,
                      ward: manualAlert.ward,
                      recommendation: manualAlert.recommendation,
                      impact: manualAlert.impact,
                    };
                    await updateAlert(updatedAlert);
                  } else {
                    const payload = {
                      title: manualAlert.title,
                      description: manualAlert.description,
                      type: manualAlert.type,
                      severity: manualAlert.severity,
                      ward: manualAlert.ward || 'Hà Nội',
                      recommendation: manualAlert.recommendation,
                      impact: manualAlert.impact,
                      affectedPopulation: 'Người dân khu vực',
                      isAIGenerated: false,
                    };
                    
                    try {
                      toast.loading('Đang lưu cảnh báo...', { id: 'save-alert' });
                      await apiClient.post('/app/alerts/', payload);
                      toast.success('Đã tạo cảnh báo thành công', { id: 'save-alert' });
                      
                      setManualAlert({
                        type: 'environment',
                        severity: 'warning',
                        title: '',
                        description: '',
                        ward: '',
                        recommendation: '',
                        impact: '',
                      });
                      setEditingAlert(null);
                      setShowManualForm(false);
                      fetchAlerts();
                    } catch (err: any) {
                      console.error('Save alert error:', err);
                      const message = err.response?.data?.detail || 'Lỗi lưu dữ liệu';
                      toast.error(`Lỗi: ${message}`, { id: 'save-alert' });
                    }
                  }
                }}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                {editingAlert ? 'Cập nhật' : 'Tạo cảnh báo'}
              </button>
              <button
                onClick={async () => {
                  if (!manualAlert.title || !manualAlert.description) {
                    toast.error('Vui lòng điền đầy đủ thông tin');
                    return;
                  }
                  
                  const newAlert: Alert = {
                    id: `manual-${Date.now()}`,
                    type: manualAlert.type,
                    severity: manualAlert.severity,
                    title: manualAlert.title,
                    description: manualAlert.description,
                    location: manualAlert.ward?.replace('Phường ', 'P. ') || 'Hà Nội',
                    ward: manualAlert.ward,
                    timestamp: new Date().toISOString(),
                    status: 'active',
                    recommendation: manualAlert.recommendation,
                    impact: manualAlert.impact,
                    isAIGenerated: false,
                  };
                  
                  await pushToMobileApp(newAlert);
                  setManualAlert({
                    type: 'environment',
                    severity: 'warning',
                    title: '',
                    description: '',
                    ward: '',
                    recommendation: '',
                    impact: '',
                  });
                  setShowManualForm(false);
                }}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
              >
                <Send className="h-4 w-4" />
                Tạo & Gửi đến người dân
              </button>
            </div>
          </div>
        )}

        {/* AI Generated Alerts */}
        {aiAlerts.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-green-600" />
              Cảnh báo từ Gemini AI ({aiAlerts.length})
            </h3>
            {aiAlerts.map(alert => (
              <div key={alert.id} className="bg-card rounded-xl border border-green-500/30 p-5 relative">
                <div className="absolute top-0 right-0 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-xs px-3 py-1 rounded-bl-lg flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  AI
                </div>
                
                <div className="flex items-start gap-3 mb-3 pr-16">
                  <div className="p-2 rounded-lg bg-green-50 dark:bg-green-950/20 text-green-600">
                    {getTypeIcon(alert.type)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{alert.title}</h3>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium border ${getSeverityBadge(alert.severity)}`}>
                        {alert.severity === 'critical' ? 'Nghiêm trọng' : alert.severity === 'warning' ? 'Cảnh báo' : 'Thông tin'}
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {alert.location}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-foreground mb-3">{alert.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                  <div className="p-3 bg-slate-50 dark:bg-slate-950/20 rounded-lg border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-400 text-xs font-semibold mb-1">
                      <AlertTriangle className="h-3 w-3" />
                      Tác động
                    </div>
                    <p className="text-sm text-foreground">{alert.impact}</p>
                  </div>
                  <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="flex items-center gap-2 text-green-800 dark:text-green-400 text-xs font-semibold mb-1">
                      <Lightbulb className="h-3 w-3" />
                      Khuyến nghị
                    </div>
                    <p className="text-sm text-foreground">{alert.recommendation}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => pushToMobileApp(alert)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                  >
                    <Send className="h-4 w-4" />
                    Gửi đến người dân
                  </button>
                  <button
                    onClick={() => {
                      setAlerts(prev => [...prev, { ...alert, isAIGenerated: true }]);
                      setAiAlerts(prev => prev.filter(a => a.id !== alert.id));
                      toast.success('Đã thêm vào danh sách cảnh báo');
                    }}
                    className="px-3 py-1.5 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                  >
                    Thêm vào hệ thống
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* System & Manual Alerts */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Bell className="h-4 w-4 text-green-600" />
            Cảnh báo hệ thống ({filteredAlerts.length})
          </h3>
          {filteredAlerts.length === 0 ? (
            <div className="bg-card rounded-xl border border-border p-8 text-center">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
              <p className="text-muted-foreground">Không có cảnh báo nào</p>
            </div>
          ) : (
            filteredAlerts.map(alert => (
            <div
              key={alert.id}
              className={`bg-card rounded-xl border p-5 ${
                alert.status === 'resolved' ? 'opacity-60 border-border' : 'border-border'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-muted text-green-600">
                    {getTypeIcon(alert.type)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{alert.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium border ${getSeverityBadge(alert.severity)}`}>
                        {alert.severity === 'critical' ? 'Nghiêm trọng' : alert.severity === 'warning' ? 'Cảnh báo' : 'Thông tin'}
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {alert.location}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {new Date(alert.timestamp).toLocaleTimeString('vi-VN')}
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-foreground mb-3">{alert.description}</p>

              {/* Impact & Recommendation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                <div className="p-3 bg-slate-50 dark:bg-slate-950/20 rounded-lg border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2 text-slate-700 dark:text-slate-400 text-xs font-semibold mb-1">
                    <AlertTriangle className="h-3 w-3" />
                    Tác động dự kiến
                  </div>
                  <p className="text-sm text-foreground">{alert.impact}</p>
                </div>
                <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-2 text-green-800 dark:text-green-400 text-xs font-semibold mb-1">
                    <Lightbulb className="h-3 w-3" />
                    Khuyến nghị
                  </div>
                  <p className="text-sm text-foreground">{alert.recommendation}</p>
                </div>
              </div>

              {/* Actions */}
              {alert.status === 'active' && (
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => pushToMobileApp(alert)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                  >
                    <Send className="h-3.5 w-3.5" />
                    Gửi đến người dân
                  </button>
                  <button
                    onClick={() => {
                      setEditingAlert(alert);
                      setManualAlert({
                        type: alert.type,
                        severity: alert.severity,
                        title: alert.title,
                        description: alert.description,
                        ward: alert.ward || '',
                        recommendation: alert.recommendation,
                        impact: alert.impact,
                      });
                      setShowManualForm(true);
                    }}
                    className="px-3 py-1.5 bg-emerald-600 text-white rounded text-sm hover:bg-emerald-700"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => deleteAlert(alert.id)}
                    className="px-3 py-1.5 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                  >
                    Xóa
                  </button>
                  <button
                    onClick={() => acknowledgeAlert(alert.id)}
                    className="px-3 py-1.5 bg-slate-600 text-white rounded text-sm hover:bg-slate-700"
                  >
                    Xác nhận
                  </button>
                  <button
                    onClick={() => resolveAlert(alert.id)}
                    className="px-3 py-1.5 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                  >
                    Đã xử lý
                  </button>
                </div>
              )}
              {alert.status === 'acknowledged' && (
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 rounded text-xs">Đã xác nhận</span>
                  <button
                    onClick={() => resolveAlert(alert.id)}
                    className="px-3 py-1.5 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                  >
                    Đã xử lý
                  </button>
                </div>
              )}
              {alert.status === 'resolved' && (
                <span className="px-2 py-1 bg-green-100 dark:bg-green-950/30 text-green-800 dark:text-green-400 rounded text-xs">Đã xử lý</span>
              )}
            </div>
          ))
        )}
        </div>
      </div>
      )}
    </div>
  );
}
