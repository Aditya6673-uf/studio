
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import type { MutualFund } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, IndianRupee, Copy } from "lucide-react"

const formSchema = z.object({
  amount: z.coerce.number().positive({ message: "Investment amount must be positive." }).min(100, { message: "Minimum investment is ₹100." }),
})

type InvestDialogProps = {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  fund: MutualFund
  onConfirmInvestment: (amount: number, fund: MutualFund) => void
}

export function InvestDialog({ isOpen, setIsOpen, fund, onConfirmInvestment }: InvestDialogProps) {
  const { toast } = useToast();
  const [step, setStep] = useState<'amount' | 'payment'>('amount');
  const [investmentAmount, setInvestmentAmount] = useState(0);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: undefined,
    },
  });

  const watchedAmount = form.watch('amount');
  const calculatedUnits = watchedAmount && fund.nav > 0 ? (watchedAmount / fund.nav).toFixed(4) : '0.0000';
  
  React.useEffect(() => {
    if (isOpen) {
      // Reset state when dialog opens
      form.reset();
      setStep('amount');
      setInvestmentAmount(0);
    }
  }, [isOpen, form]);

  function handleAmountSubmit(values: z.infer<typeof formSchema>) {
    setInvestmentAmount(values.amount);
    setStep('payment');
  }

  function handleConfirmPayment() {
    onConfirmInvestment(investmentAmount, fund);
    toast({
        title: "Investment Successful!",
        description: `You have invested ₹${investmentAmount.toLocaleString('en-IN')} in ${fund.name}.`,
    });
    setIsOpen(false);
  }
  
  const handleCopyUpiId = () => {
    if (fund.upiId) {
        navigator.clipboard.writeText(fund.upiId);
        toast({
            title: "Copied to clipboard!",
            description: "UPI ID has been copied.",
        });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
             {step === 'payment' && (
                <Button variant="ghost" size="icon" className="h-8 w-8 mr-2" onClick={() => setStep('amount')}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
            )}
            Invest in {fund.name}
          </DialogTitle>
          <DialogDescription>
            {step === 'amount'
              ? "Enter the amount you wish to invest. This will be recorded as an expense."
              : "Complete your payment using the UPI ID below."}
          </DialogDescription>
        </DialogHeader>

        {step === 'amount' && (
            <>
                <div className="text-sm space-y-1 my-4 p-4 border rounded-lg bg-muted/50">
                   <div className="flex justify-between"><span>Category:</span> <span className="font-medium">{fund.category}</span></div>
                   <div className="flex justify-between"><span>Current NAV:</span> <span className="font-mono">₹{fund.nav.toFixed(2)}</span></div>
                   <div className="flex justify-between"><span>Risk:</span> <span className="font-medium">{fund.risk}</span></div>
                </div>
                <Form {...form}>
                <form onSubmit={form.handleSubmit(handleAmountSubmit)} className="space-y-4">
                    <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Investment Amount (₹)</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder="e.g., 5000" {...field} value={field.value ?? ''} autoFocus />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <div className="text-sm text-muted-foreground p-3 bg-muted/50 rounded-md">
                        You will get approximately <span className="font-bold text-primary">{calculatedUnits} units</span> for this investment.
                    </div>
                    <DialogFooter>
                    <Button type="submit">Proceed to Pay</Button>
                    </DialogFooter>
                </form>
                </Form>
            </>
        )}

        {step === 'payment' && (
            <div className="space-y-6 py-4">
                <div className="text-center">
                    <p className="text-muted-foreground">Amount to Pay</p>
                    <p className="font-headline text-4xl font-bold flex items-center justify-center">
                        <IndianRupee className="h-8 w-8" />
                        {investmentAmount.toLocaleString('en-IN')}
                    </p>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="upi-id">Pay to this UPI ID</Label>
                    <div className="flex items-center gap-2">
                        <Input id="upi-id" value={fund.upiId || 'N/A'} readOnly className="font-mono" />
                        <Button variant="outline" size="icon" onClick={handleCopyUpiId} disabled={!fund.upiId}>
                            <Copy className="h-4 w-4" />
                            <span className="sr-only">Copy UPI ID</span>
                        </Button>
                    </div>
                </div>
                <div className="text-xs text-center text-muted-foreground pt-4">
                    After completing the payment on your UPI app, click the button below to confirm.
                </div>
                 <DialogFooter>
                    <Button onClick={handleConfirmPayment} className="w-full">
                        I have paid, Confirm Investment
                    </Button>
                </DialogFooter>
            </div>
        )}

      </DialogContent>
    </Dialog>
  )
}
