
"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Holding, Transaction } from "@/lib/types"
import { IndianRupee, ArrowUp, ArrowDown } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export interface HoldingDetails extends Holding {
  name: string;
  currentValue: number;
  totalReturn: number;
  totalReturnPercent: number;
  oneDayReturn: number;
  xirr: number;
  investmentHistory: Transaction[];
}

type HoldingDetailsDialogProps = {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  holding: HoldingDetails
}

export function HoldingDetailsDialog({ isOpen, setIsOpen, holding }: HoldingDetailsDialogProps) {
  if (!holding) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{holding.name}</DialogTitle>
          <DialogDescription>
            A detailed view of your investment.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm py-4">
            <div className="flex flex-col">
                <span className="text-muted-foreground">Current Value</span>
                <span className="font-bold text-lg flex items-center"><IndianRupee className="h-4 w-4" />{holding.currentValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div className="flex flex-col">
                <span className="text-muted-foreground">Total Invested</span>
                <span className="font-bold text-lg flex items-center"><IndianRupee className="h-4 w-4" />{holding.totalInvested.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex flex-col">
                <span className="text-muted-foreground">Total Return</span>
                 <span className={cn("font-bold text-lg flex items-center", holding.totalReturn >= 0 ? 'text-green-600' : 'text-red-600')}>
                    {holding.totalReturn >= 0 ? <ArrowUp className="h-5 w-5" /> : <ArrowDown className="h-5 w-5" />}
                    <IndianRupee className="h-4 w-4" />{Math.abs(holding.totalReturn).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                 </span>
            </div>
            <div className="flex flex-col">
                <span className="text-muted-foreground">XIRR (Est.)</span>
                <span className="font-bold text-lg">{holding.xirr.toFixed(2)}%</span>
            </div>
        </div>

        <div className="space-y-2">
            <h3 className="font-medium">Investment History</h3>
            <ScrollArea className="h-[200px] rounded-md border">
                 <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {holding.investmentHistory.length > 0 ? (
                            holding.investmentHistory.map(tx => (
                                <TableRow key={tx.id}>
                                <TableCell>{format(new Date(tx.date), 'dd MMM, yyyy')}</TableCell>
                                <TableCell className="text-right font-mono"><IndianRupee className="inline h-3.5 w-3.5" />{tx.amount.toLocaleString('en-IN')}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={2} className="h-24 text-center">
                                No investment history found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  )
}
