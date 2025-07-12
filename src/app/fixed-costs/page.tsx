
"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Transaction } from "@/lib/types";
import { format } from "date-fns";
import { IndianRupee, Repeat, PlusCircle, Trash2 } from 'lucide-react';
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
import { useTransactions } from "@/context/transactions-context";
import { Checkbox } from "@/components/ui/checkbox";
import { AdBanner } from "@/components/ad-banner";

export default function FixedCostsPage() {
  const { transactions, addTransaction, deleteTransaction } = useTransactions();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);

  const fixedCostTransactions = useMemo(() => {
    const fixedCategories = ['Rent', 'EMI', 'SIP', 'Investment', 'Insurance'];
    return [...transactions]
      .filter(t => t.type === 'expense' && fixedCategories.includes(t.category))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRowIds(fixedCostTransactions.map(t => t.id));
    } else {
      setSelectedRowIds([]);
    }
  };

  const handleRowSelect = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedRowIds(prev => [...prev, id]);
    } else {
      setSelectedRowIds(prev => prev.filter(rowId => rowId !== id));
    }
  };

  const handleDeleteSelected = () => {
    selectedRowIds.forEach(id => deleteTransaction(id));
    setSelectedRowIds([]);
  };

  const isAllSelected = selectedRowIds.length > 0 && selectedRowIds.length === fixedCostTransactions.length;
  const isSomeSelected = selectedRowIds.length > 0 && fixedCostTransactions.length > 0 && !isAllSelected;

  return (
    <>
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="md:hidden" />
            <div className="flex items-center gap-2">
                <Repeat className="h-8 w-8 text-primary" />
                <h1 className="font-headline text-3xl font-bold">Fixed Costs</h1>
            </div>
          </div>
          <Button onClick={() => setIsSheetOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Fixed Cost
          </Button>
        </div>
        
        {selectedRowIds.length > 0 && (
          <div className="mb-4 flex items-center justify-between rounded-lg border bg-card p-2 px-4">
             <span className="text-sm font-medium">{selectedRowIds.length} selected</span>
             <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Selected
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action will permanently delete {selectedRowIds.length} transaction(s). This cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteSelected}>
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Your Recurring Expenses</CardTitle>
            <CardDescription>A list of your regular, predictable expenses like rent, EMIs, and SIPs.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={isAllSelected || isSomeSelected}
                      onCheckedChange={(checked) => handleSelectAll(!!checked)}
                      aria-label="Select all rows"
                    />
                  </TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Date Paid</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="w-[50px]"><span className="sr-only">Actions</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fixedCostTransactions.length > 0 ? (
                  fixedCostTransactions.map(t => (
                    <TableRow key={t.id} data-state={selectedRowIds.includes(t.id) ? "selected" : ""}>
                      <TableCell>
                         <Checkbox
                          checked={selectedRowIds.includes(t.id)}
                          onCheckedChange={(checked) => handleRowSelect(t.id, !!checked)}
                          aria-label={`Select row for ${t.category}`}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{t.category}</div>
                        {t.notes && <div className="text-sm text-muted-foreground">{t.notes}</div>}
                      </TableCell>
                      <TableCell>{format(new Date(t.date), 'dd MMM, yyyy')}</TableCell>
                      <TableCell className="text-right font-medium text-red-600">
                        - <IndianRupee className="inline h-4 w-4" />{t.amount.toLocaleString('en-IN')}
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
                      No fixed costs recorded yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
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
