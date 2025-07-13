
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Building2, PlusCircle, HandCoins, Trash2 } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import type { RealEstate } from "@/lib/types";
import { AddRealEstateDialog } from "@/components/add-real-estate-dialog";
import { SellPropertyDialog } from "@/components/sell-property-dialog";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { format } from "date-fns";
import { useSubscription } from "@/context/subscription-context";
import { useTransactions } from "@/context/transactions-context";
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

const initialRealEstate: RealEstate[] = [
    { id: '1', name: '2BHK Apartment', type: 'Residential', location: 'Mumbai, MH', currentValue: 15000000, purchaseDate: new Date('2020-05-10').toISOString() },
    { id: '2', name: 'Commercial Plot', type: 'Land', location: 'Pune, MH', currentValue: 7500000, purchaseDate: new Date('2022-11-20').toISOString() },
];

export default function RealEstatePage() {
  const [properties, setProperties] = useLocalStorage<RealEstate[]>('rupee-route-real-estate', initialRealEstate);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [propertyToSell, setPropertyToSell] = useState<RealEstate | null>(null);
  const { isSubscribed } = useSubscription();
  const { addTransaction } = useTransactions();

  const handleAddProperty = (propertyData: Omit<RealEstate, 'id' | 'sellPrice' | 'sellDate'>) => {
    const newProperty: RealEstate = {
      ...propertyData,
      id: new Date().getTime().toString(),
      purchaseDate: propertyData.purchaseDate instanceof Date ? propertyData.purchaseDate.toISOString() : propertyData.purchaseDate,
    };
    setProperties(prev => [...prev, newProperty]);
  };
  
  const handleSellProperty = (soldProperty: RealEstate, sellPrice: number, sellDate: Date) => {
    setProperties(prev => 
      prev.map(p => 
        p.id === soldProperty.id 
          ? { ...p, sellPrice, sellDate: sellDate.toISOString() } 
          : p
      )
    );
    
    addTransaction({
      type: 'income',
      amount: sellPrice,
      category: 'Asset Sale',
      date: sellDate,
      paymentMethod: 'Bank',
      notes: `Sale of ${soldProperty.name}`,
    });
    
    setPropertyToSell(null);
  };

  const handleDeleteProperty = (propertyId: string) => {
    setProperties(prev => prev.filter(p => p.id !== propertyId));
  };

  const totalValue = properties.reduce((sum, prop) => sum + prop.currentValue, 0);

  return (
    <>
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="md:hidden" />
            <div className="flex items-center gap-2">
                <Building2 className="h-8 w-8 text-primary" />
                <h1 className="font-headline text-3xl font-bold">Real Estate</h1>
            </div>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Property
          </Button>
        </div>

        <Card className="mb-6">
            <CardHeader>
                <CardTitle>Portfolio Overview</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-4xl font-bold font-headline text-primary">₹{totalValue.toLocaleString('en-IN')}</div>
                <p className="text-sm text-muted-foreground">Total value across {properties.length} properties</p>
            </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Properties</CardTitle>
            <CardDescription>A list of your real estate investments.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Property Name</TableHead>
                  <TableHead>Current Value</TableHead>
                  <TableHead>Purchase Date</TableHead>
                  <TableHead className="text-right">Sale Details / Action</TableHead>
                  <TableHead className="w-[50px]"><span className="sr-only">Actions</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {properties.length > 0 ? (
                  properties.map(property => {
                    const purchaseDate = property.purchaseDate ? new Date(property.purchaseDate) : null;
                    const isValidPurchaseDate = purchaseDate && !isNaN(purchaseDate.getTime());
                    const sellDate = property.sellDate ? new Date(property.sellDate) : null;
                    const isValidSellDate = sellDate && !isNaN(sellDate.getTime());
                    
                    return (
                      <TableRow key={property.id}>
                        <TableCell className="font-medium">
                          {property.name}
                          <div className="text-xs text-muted-foreground">{property.type} - {property.location}</div>
                        </TableCell>
                        <TableCell className="font-mono">₹{property.currentValue.toLocaleString('en-IN')}</TableCell>
                        <TableCell>{isValidPurchaseDate ? format(purchaseDate, 'dd MMM, yyyy') : 'N/A'}</TableCell>
                        <TableCell className="text-right">
                          {property.sellPrice && isValidSellDate ? (
                            <div className="font-mono">
                              <div>Sold for: ₹{property.sellPrice.toLocaleString('en-IN')}</div>
                              <div className="text-xs text-muted-foreground">{format(sellDate, 'dd MMM, yyyy')}</div>
                            </div>
                          ) : (
                            <Button variant="outline" size="sm" onClick={() => setPropertyToSell(property)}>
                              <HandCoins className="mr-2 h-4 w-4" />
                              Sell
                            </Button>
                          )}
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
                                <span className="sr-only">Delete property</span>
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete this property record.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteProperty(property.id)}>
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
                    <TableCell colSpan={5} className="h-24 text-center">
                      No properties added yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
      <AddRealEstateDialog
        isOpen={isAddDialogOpen}
        setIsOpen={setIsAddDialogOpen}
        onAddProperty={handleAddProperty}
      />
      {propertyToSell && (
        <SellPropertyDialog
          isOpen={!!propertyToSell}
          setIsOpen={(isOpen) => !isOpen && setPropertyToSell(null)}
          property={propertyToSell}
          onConfirmSale={handleSellProperty}
        />
      )}
    </>
  );
}
