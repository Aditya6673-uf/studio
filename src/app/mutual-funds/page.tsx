
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TrendingUp, PlusCircle, Shield, BarChart, Zap } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import type { MutualFund } from "@/lib/types";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { AdBanner } from "@/components/ad-banner";
import { InvestDialog } from "@/components/invest-dialog";
import { useTransactions } from "@/context/transactions-context";

const initialMutualFunds: MutualFund[] = [
    { id: '1', name: 'Parag Parikh Flexi Cap Fund', category: 'Equity', nav: 75.25, returns: { oneYear: 35.2, threeYear: 22.1, fiveYear: 24.5 }, risk: 'Very High' },
    { id: '2', name: 'Quant Small Cap Fund', category: 'Equity', nav: 280.5, returns: { oneYear: 65.8, threeYear: 38.2, fiveYear: 44.1 }, risk: 'Very High' },
    { id: '3', name: 'Axis Bluechip Fund', category: 'Equity', nav: 58.1, returns: { oneYear: 25.5, threeYear: 15.3, fiveYear: 18.9 }, risk: 'High' },
    { id: '4', name: 'ICICI Prudential Balanced Advantage Fund', category: 'Hybrid', nav: 65.7, returns: { oneYear: 20.1, threeYear: 14.8, fiveYear: 16.2 }, risk: 'Moderate' },
    { id: '5', name: 'HDFC Short Term Debt Fund', category: 'Debt', nav: 28.9, returns: { oneYear: 7.2, threeYear: 5.8, fiveYear: 6.5 }, risk: 'Low' },
];

const riskColorMap = {
    'Low': 'bg-green-100 text-green-800',
    'Moderate': 'bg-yellow-100 text-yellow-800',
    'High': 'bg-orange-100 text-orange-800',
    'Very High': 'bg-red-100 text-red-800',
};

export default function MutualFundsPage() {
  const [funds, setFunds] = useLocalStorage<MutualFund[]>('rupee-route-mutual-funds', initialMutualFunds);
  const [selectedFund, setSelectedFund] = useState<MutualFund | null>(null);
  const [isInvestDialogOpen, setIsInvestDialogOpen] = useState(false);
  const { addTransaction } = useTransactions();

  const handleInvestClick = (fund: MutualFund) => {
    setSelectedFund(fund);
    setIsInvestDialogOpen(true);
  };
  
  const handleConfirmInvestment = (amount: number, fundName: string) => {
    addTransaction({
        type: 'expense',
        amount,
        category: 'SIP', // or 'Investment'
        date: new Date(),
        paymentMethod: 'Card', // default, can be changed
        notes: `Investment in ${fundName}`
    });
  };

  return (
    <>
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="md:hidden" />
            <div className="flex items-center gap-2">
                <TrendingUp className="h-8 w-8 text-primary" />
                <h1 className="font-headline text-3xl font-bold">Mutual Funds</h1>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Explore Mutual Funds</CardTitle>
            <CardDescription>Browse and invest in a curated list of mutual funds.</CardDescription>
          </CardHeader>
          <CardContent>
             <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fund Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>1Y Returns</TableHead>
                  <TableHead>Risk</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {funds.length > 0 ? (
                  funds.map(fund => (
                    <TableRow key={fund.id}>
                        <TableCell className="font-medium">{fund.name}</TableCell>
                        <TableCell>{fund.category}</TableCell>
                        <TableCell className="text-green-600 font-medium">{fund.returns.oneYear}%</TableCell>
                        <TableCell>
                            <Badge variant="outline" className={riskColorMap[fund.risk]}>{fund.risk}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                           <Button size="sm" onClick={() => handleInvestClick(fund)}>
                                <Zap className="mr-2 h-4 w-4" />
                                Invest
                            </Button>
                        </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No mutual funds available at the moment.
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
      
      {selectedFund && (
        <InvestDialog
            isOpen={isInvestDialogOpen}
            setIsOpen={setIsInvestDialogOpen}
            fund={selectedFund}
            onConfirmInvestment={handleConfirmInvestment}
        />
      )}
    </>
  );
}
