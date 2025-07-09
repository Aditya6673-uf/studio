"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AddTransactionSheet } from "@/components/add-transaction-sheet";
import { initialTransactions, initialAccounts } from "@/lib/data";
import type { Transaction, Account } from "@/lib/types";
import { format } from "date-fns";
import { IndianRupee, ArrowUpRight, ArrowDownLeft, PlusCircle, Landmark, Wallet, CreditCard } from 'lucide-react';
import { SidebarTrigger } from "@/components/ui/sidebar";

const paymentMethodIcons = {
  UPI: <Landmark className="h-4 w-4 text-muted-foreground" />,
  Cash: <Wallet className="h-4 w-4 text-muted-foreground" />,
  Card: <CreditCard className="h-4 w-4 text-muted-foreground" />,
};

export default function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [accounts, setAccounts] = useState<Account[]>(initialAccounts);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const { totalIncome, totalExpenses, netBalance } = useMemo(() => {
    let income = 0;
    let expenses = 0;
    transactions.forEach(t => {
      if (t.type === 'income') {
        income += t.amount;
      } else {
        expenses += t.amount;
      }
    });
    return { totalIncome: income, totalExpenses: expenses, netBalance: income - expenses };
  }, [transactions]);
  
  const budget = { amount: 50000, spent: totalExpenses };
  const budgetProgress = (budget.spent / budget.amount) * 100;

  const handleAddTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: (transactions.length + 1).toString(),
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };
  
  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="md:hidden" />
          <h1 className="font-headline text-3xl font-bold">Dashboard</h1>
        </div>
        <Button onClick={() => setIsSheetOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Transaction
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="font-headline text-2xl font-bold flex items-center">
              <IndianRupee className="h-6 w-6" />{totalIncome.toLocaleString('en-IN')}
            </div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <ArrowDownLeft className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="font-headline text-2xl font-bold flex items-center">
              <IndianRupee className="h-6 w-6" />{totalExpenses.toLocaleString('en-IN')}
            </div>
            <p className="text-xs text-muted-foreground">+12.5% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`font-headline text-2xl font-bold flex items-center ${netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              <IndianRupee className="h-6 w-6" />{netBalance.toLocaleString('en-IN')}
            </div>
            <p className="text-xs text-muted-foreground">Your financial health</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-5">
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
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
                {transactions.slice(0, 5).map(t => (
                  <TableRow key={t.id}>
                    <TableCell>
                      <div className="font-medium">{t.category}</div>
                      <div className="text-sm text-muted-foreground">{t.notes}</div>
                    </TableCell>
                    <TableCell>{format(t.date, 'dd MMM, yyyy')}</TableCell>
                    <TableCell>
                      {paymentMethodIcons[t.paymentMethod]}
                    </TableCell>
                    <TableCell className={`text-right font-medium ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                      {t.type === 'income' ? '+' : '-'} <IndianRupee className="inline h-4 w-4" />{t.amount.toLocaleString('en-IN')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="md:col-span-2 flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Budget</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-2 flex justify-between text-sm">
                <span>Spent: <IndianRupee className="inline h-4 w-4" />{budget.spent.toLocaleString('en-IN')}</span>
                <span>Total: <IndianRupee className="inline h-4 w-4" />{budget.amount.toLocaleString('en-IN')}</span>
              </div>
              <Progress value={budgetProgress} />
              <p className="mt-2 text-xs text-muted-foreground">
                {budgetProgress.toFixed(0)}% of your monthly budget used.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Accounts</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {accounts.map(account => (
                  <li key={account.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{account.name}</p>
                      <p className="text-sm text-muted-foreground">{account.type}</p>
                    </div>
                    <div className="font-mono font-medium flex items-center"><IndianRupee className="h-4 w-4" />{account.balance.toLocaleString('en-IN')}</div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
      <AddTransactionSheet
        isOpen={isSheetOpen}
        setIsOpen={setIsSheetOpen}
        onAddTransaction={handleAddTransaction}
      />
    </main>
  );
}
