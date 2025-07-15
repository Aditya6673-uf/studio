
"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Gem, PlusCircle, Trash2, IndianRupee } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { AddBullionDialog } from "@/components/add-bullion-dialog";
import type { PreciousMetal } from "@/lib/types";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function BullionPage() {
  const { bullion, addBullion, deleteBullion } = useTransactions();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const { gold, silver, totalGoldValue, totalSilverValue } = useMemo(() => {
    const gold: PreciousMetal[] = [];
    const silver: PreciousMetal[] = [];
    let totalGoldValue = 0;
    let totalSilverValue = 0;

    bullion.forEach(item => {
      if (item.metal === 'Gold') {
        gold.push(item);
        totalGoldValue += item.purchasePrice;
      } else {
        silver.push(item);
        totalSilverValue += item.purchasePrice;
      }
    });

    return { gold, silver, totalGoldValue, totalSilverValue };
  }, [bullion]);

  const renderTable = (items: PreciousMetal[]) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Form</TableHead>
          <TableHead>Weight (g)</TableHead>
          <TableHead>Purity</TableHead>
          <TableHead>Purchase Date</TableHead>
          <TableHead>Purchase Price</TableHead>
          <TableHead className="w-[50px]"><span className="sr-only">Actions</span></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.length > 0 ? (
          items.map(item => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.form}</TableCell>
              <TableCell>{item.weightInGrams.toFixed(2)}g</TableCell>
              <TableCell>{item.metal === 'Gold' ? `${item.purity}K` : `${item.purity}%`}</TableCell>
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
                        This action cannot be undone. This will permanently delete this investment record.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => deleteBullion(item.id)}>
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
              No investments of this type added yet.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );

  return (
    <>
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="md:hidden" />
            <div className="flex items-center gap-2">
                <Gem className="h-8 w-8 text-primary" />
                <h1 className="font-headline text-3xl font-bold">Bullion</h1>
            </div>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Bullion
          </Button>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 mb-6">
            <Card>
                <CardHeader>
                    <CardTitle>Gold Portfolio</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-4xl font-bold font-headline text-yellow-500 flex items-center">
                        <IndianRupee className="h-8 w-8" />
                        {totalGoldValue.toLocaleString('en-IN')}
                    </div>
                    <p className="text-sm text-muted-foreground">Total purchase value of your gold investments</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Silver Portfolio</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-4xl font-bold font-headline text-slate-400 flex items-center">
                        <IndianRupee className="h-8 w-8" />
                        {totalSilverValue.toLocaleString('en-IN')}
                    </div>
                    <p className="text-sm text-muted-foreground">Total purchase value of your silver investments</p>
                </CardContent>
            </Card>
        </div>

        <Card>
            <Tabs defaultValue="gold" className="w-full">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>Your Bullion Holdings</CardTitle>
                            <CardDescription>A list of your precious metal investments.</CardDescription>
                        </div>
                        <TabsList>
                            <TabsTrigger value="gold">Gold</TabsTrigger>
                            <TabsTrigger value="silver">Silver</TabsTrigger>
                        </TabsList>
                    </div>
                </CardHeader>
                <CardContent>
                    <TabsContent value="gold">
                        {renderTable(gold)}
                    </TabsContent>
                    <TabsContent value="silver">
                        {renderTable(silver)}
                    </TabsContent>
                </CardContent>
            </Tabs>
        </Card>
      </main>
      <AddBullionDialog
        isOpen={isAddDialogOpen}
        setIsOpen={setIsAddDialogOpen}
        onAddBullion={addBullion}
      />
    </>
  );
}
