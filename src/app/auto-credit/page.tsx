
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PiggyBank, PlusCircle, IndianRupee } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import type { AutoCredit } from "@/lib/types";
import { AddAutoCreditDialog } from "@/components/add-autocredit-dialog";
import { format } from "date-fns";
import { useTransactions } from "@/context/transactions-context";
import { useSubscription } from "@/context/subscription-context";

export default function AutoCreditPage() {
  const { autoCredits, addAutoCredit } = useTransactions();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { isSubscribed } = useSubscription();

  return (
    <>
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="md:hidden" />
            <div className="flex items-center gap-2">
                <PiggyBank className="h-8 w-8 text-primary" />
                <h1 className="font-headline text-3xl font-bold">Auto Credit</h1>
            </div>
          </div>
           <Button onClick={() => setIsSheetOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Auto Credit
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Automatic Payments</CardTitle>
            <CardDescription>A list of your scheduled automatic payments.</CardDescription>
          </CardHeader>
          <CardContent>
             <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Frequency</TableHead>
                  <TableHead>Next Payment</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {autoCredits.length > 0 ? (
                  autoCredits.map(item => {
                    const nextDate = item.nextDate ? new Date(item.nextDate) : null;
                    const isValidDate = nextDate && !isNaN(nextDate.getTime());
                    return (
                        <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell className="flex items-center"><IndianRupee className="h-4 w-4 mr-1 inline-flex shrink-0" />{item.amount.toLocaleString('en-IN')}</TableCell>
                        <TableCell>{item.frequency}</TableCell>
                        <TableCell>{isValidDate ? format(nextDate, 'dd MMM, yyyy') : 'N/A'}</TableCell>
                        </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      No automatic credits set up yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
      <AddAutoCreditDialog
        isOpen={isSheetOpen}
        setIsOpen={setIsSheetOpen}
        onAddAutoCredit={addAutoCredit}
      />
    </>
  );
}
