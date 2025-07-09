"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import React from "react"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import type { Transaction } from "@/lib/types"

const formSchema = z.object({
  type: z.enum(["income", "expense"], { required_error: "Please select a transaction type." }),
  amount: z.coerce.number().positive({ message: "Amount must be positive." }),
  category: z.string().min(1, { message: "Please select a category." }),
  customCategory: z.string().optional(),
  date: z.date({ required_error: "Please select a date." }),
  paymentMethod: z.enum(["UPI", "Cash", "Card"]),
  notes: z.string().optional(),
}).refine(data => {
    if (data.category === 'Other') {
        return !!data.customCategory && data.customCategory.trim().length > 0;
    }
    return true;
}, {
    message: "Please enter a custom category.",
    path: ["customCategory"],
});

const incomeCategories = ["Freelancing", "Salary", "Stock Market Investment", "Other"];
const expenseCategories = ["Food", "Rent", "EMI", "Entertainment", "SIP", "Stock Market Investment", "Other"];


type AddTransactionSheetProps = {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void
  defaultType?: 'income' | 'expense'
}

export function AddTransactionSheet({ isOpen, setIsOpen, onAddTransaction, defaultType }: AddTransactionSheetProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: defaultType || "expense",
      amount: undefined,
      date: new Date(),
      paymentMethod: "UPI",
      notes: "",
      category: "",
      customCategory: ""
    },
  })
  
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false)

  const watchedType = form.watch("type");
  const watchedCategory = form.watch("category");
  const categories = watchedType === 'income' ? incomeCategories : expenseCategories;

  React.useEffect(() => {
    if (isOpen) {
      form.reset({
        type: defaultType || 'expense',
        amount: undefined,
        date: new Date(),
        paymentMethod: "UPI",
        notes: "",
        category: "",
        customCategory: ""
      });
    }
  }, [isOpen, defaultType, form]);

  React.useEffect(() => {
    form.resetField("category", { defaultValue: "" });
  }, [watchedType, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    const { customCategory, ...transactionData } = values;
    const finalTransaction = {
      ...transactionData,
      category: values.category === 'Other' && customCategory ? customCategory : values.category,
    };

    onAddTransaction(finalTransaction as Omit<Transaction, 'id'>);
    form.reset();
    setIsOpen(false);
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Add Transaction</SheetTitle>
          <SheetDescription>
            Enter the details of your new income or expense.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Transaction Type</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex space-x-4"
                      value={field.value}
                    >
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="income" />
                        </FormControl>
                        <FormLabel className="font-normal">Income</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="expense" />
                        </FormControl>
                        <FormLabel className="font-normal">Expense</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0.00" {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ""}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                       {categories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {watchedCategory === 'Other' && (
              <FormField
                control={form.control}
                name="customCategory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Custom Category</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your custom category" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => {
                          field.onChange(date)
                          setIsCalendarOpen(false)
                        }}
                        onDayDoubleClick={(date) => {
                          field.onChange(date)
                          setIsCalendarOpen(false)
                        }}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Method</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a method" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="UPI">UPI</SelectItem>
                      <SelectItem value="Cash">Cash</SelectItem>
                      <SelectItem value="Card">Card</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Input placeholder="Optional: Add a note" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">Add Transaction</Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
