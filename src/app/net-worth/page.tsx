
"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AreaChart, IndianRupee } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useTransactions } from "@/context/transactions-context";
import { useLocalStorage } from "@/hooks/use-local-storage";
import type { RealEstate, Loan, FixedDeposit } from "@/lib/types";

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="flex flex-col space-y-1">
          <span className="font-bold">{data.name}</span>
          <span className="text-sm text-foreground flex items-center">
            <IndianRupee className="h-4 w-4 mr-1" />
            {data.value.toLocaleString('en-IN')}
          </span>
        </div>
      </div>
    );
  }
  return null;
};


export default function NetWorthPage() {
  const { accounts, bullion, fixedDeposits } = useTransactions();
  const [properties] = useLocalStorage<RealEstate[]>('rupee-route-real-estate', []);
  const [loans] = useLocalStorage<Loan[]>('rupee-route-loans', []);

  const { assets, liabilities, netWorth, assetData } = useMemo(() => {
    const totalAccountBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
    const totalBullionValue = bullion.reduce((sum, item) => sum + item.purchasePrice, 0);
    const totalRealEstateValue = properties.reduce((sum, prop) => sum + prop.currentValue, 0);
    const totalFdValue = fixedDeposits.reduce((sum, fd) => sum + fd.principal, 0);
    
    const totalAssets = totalAccountBalance + totalBullionValue + totalRealEstateValue + totalFdValue;

    const totalLiabilities = loans.reduce((sum, loan) => sum + (loan.principal - loan.paid), 0);

    const assetData = [
      { name: 'Cash & Bank', value: totalAccountBalance },
      { name: 'Bullion', value: totalBullionValue },
      { name: 'Real Estate', value: totalRealEstateValue },
      { name: 'Fixed Deposits', value: totalFdValue },
    ].filter(item => item.value > 0);

    return {
      assets: totalAssets,
      liabilities: totalLiabilities,
      netWorth: totalAssets - totalLiabilities,
      assetData,
    };
  }, [accounts, bullion, properties, loans, fixedDeposits]);

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="md:hidden" />
          <div className="flex items-center gap-2">
            <AreaChart className="h-8 w-8 text-primary" />
            <h1 className="font-headline text-3xl font-bold">Net Worth</h1>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Assets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold font-headline text-green-600 flex items-center">
              <IndianRupee className="h-8 w-8" />{assets.toLocaleString('en-IN')}
            </div>
            <p className="text-sm text-muted-foreground">The total value of what you own.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Liabilities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold font-headline text-red-600 flex items-center">
              <IndianRupee className="h-8 w-8" />{liabilities.toLocaleString('en-IN')}
            </div>
             <p className="text-sm text-muted-foreground">The total amount of what you owe.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Net Worth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-4xl font-bold font-headline flex items-center ${netWorth >= 0 ? 'text-primary' : 'text-destructive'}`}>
              <IndianRupee className="h-8 w-8" />{netWorth.toLocaleString('en-IN')}
            </div>
             <p className="text-sm text-muted-foreground">Your financial standing.</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Asset Distribution</CardTitle>
          <CardDescription>A breakdown of your assets by category.</CardDescription>
        </CardHeader>
        <CardContent>
          {assetData.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={assetData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={150}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {assetData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-muted-foreground">
              No asset data to display. Start by adding accounts, bullion, or real estate.
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
