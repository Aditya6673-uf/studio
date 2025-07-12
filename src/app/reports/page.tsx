

"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileDown, IndianRupee, ChevronLeft, ChevronRight } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  format,
  subDays,
  addDays,
  startOfDay,
  endOfDay,
  eachDayOfInterval,
  subWeeks,
  addWeeks,
  startOfWeek,
  endOfWeek,
  subMonths,
  addMonths,
  startOfMonth,
  endOfMonth,
  subYears,
  addYears,
  startOfYear,
  endOfYear,
  isWithinInterval,
} from "date-fns";
import type { Transaction } from "@/lib/types";
import { useTransactions } from "@/context/transactions-context";
import { ExportDataDialog } from "@/components/export-data-dialog";
import { AdBanner } from "@/components/ad-banner";
import { useSubscription } from "@/context/subscription-context";

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

const ReportChart = ({ data, dataKey, onBarClick }: { data: any[], dataKey: string, onBarClick: (data: any) => void }) => (
  <ResponsiveContainer width="100%" height={350}>
    <BarChart data={data} onClick={onBarClick}>
      <XAxis dataKey={dataKey} stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
      <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={formatYAxisValue} />
      <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--accent))' }} />
      <Bar dataKey="income" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
      <Bar dataKey="expenses" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
    </BarChart>
  </ResponsiveContainer>
);

