
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Building2, PlusCircle } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import type { RealEstate } from "@/lib/types";
import { AddRealEstateDialog } from "@/components/add-real-estate-dialog";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { format } from "date-fns";
import { AdBanner } from "@/components/ad-banner";

const initialRealEstate: RealEstate[] = [
    { id: '1', name: '2BHK Apartment', type: 'Residential', location: 'Mumbai, MH', currentValue: 15000000, purchaseDate: new Date('2020-05-10').toISOString() },
    { id: '2', name: 'Commercial Plot', type: 'Land', location: 'Pune, MH', currentValue: 7500000, purchaseDate: new Date('2022-11-20').toISOString() },
];

export default function RealEstatePage() {
  const [properties, setProperties] = useLocalStorage<RealEstate[]>('rupee-route-real-estate', initialRealEstate);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const handleAddProperty = (propertyData: Omit<RealEstate, 'id'>) => {
    const newProperty: RealEstate = {
      ...propertyData,
      id: new Date().getTime().toString(),
      purchaseDate: propertyData.purchaseDate instanceof Date ? propertyData.purchaseDate.toISOString() : propertyData.purchaseDate,
    };
    setProperties(prev => [...prev, newProperty]);
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
                  <TableHead>Type</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Purchase Date</TableHead>
                  <TableHead className="text-right">Current Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {properties.length > 0 ? (
                  properties.map(property => {
                    const purchaseDate = property.purchaseDate ? new Date(property.purchaseDate) : null;
                    const isValidDate = purchaseDate && !isNaN(purchaseDate.getTime());
                    
                    return (
                      <TableRow key={property.id}>
                        <TableCell className="font-medium">{property.name}</TableCell>
                        <TableCell>{property.type}</TableCell>
                        <TableCell>{property.location}</TableCell>
                        <TableCell>{isValidDate ? format(purchaseDate, 'dd MMM, yyyy') : 'N/A'}</TableCell>
                        <TableCell className="text-right font-mono">₹{property.currentValue.toLocaleString('en-IN')}</TableCell>
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
        <div className="mt-6">
          <AdBanner />
        </div>
      </main>
      <AddRealEstateDialog
        isOpen={isAddDialogOpen}
        setIsOpen={setIsAddDialogOpen}
        onAddProperty={handleAddProperty}
      />
    </>
  );
}
