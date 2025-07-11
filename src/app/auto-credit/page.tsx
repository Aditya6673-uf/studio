"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PiggyBank, PlusCircle } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function AutoCreditPage() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Placeholder data
  const autoCredits = [
    { id: '1', name: 'Mutual Fund SIP', amount: 5000, frequency: 'Monthly', nextDate: '2024-08-05' },
    { id: '2', name: 'Rent Payment', amount: 15000, frequency: 'Monthly', nextDate: '2024-08-01' },
  ];

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
           <Button onClick={() => setIsSheetOpen(true)} disabled>
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
                  autoCredits.map(item => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.amount.toLocaleString('en-IN')}</TableCell>
                      <TableCell>{item.frequency}</TableCell>
                      <TableCell>{item.nextDate}</TableCell>
                    </TableRow>
                  ))
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
       {/* A dialog/sheet for adding auto-credits would be needed here */}
    </>
  );
}
