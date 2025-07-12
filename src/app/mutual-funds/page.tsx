
"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TrendingUp, Zap, Search, IndianRupee, ArrowUp, ArrowDown } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import type { MutualFund, Holding } from "@/lib/types";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { AdBanner } from "@/components/ad-banner";
import { InvestDialog } from "@/components/invest-dialog";
import { useTransactions } from "@/context/transactions-context";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

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
  const [searchQuery, setSearchQuery] = useState("");
  const { addTransaction, holdings, addHolding } = useTransactions();

  const filteredFunds = useMemo(() => {
    if (!searchQuery) {
      return funds;
    }
    return funds.filter(fund =>
      fund.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [funds, searchQuery]);

  const handleInvestClick = (fund: MutualFund) => {
    setSelectedFund(fund);
    setIsInvestDialogOpen(true);
  };
  
  const handleConfirmInvestment = (amount: number, fund: MutualFund) => {
    addTransaction({
        type: 'expense',
        amount,
        category: 'SIP', // or 'Investment'
        date: new Date(),
        paymentMethod: 'Card', // default, can be changed
        notes: `Investment in ${fund.name}`
    });
    addHolding(amount, fund);
  };
  
  const holdingsWithDetails = useMemo(() => {
    return holdings.map(holding => {
      const fundDetails = funds.find(f => f.id === holding.fundId);
      if (!fundDetails) return null;

      const currentValue = holding.units * fundDetails.nav;
      const totalReturn = currentValue - holding.totalInvested;
      const totalReturnPercent = (totalReturn / holding.totalInvested) * 100;
      
      // Placeholder for 1D return and XIRR
      const oneDayReturn = (Math.random() - 0.4) * 2; 
      const xirr = (Math.random() * 15) + 5; 

      return {
        ...holding,
        name: fundDetails.name,
        currentValue,
        totalReturn,
        totalReturnPercent,
        oneDayReturn,
        xirr,
      };
    }).filter(Boolean);
  }, [holdings, funds]);


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
        
        {holdingsWithDetails.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Your Holdings</CardTitle>
              <CardDescription>A summary of your current mutual fund investments.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fund Name</TableHead>
                    <TableHead className="text-right">Invested</TableHead>
                    <TableHead className="text-right">Current Value</TableHead>
                    <TableHead className="text-right">Total Return</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {holdingsWithDetails.map(holding => (
                    <TableRow key={holding.fundId}>
                      <TableCell className="font-medium">{holding.name}</TableCell>
                      <TableCell className="text-right font-mono"><IndianRupee className="inline h-3.5 w-3.5" />{holding.totalInvested.toLocaleString('en-IN')}</TableCell>
                      <TableCell className="text-right font-mono"><IndianRupee className="inline h-3.5 w-3.5" />{holding.currentValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                       <TableCell className="text-right font-mono">
                         <div className={cn("flex items-center justify-end", holding.totalReturn >= 0 ? 'text-green-600' : 'text-red-600')}>
                            {holding.totalReturn >= 0 ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                            <IndianRupee className="h-3.5 w-3.5" />{Math.abs(holding.totalReturn).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                         </div>
                         <span className="text-xs text-muted-foreground">({holding.totalReturnPercent.toFixed(2)}%)</span>
                       </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Explore Mutual Funds</CardTitle>
            <CardDescription>Browse and invest in a curated list of mutual funds.</CardDescription>
            <div className="relative mt-4">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for a fund..."
                className="w-full rounded-lg bg-background pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
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
                {filteredFunds.length > 0 ? (
                  filteredFunds.map(fund => (
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
                      No mutual funds found.
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
