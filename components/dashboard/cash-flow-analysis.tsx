"use client"

import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  {
    name: "Jan",
    inflow: 134000,
    outflow: 94000,
    balance: 40000,
  },
  {
    name: "Feb",
    inflow: 148000,
    outflow: 105000,
    balance: 83000,
  },
  {
    name: "Mar",
    inflow: 162000,
    outflow: 107000,
    balance: 138000,
  },
  {
    name: "Apr",
    inflow: 159000,
    outflow: 106000,
    balance: 191000,
  },
  {
    name: "May",
    inflow: 175000,
    outflow: 108000,
    balance: 258000,
  },
]

export function CashFlowAnalysis() {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <AreaChart data={data}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value / 1000}k`}
        />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
        <Legend />
        <Area type="monotone" dataKey="inflow" name="Cash Inflow" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.2} />
        <Area type="monotone" dataKey="outflow" name="Cash Outflow" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.2} />
        <Area type="monotone" dataKey="balance" name="Cash Balance" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
      </AreaChart>
    </ResponsiveContainer>
  )
}
