"use client"

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  {
    name: "John D.",
    assigned: 24,
    completed: 21,
  },
  {
    name: "Sarah M.",
    assigned: 18,
    completed: 17,
  },
  {
    name: "Robert K.",
    assigned: 22,
    completed: 19,
  },
  {
    name: "Lisa T.",
    assigned: 15,
    completed: 14,
  },
  {
    name: "Michael P.",
    assigned: 20,
    completed: 16,
  },
]

export function EmployeeProductivity() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <Tooltip />
        <Legend />
        <Bar dataKey="assigned" name="Tasks Assigned" fill="#4f46e5" radius={[4, 4, 0, 0]} />
        <Bar dataKey="completed" name="Tasks Completed" fill="#10b981" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
