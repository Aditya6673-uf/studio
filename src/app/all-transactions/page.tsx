
"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Transaction } from "@/lib/types";
import { format } from "date-fns";
import { IndianRupee, List, PlusCircle, Trash2 } from 'lucide-react';
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { AddTransactionSheet } from "@/components/add-transaction-sheet";
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
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useTransactions } from "@/context/transactions-context";
import { Separator } from "@/components/ui/separator";
import { AdBanner } from "@/components/ad-banner";

interface MonthlySummary {
  transactions: Transaction[];
  totalIncome: number;
  totalExpense: number;
  netIncome: number;
}

interface GroupedTransactions {
  [key: string]: MonthlySummary;
}

export default function AllTransactionsPage() {
  const { transactions, addTransaction, deleteTransaction } = useTransactions();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const groupedTransactions = useMemo(() => {
    const sorted = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return sorted.reduce((acc: GroupedTransactions, t) => {
      const monthYear = format(new Date(t.date), 'MMMM yyyy');
      if (!acc[monthYear]) {
        acc[monthYear] = {
          transactions: [],
          totalIncome: 0,
          totalExpense: 0,
          netIncome: 0,
        };
      }
      acc[monthYear].transactions.push(t);
      if (t.type === 'income') {
        acc[monthYear].totalIncome += t.amount;
      } else {
        acc[monthYear].totalExpense += t.amount;
      }
      acc[monthYear].netIncome = acc[monthYear].totalIncome - acc[monthYear].totalExpense;
      return acc;
    }, {});
  }, [transactions]);

  const defaultAccordionValue = Object.keys(groupedTransactions)[0] || "";

  return (
    <>
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="md:hidden" />
            <div className="flex items-center gap-2">
                <List className="h-8 w-8 text-primary" />
                <h1 className="font-headline text-3xl font-bold">All Transactions</h1>
            </div>
          </div>
          <Button onClick={() => setIsSheetOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Transaction
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Your Transaction History</CardTitle>
            <CardDescription>A complete record of all your income and expenses.</CardDescription>
          </CardHeader>
          <CardContent>
            {Object.keys(groupedTransactions).length > 0 ? (
              <Accordion type="single" collapsible defaultValue={defaultAccordionValue} className="w-full">
                {Object.entries(groupedTransactions).map(([monthYear, summary]) => (
                  <AccordionItem value={monthYear} key={monthYear}>
                    <AccordionTrigger className="text-lg font-medium">{monthYear}</AccordionTrigger>
                    <AccordionContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Description</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                            <TableHead className="w-[50px]"><span className="sr-only">Actions</span></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {summary.transactions.map(t => (
                            <TableRow key={t.id}>
                              <TableCell>
                                <div className="font-medium">{t.category}</div>
                                {t.notes && <div className="text-sm text-muted-foreground">{t.notes}</div>}
                              </TableCell>
                              <TableCell>{format(new Date(t.date), 'dd MMM, yyyy')}</TableCell>
                              <TableCell>
                                <Badge variant={t.type === 'income' ? 'default' : 'destructive'} className={t.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                                  {t.type}
                                </Badge>
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
                          ))}
                        </TableBody>
                      </Table>
                      <Separator className="my-4" />
                      <div className="flex justify-end gap-8 px-4 text-sm">
                        <div className="flex flex-col items-end">
                            <span className="text-muted-foreground">Total Income</span>
                            <span className="font-medium text-green-600 flex items-center">
                                <IndianRupee className="h-4 w-4" />{summary.totalIncome.toLocaleString('en-IN')}
                            </span>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-muted-foreground">Total Expense</span>
                            <span className="font-medium text-red-600 flex items-center">
                                <IndianRupee className="h-4 w-4" />{summary.totalExpense.toLocaleString('en-IN')}
                            </span>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-muted-foreground">Net Balance</span>
                            <span className={`font-medium flex items-center ${summary.netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                <IndianRupee className="h-4 w-4" />{summary.netIncome.toLocaleString('en-IN')}
                            </span>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div className="h-24 text-center content-center text-muted-foreground">
                No transactions recorded yet.
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-6">
          <AdBanner />
        </div>
      </main>
      <AddTransactionSheet
        isOpen={isSheetOpen}
        setIsOpen={setIsSheetOpen}
        onAddTransaction={addTransaction}
      />
    </>
  );
}
