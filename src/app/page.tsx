
"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AddTransactionSheet } from "@/components/add-transaction-sheet";
import { initialTransactions, initialAccounts } from "@/lib/data";
import type { Transaction, Account } from "@/lib/types";
import { format } from "date-fns";
import { IndianRupee, ArrowUpRight, ArrowDownLeft, PlusCircle, Landmark, Wallet, CreditCard, Pencil, Check, X, Trash2 } from 'lucide-react';
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const paymentMethodIcons = {
  UPI: <Landmark className="h-4 w-4 text-muted-foreground" />,
  Cash: <Wallet className="h-4 w-4 text-muted-foreground" />,
  Card: <CreditCard className="h-4 w-4 text-muted-foreground" />,
};

export default function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [accounts, setAccounts] = useState<Account[]>(initialAccounts);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [savingsGoal, setSavingsGoal] = useState(25000);
  const [savingsInput, setSavingsInput] = useState(savingsGoal.toString());
  const [isEditingAccounts, setIsEditingAccounts] = useState(false);
  const [editedAccountBalances, setEditedAccountBalances] = useState<Record<string, string>>({});

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
  
  const savingsProgress = savingsGoal > 0 ? (Math.max(0, netBalance) / savingsGoal) * 100 : 0;

  const handleAddTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: new Date().getTime().toString(),
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };
  
  const handleDeleteTransaction = (transactionId: string) => {
    setTransactions((prevTransactions) =>
      prevTransactions.filter((transaction) => transaction.id !== transactionId)
    );
  };

  const handleSetSavingsGoal = () => {
    const newAmount = parseFloat(savingsInput);
    if (!isNaN(newAmount) && newAmount > 0) {
      setSavingsGoal(newAmount);
    } else {
      setSavingsInput(savingsGoal.toString());
    }
  };

  const handleEditAccountsClick = () => {
    const initialBalances = accounts.reduce((acc, account) => {
      acc[account.id] = account.balance.toString();
      return acc;
    }, {} as Record<string, string>);
    setEditedAccountBalances(initialBalances);
    setIsEditingAccounts(true);
  };

  const handleSaveAccountBalances = () => {
    setAccounts(prevAccounts =>
      prevAccounts.map(account => {
        const newBalance = parseFloat(editedAccountBalances[account.id]);
        return {
          ...account,
          balance: isNaN(newBalance) ? account.balance : newBalance,
        };
      })
    );
    setIsEditingAccounts(false);
  };

  const handleAccountBalanceChange = (accountId: string, value: string) => {
    setEditedAccountBalances(prev => ({ ...prev, [accountId]: value }));
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
                  <TableHead className="w-[50px]"><span className="sr-only">Actions</span></TableHead>
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
                    <TableCell>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete transaction</span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete this transaction record.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteTransaction(t.id)}>
                              Continue
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
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
              <CardTitle>Monthly Savings Goal</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="mb-4 space-y-2">
                <Label htmlFor="savings-goal-input">Set Your Monthly Savings Goal</Label>
                <div className="flex gap-2">
                  <Input
                    id="savings-goal-input"
                    type="number"
                    placeholder="e.g. 25000"
                    value={savingsInput}
                    onChange={(e) => setSavingsInput(e.target.value)}
                  />
                  <Button onClick={handleSetSavingsGoal}>Set</Button>
                </div>
              </div>
              <div className="mb-2 flex justify-between text-sm">
                <span>Saved: <IndianRupee className="inline h-4 w-4" />{Math.max(0, netBalance).toLocaleString('en-IN')}</span>
                <span>Goal: <IndianRupee className="inline h-4 w-4" />{savingsGoal.toLocaleString('en-IN')}</span>
              </div>
              <Progress value={savingsProgress} />
              <p className="mt-2 text-xs text-muted-foreground">
                {savingsProgress > 0 ? `${savingsProgress.toFixed(0)}% of your savings goal achieved.` : 'Set a savings goal to get started.'}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Accounts</CardTitle>
              <div className="flex items-center gap-1">
                {isEditingAccounts ? (
                  <>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleSaveAccountBalances}>
                      <Check className="h-4 w-4" />
                      <span className="sr-only">Save</span>
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsEditingAccounts(false)}>
                      <X className="h-4 w-4" />
                      <span className="sr-only">Cancel</span>
                    </Button>
                  </>
                ) : (
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleEditAccountsClick}>
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Edit Accounts</span>
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {accounts.map(account => (
                  <li key={account.id} className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-medium">{account.name}</p>
                      <p className="text-sm text-muted-foreground">{account.type}</p>
                    </div>
                    {isEditingAccounts ? (
                       <div className="flex items-center gap-2">
                        <IndianRupee className="h-4 w-4 text-muted-foreground" />
                        <Input
                          type="number"
                          value={editedAccountBalances[account.id] || ''}
                          onChange={(e) => handleAccountBalanceChange(account.id, e.target.value)}
                          className="h-8 w-28 text-right font-mono"
                        />
                      </div>
                    ) : (
                      <div className="font-mono font-medium flex items-center">
                        <IndianRupee className="h-4 w-4" />{account.balance.toLocaleString('en-IN')}
                      </div>
                    )}
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
