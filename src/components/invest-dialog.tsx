
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
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

const formSchema = z.object({
  amount: z.coerce.number().positive({ message: "Investment amount must be positive." }).min(100, { message: "Minimum investment is ₹100." }),
})

type InvestDialogProps = {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  fund: MutualFund
  onConfirmInvestment: (amount: number, fundName: string) => void
}

export function InvestDialog({ isOpen, setIsOpen, fund, onConfirmInvestment }: InvestDialogProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: undefined,
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    onConfirmInvestment(values.amount, fund.name);
    toast({
        title: "Investment Successful!",
        description: `You have invested ₹${values.amount.toLocaleString('en-IN')} in ${fund.name}.`,
    });
    form.reset();
    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Invest in {fund.name}</DialogTitle>
          <DialogDescription>
            Enter the amount you wish to invest. This will be recorded as an expense.
          </DialogDescription>
        </DialogHeader>
        <div className="text-sm">
            <p><strong>Category:</strong> {fund.category}</p>
            <p><strong>Current NAV:</strong> ₹{fund.nav.toFixed(2)}</p>
            <p><strong>Risk:</strong> {fund.risk}</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
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
            <DialogFooter>
              <Button type="submit">Confirm Investment</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
