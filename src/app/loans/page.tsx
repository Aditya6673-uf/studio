
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { HandCoins, PlusCircle, IndianRupee, Trash2 } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { AddLoanDialog } from "@/components/add-loan-dialog";
import type { Loan } from "@/lib/types";
import { useTransactions } from "@/context/transactions-context";
import { format } from "date-fns";
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

export default function LoansPage() {
  const { loans, addLoan, deleteLoan } = useTransactions();
  const [isAddLoanOpen, setIsAddLoanOpen] = useState(false);

  return (
    <>
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="md:hidden" />
            <div className="flex items-center gap-2">
                <HandCoins className="h-8 w-8 text-primary" />
                <h1 className="font-headline text-3xl font-bold">Loans</h1>
            </div>
          </div>
          <Button onClick={() => setIsAddLoanOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Loan
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Your Loans</CardTitle>
            <CardDescription>A list of your outstanding and paid loans.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Loan Name</TableHead>
                  <TableHead>Principal</TableHead>
                  <TableHead>EMI</TableHead>
                  <TableHead>Amount Paid</TableHead>
                  <TableHead>Interest Rate</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>Term</TableHead>
                  <TableHead className="w-[50px]"><span className="sr-only">Actions</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loans.length > 0 ? (
                  loans.map(loan => {
                    const startDate = loan.startDate ? new Date(loan.startDate) : null;
                    const isValidDate = startDate && !isNaN(startDate.getTime());

                    return (
                      <TableRow key={loan.id}>
                        <TableCell className="font-medium">{loan.name}</TableCell>
                        <TableCell><div className="flex items-center"><IndianRupee className="h-4 w-4 mr-1 inline-flex shrink-0" />{loan.principal.toLocaleString('en-IN')}</div></TableCell>
                        <TableCell><div className="flex items-center"><IndianRupee className="h-4 w-4 mr-1 inline-flex shrink-0" />{loan.emi.toLocaleString('en-IN')}</div></TableCell>
                        <TableCell><div className="flex items-center"><IndianRupee className="h-4 w-4 mr-1 inline-flex shrink-0" />{loan.paid.toLocaleString('en-IN')}</div></TableCell>
                        <TableCell>{loan.interestRate.toFixed(2)}%</TableCell>
                        <TableCell>{isValidDate ? format(startDate, 'dd MMM, yyyy') : 'N/A'}</TableCell>
                        <TableCell>{loan.term} years</TableCell>
                        <TableCell>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete Loan</span>
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete this loan record and its scheduled payments.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => deleteLoan(loan.id)}>
                                  Continue
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      No loans added yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
      <AddLoanDialog
        isOpen={isAddLoanOpen}
        setIsOpen={setIsAddLoanOpen}
        onAddLoan={addLoan}
      />
    </>
  );
}
