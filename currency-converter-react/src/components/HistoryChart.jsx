import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function HistoryChart({ data }) {
    if (!data || data.length === 0) return null;

    return (
        <div className="h-48 md:h-64 w-full mt-4">
            <h3 className="text-gray-300 text-sm font-medium mb-2">30-Day Trend</h3>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                    <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#9ca3af', fontSize: 12 }}
                        interval={6}
                    />
                    <YAxis
                        hide domain={['auto', 'auto']}
                    />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                        itemStyle={{ color: '#60a5fa' }}
                        labelStyle={{ color: '#9ca3af' }}
                        formatter={(value) => [value.toFixed(4), 'Rate']}
                    />
                    <Area
                        type="monotone"
                        dataKey="rate"
                        stroke="#3b82f6"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorRate)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
