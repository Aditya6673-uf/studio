

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { HandCoins, PlusCircle } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { AddLoanDialog } from "@/components/add-loan-dialog";
import type { Loan } from "@/lib/types";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { format } from "date-fns";
import { AdBanner } from "@/components/ad-banner";
import { useSubscription } from "@/context/subscription-context";

const initialLoans: Loan[] = [
    { id: '1', name: 'Car Loan', principal: 500000, paid: 120000, interestRate: 8.5, startDate: new Date('2022-08-01').toISOString(), term: 5 },
    { id: '2', name: 'Personal Loan', principal: 100000, paid: 100000, interestRate: 12.0, startDate: new Date('2023-01-15').toISOString(), term: 1 },
];

export default function LoansPage() {
  const [loans, setLoans] = useLocalStorage<Loan[]>('rupee-route-loans', initialLoans);
  const [isAddLoanOpen, setIsAddLoanOpen] = useState(false);
  const { isSubscribed } = useSubscription();

  const handleAddLoan = (loanData: Omit<Loan, 'id'>) => {
    const newLoan: Loan = {
      ...loanData,
      id: new Date().getTime().toString(),
      // Ensure date is stored as a string for consistent serialization
      startDate: loanData.startDate instanceof Date ? loanData.startDate.toISOString() : loanData.startDate,
    };
    setLoans(prev => [...prev, newLoan]);
  };

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
                  <TableHead>Amount Paid</TableHead>
                  <TableHead>Interest Rate</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>Term</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loans.length > 0 ? (
                  loans.map(loan => {
                    // Ensure startDate is a valid Date object before formatting
                    const startDate = loan.startDate ? new Date(loan.startDate) : null;
                    const isValidDate = startDate && !isNaN(startDate.getTime());

                    return (
                      <TableRow key={loan.id}>
                        <TableCell className="font-medium">{loan.name}</TableCell>
                        <TableCell>₹{loan.principal.toLocaleString('en-IN')}</TableCell>
                        <TableCell>₹{loan.paid.toLocaleString('en-IN')}</TableCell>
                        <TableCell>{loan.interestRate.toFixed(2)}%</TableCell>
                        <TableCell>{isValidDate ? format(startDate, 'dd MMM, yyyy') : 'N/A'}</TableCell>
                        <TableCell>{loan.term} years</TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No loans added yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        {!isSubscribed && (
          <div className="mt-6">
            <AdBanner />
          </div>
        )}
      </main>
      <AddLoanDialog
        isOpen={isAddLoanOpen}
        setIsOpen={setIsAddLoanOpen}
        onAddLoan={handleAddLoan}
      />
    </>
  );
}
