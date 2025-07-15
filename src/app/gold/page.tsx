
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Gem, PlusCircle, Trash2, IndianRupee } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { AddGoldDialog } from "@/components/add-gold-dialog";
import type { Gold } from "@/lib/types";
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

export default function GoldPage() {
  const { gold, addGold, deleteGold } = useTransactions();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const totalValue = gold.reduce((sum, item) => sum + item.purchasePrice, 0);

  return (
    <>
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="md:hidden" />
            <div className="flex items-center gap-2">
                <Gem className="h-8 w-8 text-primary" />
                <h1 className="font-headline text-3xl font-bold">Gold</h1>
            </div>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Gold
          </Button>
        </div>
        
        <Card className="mb-6">
            <CardHeader>
                <CardTitle>Portfolio Overview</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-4xl font-bold font-headline text-primary flex items-center">
                    <IndianRupee className="h-8 w-8" />
                    {totalValue.toLocaleString('en-IN')}
                </div>
                <p className="text-sm text-muted-foreground">Total purchase value of your gold investments</p>
            </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Gold Holdings</CardTitle>
            <CardDescription>A list of your gold investments.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Weight (g)</TableHead>
                  <TableHead>Purity (K)</TableHead>
                  <TableHead>Purchase Date</TableHead>
                  <TableHead>Purchase Price</TableHead>
                  <TableHead className="w-[50px]"><span className="sr-only">Actions</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {gold.length > 0 ? (
                  gold.map(item => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.type}</TableCell>
                      <TableCell>{item.weightInGrams.toFixed(2)}g</TableCell>
                      <TableCell>{item.purity}K</TableCell>
                      <TableCell>{format(new Date(item.purchaseDate), 'dd MMM, yyyy')}</TableCell>
                      <TableCell className="flex items-center">
                        <IndianRupee className="h-4 w-4 mr-1 inline-flex shrink-0" />
                        {item.purchasePrice.toLocaleString('en-IN')}
                      </TableCell>
                       <TableCell>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete Item</span>
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete this gold investment record.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteGold(item.id)}>
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
                    <TableCell colSpan={6} className="h-24 text-center">
                      No gold investments added yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
      <AddGoldDialog
        isOpen={isAddDialogOpen}
        setIsOpen={setIsAddDialogOpen}
        onAddGold={addGold}
      />
    </>
  );
}