export default function ReportsPage() {
  const { transactions } = useTransactions();
  const [selectedTransactions, setSelectedTransactions] = useState<Transaction[] | null>(null);
  const [dialogTitle, setDialogTitle] = useState("");
  const [activeTab, setActiveTab] = useState("monthly");
  const [offset, setOffset] = useState(0);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const { isSubscribed } = useSubscription();

  const { dailyData, weeklyData, monthlyData, yearlyData, rangeDescription } = useMemo(() => {
    const processTransactionsForPeriod = (transactionsToProcess: Transaction[], startDate: Date, endDate: Date) => {
      const periodTransactions = transactionsToProcess.filter(t => isWithinInterval(new Date(t.date), { start: startDate, end: endDate }));
      let income = 0;
      let expenses = 0;
      periodTransactions.forEach(t => {
        if (t.type === 'income') {
          income += t.amount;
        } else {
          expenses += t.amount;
        }
      });
      return { income, expenses, transactions: periodTransactions };
    };

    const now = new Date();
    
    // Daily
    const dailyRefDate = addDays(now, offset * 7);
    const dailyStart = startOfDay(subDays(dailyRefDate, 6));
    const dailyEnd = endOfDay(dailyRefDate);
    const dailyData = eachDayOfInterval({ start: dailyStart, end: dailyEnd }).map(date => {
        const { income, expenses, transactions: periodTransactions } = processTransactionsForPeriod(transactions, startOfDay(date), endOfDay(date));
        return { date: format(date, 'EEE'), income, expenses, transactions: periodTransactions, fullDate: format(date, 'dd MMM, yyyy') };
    });

    // Weekly
    const weeklyRefDate = addWeeks(now, offset * 4);
    const weeklyStart = startOfWeek(subWeeks(weeklyRefDate, 3));
    const weeklyEnd = endOfWeek(weeklyRefDate);
    const weeklyData = Array.from({ length: 4 }).map((_, i) => {
        const weekStart = startOfWeek(subWeeks(weeklyRefDate, 3 - i));
        const weekEnd = endOfWeek(subWeeks(weeklyRefDate, 3 - i));
        const { income, expenses, transactions: periodTransactions } = processTransactionsForPeriod(transactions, weekStart, weekEnd);
        return { week: `Week of ${format(weekStart, 'MMM d')}`, income, expenses, transactions: periodTransactions };
    });

    // Monthly
    const monthlyRefDate = addMonths(now, offset * 6);
    const monthlyStart = startOfMonth(subMonths(monthlyRefDate, 5));
    const monthlyEnd = endOfMonth(monthlyRefDate);
    const monthlyData = Array.from({ length: 6 }).map((_, i) => {
        const monthStart = startOfMonth(subMonths(monthlyRefDate, 5 - i));
        const { income, expenses, transactions: periodTransactions } = processTransactionsForPeriod(transactions, monthStart, endOfMonth(monthStart));
        return { month: format(monthStart, 'MMM yyyy'), income, expenses, transactions: periodTransactions };
    });
    
    // Yearly
    const yearlyRefDate = addYears(now, offset * 4);
    const yearlyStart = startOfYear(subYears(yearlyRefDate, 3));
    const yearlyEnd = endOfYear(yearlyRefDate);
    const yearlyData = Array.from({ length: 4 }).map((_, i) => {
        const yearStart = startOfYear(subYears(yearlyRefDate, 3 - i));
        const { income, expenses, transactions: periodTransactions } = processTransactionsForPeriod(transactions, yearStart, endOfYear(yearStart));
        return { year: format(yearStart, 'yyyy'), income, expenses, transactions: periodTransactions };
    });

    const descriptions: { [key: string]: string } = {
        daily: `Showing data for ${format(dailyStart, 'dd MMM')} - ${format(dailyEnd, 'dd MMM, yyyy')}`,
        weekly: `Showing data for ${format(weeklyStart, 'dd MMM')} - ${format(weeklyEnd, 'dd MMM, yyyy')}`,
        monthly: `Showing data for ${format(monthlyStart, 'MMM yyyy')} - ${format(monthlyEnd, 'MMM yyyy')}`,
        yearly: `Showing data for ${format(yearlyStart, 'yyyy')} - ${format(yearlyEnd, 'yyyy')}`,
    };

    return { dailyData, weeklyData, monthlyData, yearlyData, rangeDescription: descriptions[activeTab] };
  }, [transactions, activeTab, offset]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setOffset(0);
  };
  
  const handleBarClick = (data: any) => {
    if (data && data.activePayload && data.activePayload.length > 0) {
      const payload = data.activePayload[0].payload;
      if (payload.transactions) {
        setSelectedTransactions(payload.transactions);
        setDialogTitle(`Transactions for ${payload.fullDate || payload.week || payload.month || payload.year}`);
      }
    }
  };
  
  const handleExport = (startDate?: Date, endDate?: Date) => {
    let transactionsToExport = transactions;
    if (startDate && endDate) {
      transactionsToExport = transactions.filter(t => 
        isWithinInterval(new Date(t.date), { start: startOfDay(startDate), end: endOfDay(endDate) })
      );
    }
    
    const headers = "ID,Type,Amount,Category,Date,Payment Method,Notes\n";
    const csv = transactionsToExport.map(t =>
      `${t.id},${t.type},${t.amount},"${t.category}","${new Date(t.date).toISOString()}","${t.paymentMethod}","${t.notes || ''}"`
    ).join("\n");
    const blob = new Blob([headers + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    const fileName = `RupeeRoute_Transactions_${format(startDate || new Date(0), 'yyyy-MM-dd')}_to_${format(endDate || new Date(), 'yyyy-MM-dd')}.csv`;
    link.setAttribute("href", url);
    link.setAttribute("download", fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setIsExportDialogOpen(false);
  };

  return (
    <>
    <main className="flex-1 overflow-y-auto p-4 md:p-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="md:hidden" />
          <h1 className="font-headline text-3xl font-bold">Reports</h1>
        </div>
        <Button onClick={() => setIsExportDialogOpen(true)} variant="outline">
          <FileDown className="mr-2 h-4 w-4" />
          Export Data
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Income vs. Expenses</CardTitle>
              <CardDescription>{rangeDescription}</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setOffset(o => o - 1)}>
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous period</span>
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setOffset(o => o + 1)} disabled={offset >= 0}>
                <ChevronRight className="h-4 w-4" />
                 <span className="sr-only">Next period</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList>
              <TabsTrigger value="daily">Daily</TabsTrigger>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="yearly">Yearly</TabsTrigger>
            </TabsList>
            <TabsContent value="daily" className="pt-4">
              <ReportChart data={dailyData} dataKey="date" onBarClick={handleBarClick} />
            </TabsContent>
            <TabsContent value="weekly" className="pt-4">
              <ReportChart data={weeklyData} dataKey="week" onBarClick={handleBarClick} />
            </TabsContent>
            <TabsContent value="monthly" className="pt-4">
              <ReportChart data={monthlyData} dataKey="month" onBarClick={handleBarClick} />
            </TabsContent>
            <TabsContent value="yearly" className="pt-4">
              <ReportChart data={yearlyData} dataKey="year" onBarClick={handleBarClick} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {!isSubscribed && (
        <div className="mt-6">
          <AdBanner />
        </div>
      )}
    </main>

    <Dialog open={selectedTransactions !== null} onOpenChange={(isOpen) => !isOpen && setSelectedTransactions(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{dialogTitle}</DialogTitle>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedTransactions && selectedTransactions.length > 0 ? (
                  selectedTransactions.map(t => (
                    <TableRow key={t.id}>
                      <TableCell>
                        <div className="font-medium">{t.category}</div>
                        <div className="text-sm text-muted-foreground">{t.notes}</div>
                      </TableCell>
                      <TableCell>{format(new Date(t.date), 'dd MMM, yyyy')}</TableCell>
                      <TableCell>{t.paymentMethod}</TableCell>
                      <TableCell className={`text-right font-medium ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                        {t.type === 'income' ? '+' : '-'} <IndianRupee className="inline h-4 w-4" />{t.amount.toLocaleString('en-IN')}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">No transactions for this period.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>
      <ExportDataDialog 
        isOpen={isExportDialogOpen}
        setIsOpen={setIsExportDialogOpen}
        onExport={handleExport}
      />
    </>
  );
}
