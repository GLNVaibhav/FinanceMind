"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from "recharts"

const data = [
  { name: "Accounting", value: 35, color: "#4f46e5" },
  { name: "Bookkeeping", value: 25, color: "#10b981" },
  { name: "Financial Analysis", value: 20, color: "#f43f5e" },
  { name: "Bank Reconciliation", value: 15, color: "#f59e0b" },
  { name: "Other", value: 5, color: "#6b7280" },
]

export function WorkAllocationChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => `${value}%`} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}
