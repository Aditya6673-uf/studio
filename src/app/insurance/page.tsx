
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ShieldCheck, PlusCircle, IndianRupee } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { AddInsuranceDialog } from "@/components/add-insurance-dialog";
import type { Insurance } from "@/lib/types";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { format } from "date-fns";
import { AdBanner } from "@/components/ad-banner";
import { useTransactions } from "@/context/transactions-context";
import { useSubscription } from "@/context/subscription-context";

const initialInsurances: Insurance[] = [
    { id: '1', provider: 'HDFC Ergo', policyName: 'Optima Restore', type: 'Health', premium: 12000, coverage: 500000, nextDueDate: new Date('2025-08-15').toISOString() },
    { id: '2', provider: 'LIC', policyName: 'Jeevan Anand', type: 'Life', premium: 25000, coverage: 1000000, nextDueDate: new Date('2025-09-01').toISOString() },
];

export default function InsurancePage() {
  const [insurances, setInsurances] = useLocalStorage<Insurance[]>('rupee-route-insurances', initialInsurances);
  const [isAddInsuranceOpen, setIsAddInsuranceOpen] = useState(false);
  const { addScheduledTransaction } = useTransactions();
  const { isSubscribed } = useSubscription();

  const handleAddInsurance = (insuranceData: Omit<Insurance, 'id'>) => {
    const newInsurance: Insurance = {
      ...insuranceData,
      id: new Date().getTime().toString(),
      nextDueDate: insuranceData.nextDueDate instanceof Date ? insuranceData.nextDueDate.toISOString() : insuranceData.nextDueDate,
    };
    setInsurances(prev => [...prev, newInsurance]);

    addScheduledTransaction({
        transaction: {
            type: 'expense',
            amount: insuranceData.premium,
            category: 'Insurance',
            date: insuranceData.nextDueDate,
            paymentMethod: 'Card', // Defaulting to Card, can be changed later
            notes: `${insuranceData.policyName} Premium`
        },
        autoCredit: {
            name: `${insuranceData.policyName} Premium`,
            amount: insuranceData.premium,
            frequency: 'Monthly',
            nextDate: insuranceData.nextDueDate,
        }
    });
  };

  return (
    <>
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="md:hidden" />
            <div className="flex items-center gap-2">
                <ShieldCheck className="h-8 w-8 text-primary" />
                <h1 className="font-headline text-3xl font-bold">Insurance</h1>
            </div>
          </div>
          <Button onClick={() => setIsAddInsuranceOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Insurance
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Your Insurance Policies</CardTitle>
            <CardDescription>A list of your active insurance policies.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Policy Name</TableHead>
                  <TableHead>Provider</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Premium</TableHead>
                  <TableHead>Coverage</TableHead>
                  <TableHead>Next Due Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {insurances.length > 0 ? (
                  insurances.map(policy => {
                    const nextDueDate = policy.nextDueDate ? new Date(policy.nextDueDate) : null;
                    const isValidDate = nextDueDate && !isNaN(nextDueDate.getTime());

                    return (
                      <TableRow key={policy.id}>
                        <TableCell className="font-medium">{policy.policyName}</TableCell>
                        <TableCell>{policy.provider}</TableCell>
                        <TableCell>{policy.type}</TableCell>
                        <TableCell className="flex items-center"><IndianRupee className="h-4 w-4 mr-1 inline-flex shrink-0" />{policy.premium.toLocaleString('en-IN')}</TableCell>
                        <TableCell className="flex items-center"><IndianRupee className="h-4 w-4 mr-1 inline-flex shrink-0" />{policy.coverage.toLocaleString('en-IN')}</TableCell>
                        <TableCell>{isValidDate ? format(nextDueDate, 'dd MMM, yyyy') : 'N/A'}</TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No insurance policies added yet.
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
      <AddInsuranceDialog
        isOpen={isAddInsuranceOpen}
        setIsOpen={setIsAddInsuranceOpen}
        onAddInsurance={handleAddInsurance}
      />
    </>
  );
}
