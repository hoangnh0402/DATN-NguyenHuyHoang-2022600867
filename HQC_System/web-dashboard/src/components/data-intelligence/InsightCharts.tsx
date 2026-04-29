// Copyright (c) 2025 HQC System Contributors
// Licensed under the GNU General Public License v3.0 (GPL-3.0)

'use client';

/**
 * Lazy-loaded Recharts wrapper components.
 * This file is dynamically imported to avoid loading the ~200KB recharts
 * library in the initial bundle.
 */

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// ============================================
// Correlation Chart (Line)
// ============================================
export function CorrelationChart({ data }: { data: any[] }) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="hour" tick={{ fontSize: 12 }} />
        <YAxis yAxisId="temp" orientation="left" tick={{ fontSize: 12 }} />
        <YAxis yAxisId="aqi" orientation="right" tick={{ fontSize: 12 }} />
        <Tooltip 
          contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
        />
        <Legend />
        <Line 
          yAxisId="temp"
          type="monotone" 
          dataKey="temperature" 
          stroke="#16a34a" 
          strokeWidth={2}
          name="Nhiệt độ (°C)"
          dot={false}
        />
        <Line 
          yAxisId="aqi"
          type="monotone" 
          dataKey="aqi" 
          stroke="#2563eb" 
          strokeWidth={2}
          name="AQI"
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

// ============================================
// Ward Comparison Chart (Bar)
// ============================================
export function WardComparisonChart({ data }: { data: any[] }) {
  return (
    <ResponsiveContainer width="100%" height={Math.max(350, data.length * 35)}>
      <BarChart data={data} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
        <YAxis 
          type="category" 
          dataKey="ward" 
          tick={{ fontSize: 11 }} 
          width={120}
          tickFormatter={(val: string) => val.replace('Phường ', 'P. ').replace('Xã ', 'X. ')}
        />
        <Tooltip 
          contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
        />
        <Legend />
        <Bar dataKey="aqi_score" fill="#16a34a" name="Môi trường" />
        <Bar dataKey="traffic_score" fill="#f59e0b" name="Giao thông" />
        <Bar dataKey="civic_score" fill="#2563eb" name="Dân sự" />
        <Bar dataKey="parking_score" fill="#7c3aed" name="Bãi đỗ xe" />
      </BarChart>
    </ResponsiveContainer>
  );
}

// ============================================
// Temporal Chart (Line)
// ============================================
export function TemporalChart({ data }: { data: any[] }) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="hour" tick={{ fontSize: 12 }} />
        <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
        <Tooltip 
          contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
        />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="traffic" 
          stroke="#dc2626" 
          strokeWidth={2}
          name="Giao thông (%)"
          dot={false}
        />
        <Line 
          type="monotone" 
          dataKey="parking" 
          stroke="#7c3aed" 
          strokeWidth={2}
          name="Bãi đỗ xe (%)"
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
