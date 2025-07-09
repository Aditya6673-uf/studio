"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileDown, IndianRupee } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { initialTransactions } from "@/lib/data";
import { SidebarTrigger } from "@/components/ui/sidebar";

const dailyData = [
  { date: "Mon", income: 2000, expenses: 1500 },
  { date: "Tue", income: 0, expenses: 800 },
  { date: "Wed", income: 5000, expenses: 2200 },
  { date: "Thu", income: 0, expenses: 500 },
  { date: "Fri", income: 1500, expenses: 3000 },
  { date: "Sat", income: 0, expenses: 4500 },
  { date: "Sun", income: 0, expenses: 1200 },
];

const weeklyData = [
  { week: "Week 1", income: 15000, expenses: 12000 },
  { week: "Week 2", income: 20000, expenses: 18000 },
  { week: "Week 3", income: 18000, expenses: 16000 },
  { week: "Week 4", income: 25000, expenses: 22000 },
];

const monthlyData = [
  { month: "Jan", income: 80000, expenses: 65000 },
  { month: "Feb", income: 85000, expenses: 70000 },
  { month: "Mar", income: 90000, expenses: 75000 },
  { month: "Apr", income: 82000, expenses: 68000 },
  { month: "May", income: 95000, expenses: 80000 },
  { month: "Jun", income: 88000, expenses: 72000 },
];

const yearlyData = [
  { year: "2021", income: 950000, expenses: 800000 },
  { year: "2022", income: 1050000, expenses: 880000 },
  { year: "2023", income: 1200000, expenses: 950000 },
  { year: "2024", income: 650000, expenses: 550000 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col space-y-1">
            <span className="text-xs uppercase text-muted-foreground">{label}</span>
            <span className="font-bold text-green-500 flex items-center">
              <IndianRupee className="h-4 w-4" />{payload[0].value.toLocaleString('en-IN')}
            </span>
            <span className="font-bold text-red-500 flex items-center">
              <IndianRupee className="h-4 w-4" />{payload[1].value.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

const formatYAxisValue = (value: number) => {
  if (value >= 100000) {
    return `₹${(value / 100000).toFixed(1)}L`;
  }
  if (value >= 1000) {
    return `₹${(value / 1000).toFixed(0)}k`;
  }
  return `₹${value}`;
};


const ReportChart = ({ data, dataKey }: { data: any[], dataKey: string }) => (
  <ResponsiveContainer width="100%" height={350}>
    <BarChart data={data}>
      <XAxis dataKey={dataKey} stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
      <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={formatYAxisValue} />
      <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--accent))' }} />
      <Bar dataKey="income" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
      <Bar dataKey="expenses" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
    </BarChart>
  </ResponsiveContainer>
);

export default function ReportsPage() {
  const exportData = () => {
    const headers = "ID,Type,Amount,Category,Date,Payment Method,Notes\n";
    const csv = initialTransactions.map(t =>
      `${t.id},${t.type},${t.amount},"${t.category}","${t.date.toISOString()}","${t.paymentMethod}","${t.notes || ''}"`
    ).join("\n");
    const blob = new Blob([headers + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "RupeeRoute_Transactions.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="md:hidden" />
          <h1 className="font-headline text-3xl font-bold">Reports</h1>
        </div>
        <Button onClick={exportData} variant="outline">
          <FileDown className="mr-2 h-4 w-4" />
          Export Data
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Income vs. Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="monthly" className="w-full">
            <TabsList>
              <TabsTrigger value="daily">Daily</TabsTrigger>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="yearly">Yearly</TabsTrigger>
            </TabsList>
            <TabsContent value="daily" className="pt-4">
              <ReportChart data={dailyData} dataKey="date" />
            </TabsContent>
            <TabsContent value="weekly" className="pt-4">
              <ReportChart data={weeklyData} dataKey="week" />
            </TabsContent>
            <TabsContent value="monthly" className="pt-4">
              <ReportChart data={monthlyData} dataKey="month" />
            </TabsContent>
            <TabsContent value="yearly" className="pt-4">
              <ReportChart data={yearlyData} dataKey="year" />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </main>
  );
}
