"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { initialTransactions } from "@/lib/data";
import type { Transaction } from "@/lib/types";
import { format } from "date-fns";
import { IndianRupee, Repeat } from 'lucide-react';
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function FixedCostsPage() {
  const [transactions] = useState<Transaction[]>(initialTransactions);

  const fixedCostTransactions = useMemo(() => {
    const fixedCategories = ['Rent', 'EMI', 'SIP'];
    return transactions
      .filter(t => t.type === 'expense' && fixedCategories.includes(t.category))
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [transactions]);

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-8">
      <div className="mb-6 flex items-center gap-4">
        <SidebarTrigger className="md:hidden" />
        <div className="flex items-center gap-2">
            <Repeat className="h-8 w-8 text-primary" />
            <h1 className="font-headline text-3xl font-bold">Fixed Costs</h1>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Recurring Expenses</CardTitle>
          <CardDescription>A list of your regular, predictable expenses like rent, EMIs, and SIPs.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Date Paid</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fixedCostTransactions.length > 0 ? (
                fixedCostTransactions.map(t => (
                  <TableRow key={t.id}>
                    <TableCell>
                      <div className="font-medium">{t.category}</div>
                      {t.notes && <div className="text-sm text-muted-foreground">{t.notes}</div>}
                    </TableCell>
                    <TableCell>{format(t.date, 'dd MMM, yyyy')}</TableCell>
                    <TableCell className="text-right font-medium text-red-600">
                      - <IndianRupee className="inline h-4 w-4" />{t.amount.toLocaleString('en-IN')}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center">
                    No fixed costs recorded yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
}
