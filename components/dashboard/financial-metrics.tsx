"use client"

import { Line, LineChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  {
    name: "Jan",
    revenue: 34000,
    expenses: 24000,
    profit: 10000,
  },
  {
    name: "Feb",
    revenue: 38000,
    expenses: 25000,
    profit: 13000,
  },
  {
    name: "Mar",
    revenue: 42000,
    expenses: 27000,
    profit: 15000,
  },
  {
    name: "Apr",
    revenue: 39000,
    expenses: 26000,
    profit: 13000,
  },
  {
    name: "May",
    revenue: 45000,
    expenses: 28000,
    profit: 17000,
  },
]

export function FinancialMetrics() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#4f46e5" activeDot={{ r: 8 }} />
        <Line type="monotone" dataKey="expenses" name="Expenses" stroke="#f43f5e" />
        <Line type="monotone" dataKey="profit" name="Profit" stroke="#10b981" />
      </LineChart>
    </ResponsiveContainer>
  )
}
