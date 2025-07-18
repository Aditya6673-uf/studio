
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CircleDollarSign, PlusCircle, Trash2, IndianRupee } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { AddFdDialog } from "@/components/add-fd-dialog";
import type { FixedDeposit } from "@/lib/types";
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

export default function FixedDepositsPage() {
  const { fixedDeposits, addFixedDeposit, deleteFixedDeposit } = useTransactions();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  const totalPrincipal = fixedDeposits.reduce((sum, fd) => sum + fd.principal, 0);

  return (
    <>
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="md:hidden" />
            <div className="flex items-center gap-2">
                <CircleDollarSign className="h-8 w-8 text-primary" />
                <h1 className="font-headline text-3xl font-bold">Fixed Deposits</h1>
            </div>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add FD
          </Button>
        </div>
        
        <Card className="mb-6">
            <CardHeader>
                <CardTitle>Portfolio Overview</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-4xl font-bold font-headline text-primary flex items-center">
                    <IndianRupee className="h-8 w-8" />
                    {totalPrincipal.toLocaleString('en-IN')}
                </div>
                <p className="text-sm text-muted-foreground">Total principal invested across {fixedDeposits.length} FDs</p>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Your Fixed Deposits</CardTitle>
                <CardDescription>A list of your fixed deposit investments.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Bank</TableHead>
                      <TableHead>Principal</TableHead>
                      <TableHead>Interest Rate</TableHead>
                      <TableHead>Maturity Date</TableHead>
                      <TableHead>Maturity Amount</TableHead>
                      <TableHead>Total Return</TableHead>
                      <TableHead className="w-[50px] text-right"><span className="sr-only">Actions</span></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fixedDeposits.length > 0 ? (
                      fixedDeposits.map(fd => (
                        <TableRow key={fd.id}>
                          <TableCell className="font-medium">{fd.bankName}</TableCell>
                           <TableCell className="flex items-center">
                                <IndianRupee className="h-4 w-4 mr-1 inline-flex shrink-0" />
                                {fd.principal.toLocaleString('en-IN')}
                           </TableCell>
                          <TableCell>{fd.interestRate.toFixed(2)}%</TableCell>
                          <TableCell>{format(new Date(fd.maturityDate), 'dd MMM, yyyy')}</TableCell>
                          <TableCell className="flex items-center">
                            <IndianRupee className="h-4 w-4 mr-1 inline-flex shrink-0" />
                            {fd.maturityAmount.toLocaleString('en-IN')}
                          </TableCell>
                          <TableCell className="flex items-center font-medium text-green-600">
                             <IndianRupee className="h-4 w-4 mr-1 inline-flex shrink-0" />
                             {(fd.maturityAmount - fd.principal).toLocaleString('en-IN')}
                          </TableCell>
                           <TableCell className="text-right">
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Trash2 className="h-4 w-4" />
                                  <span className="sr-only">Delete FD</span>
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete this fixed deposit record.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => deleteFixedDeposit(fd.id)}>
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
                        <TableCell colSpan={7} className="h-24 text-center">
                          No fixed deposits added yet.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
            </CardContent>
        </Card>
      </main>
      <AddFdDialog
        isOpen={isAddDialogOpen}
        setIsOpen={setIsAddDialogOpen}
        onAddFd={addFixedDeposit}
      />
    </>
  );
}
