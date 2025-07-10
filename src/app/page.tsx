
"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AddTransactionSheet } from "@/components/add-transaction-sheet";
import { initialAccounts } from "@/lib/data";
import type { Transaction, Account } from "@/lib/types";
import { format, startOfMonth, endOfMonth, subMonths, isWithinInterval, startOfDay, endOfDay } from "date-fns";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useTransactions } from "@/context/transactions-context";
import { useLocalStorage } from "@/hooks/use-local-storage";

const paymentMethodIcons = {
  UPI: <Landmark className="h-4 w-4 text-muted-foreground" />,
  Cash: <Wallet className="h-4 w-4 text-muted-foreground" />,
  Card: <CreditCard className="h-4 w-4 text-muted-foreground" />,
};

export default function Dashboard() {
  const { transactions, addTransaction, deleteTransaction } = useTransactions();
  const [accounts, setAccounts] = useLocalStorage<Account[]>('rupee-route-accounts', initialAccounts);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [sheetDefaultType, setSheetDefaultType] = useState<'income' | 'expense' | undefined>(undefined);
  const [savingsGoal, setSavingsGoal] = useState(25000);
  const [savingsInput, setSavingsInput] = useState(savingsGoal.toString());
  const [isEditingAccounts, setIsEditingAccounts] = useState(false);
  const [editedAccountBalances, setEditedAccountBalances] = useState<Record<string, string>>({});

  const [isIncomeDialogOpen, setIsIncomeDialogOpen] = useState(false);
  const [incomeInput, setIncomeInput] = useState("");

  const { monthlyIncome, monthlyExpenses, netBalance, incomeChange, expenseChange } = useMemo(() => {
    const now = new Date();
    const currentMonthStart = startOfMonth(now);
    const currentMonthEnd = endOfMonth(now);
    const prevMonthStart = startOfMonth(subMonths(now, 1));
    const prevMonthEnd = endOfMonth(subMonths(now, 1));

    let currentIncome = 0;
    let currentExpenses = 0;
    let prevIncome = 0;
    let prevExpenses = 0;

    transactions.forEach(t => {
      const transactionDate = new Date(t.date);
      if (isWithinInterval(transactionDate, { start: currentMonthStart, end: currentMonthEnd })) {
        if (t.type === 'income') {
          currentIncome += t.amount;
        } else {
          currentExpenses += t.amount;
        }
      } else if (isWithinInterval(transactionDate, { start: prevMonthStart, end: prevMonthEnd })) {
         if (t.type === 'income') {
          prevIncome += t.amount;
        } else {
          prevExpenses += t.amount;
        }
      }
    });
    
    const incomeChangeCalc = prevIncome > 0 ? ((currentIncome - prevIncome) / prevIncome) * 100 : (currentIncome > 0 ? Infinity : 0);
    const expenseChangeCalc = prevExpenses > 0 ? ((currentExpenses - prevExpenses) / prevExpenses) * 100 : (currentExpenses > 0 ? Infinity : 0);

    return { 
      monthlyIncome: currentIncome, 
      monthlyExpenses: currentExpenses, 
      netBalance: currentIncome - currentExpenses,
      incomeChange: incomeChangeCalc,
      expenseChange: expenseChangeCalc
    };
  }, [transactions]);
  
  const todaysTransactions = useMemo(() => {
    const now = new Date();
    const todayStart = startOfDay(now);
    const todayEnd = endOfDay(now);

    return transactions
      .filter(t => isWithinInterval(new Date(t.date), { start: todayStart, end: todayEnd }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions]);

  const savingsProgress = savingsGoal > 0 ? (Math.max(0, netBalance) / savingsGoal) * 100 : 0;

  const openTransactionSheet = (type?: 'income' | 'expense') => {
    setSheetDefaultType(type);
    setIsSheetOpen(true);
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

  const handleSaveIncome = () => {
    const newAmount = parseFloat(incomeInput);
    if (!isNaN(newAmount) && newAmount > 0) {
      addTransaction({
        type: 'income',
        amount: newAmount,
        category: 'Salary',
        date: new Date(),
        paymentMethod: 'UPI',
        notes: 'Monthly Salary'
      });
    }
    setIncomeInput("");
    setIsIncomeDialogOpen(false);
  };
  
  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="md:hidden" />
          <h1 className="font-headline text-3xl font-bold">Dashboard</h1>
        </div>
        <Button onClick={() => openTransactionSheet()}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Transaction
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Income</CardTitle>
            <div className="flex items-center gap-1">
              <Dialog open={isIncomeDialogOpen} onOpenChange={setIsIncomeDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Add/Edit Income</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Monthly Income</DialogTitle>
                    <DialogDescription>
                      Enter your total income for the month. This will be added as a single 'Salary' transaction.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="income-amount" className="text-right">
                        Amount
                      </Label>
                      <Input
                        id="income-amount"
                        type="number"
                        placeholder="Enter income amount"
                        value={incomeInput}
                        onChange={(e) => setIncomeInput(e.target.value)}
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleSaveIncome}>Save Income</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <ArrowUpRight className="h-4 w-4 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <>
              <div className="font-headline text-2xl font-bold flex items-center">
                <IndianRupee className="h-6 w-6" />{monthlyIncome.toLocaleString('en-IN')}
              </div>
              <p className="text-xs text-muted-foreground">
                {Number.isFinite(incomeChange)
                  ? `${incomeChange >= 0 ? '+' : ''}${incomeChange.toFixed(1)}% from last month`
                  : 'No data for last month'}
              </p>
            </>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Expenses</CardTitle>
            <div className="flex items-center">
                <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-foreground" onClick={() => openTransactionSheet('expense')}>
                    <PlusCircle className="h-4 w-4" />
                    <span className="sr-only">Add Expense</span>
                </Button>
                <ArrowDownLeft className="h-4 w-4 text-red-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="font-headline text-2xl font-bold flex items-center">
              <IndianRupee className="h-6 w-6" />{monthlyExpenses.toLocaleString('en-IN')}
            </div>
            <p className="text-xs text-muted-foreground">
              {Number.isFinite(expenseChange)
                ? `${expenseChange >= 0 ? '+' : ''}${expenseChange.toFixed(1)}% from last month`
                : 'No data for last month'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Net Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`font-headline text-2xl font-bold flex items-center ${netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              <IndianRupee className="h-6 w-6" />{netBalance.toLocaleString('en-IN')}
            </div>
            <p className="text-xs text-muted-foreground">Your financial health</p>
          </CardContent>
        </Card>
        <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Monthly Savings Goal</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="mb-2 space-y-1">
                <div className="flex gap-2">
                  <Input
                    id="savings-goal-input"
                    type="number"
                    placeholder="e.g. 25000"
                    value={savingsInput}
                    onChange={(e) => setSavingsInput(e.target.value)}
                    className="h-8"
                  />
                  <Button onClick={handleSetSavingsGoal} size="sm" className="h-8">Set</Button>
                </div>
              </div>
              <div className="mb-1 flex justify-between text-xs">
                <span>Saved: <IndianRupee className="inline h-3 w-3" />{Math.max(0, netBalance).toLocaleString('en-IN')}</span>
                <span>Goal: <IndianRupee className="inline h-3 w-3" />{savingsGoal.toLocaleString('en-IN')}</span>
              </div>
              <Progress value={savingsProgress} className="h-2"/>
            </CardContent>
          </Card>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-5">
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Today's Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="w-[50px]"><span className="sr-only">Actions</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {todaysTransactions.length > 0 ? (
                  todaysTransactions.map(t => (
                    <TableRow key={t.id}>
                      <TableCell>
                        <div className="font-medium">{t.category}</div>
                        <div className="text-sm text-muted-foreground">{t.notes}</div>
                      </TableCell>
                      <TableCell>{format(new Date(t.date), 'p')}</TableCell>
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
                              <AlertDialogAction onClick={() => deleteTransaction(t.id)}>
                                Continue
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No transactions recorded today.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="md:col-span-2 flex flex-col gap-6">
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
              {accounts.length > 0 ? (
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
              ) : (
                <div className="h-24 text-center content-center text-muted-foreground">
                  No accounts added yet.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <AddTransactionSheet
        isOpen={isSheetOpen}
        setIsOpen={setIsSheetOpen}
        onAddTransaction={addTransaction}
        defaultType={sheetDefaultType}
      />
    </main>
  );
}
