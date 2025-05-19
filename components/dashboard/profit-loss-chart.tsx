"use client"

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  {
    name: "Jan",
    revenue: 134000,
    expenses: 94000,
    profit: 40000,
  },
  {
    name: "Feb",
    revenue: 148000,
    expenses: 105000,
    profit: 43000,
  },
  {
    name: "Mar",
    revenue: 162000,
    expenses: 107000,
    profit: 55000,
  },
  {
    name: "Apr",
    revenue: 159000,
    expenses: 106000,
    profit: 53000,
  },
  {
    name: "May",
    revenue: 175000,
    expenses: 108000,
    profit: 67000,
  },
]

export function ProfitLossChart() {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value / 1000}k`}
        />
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
        <Legend />
        <Bar dataKey="revenue" name="Revenue" fill="#4f46e5" radius={[4, 4, 0, 0]} />
        <Bar dataKey="expenses" name="Expenses" fill="#f43f5e" radius={[4, 4, 0, 0]} />
        <Bar dataKey="profit" name="Profit" fill="#10b981" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
