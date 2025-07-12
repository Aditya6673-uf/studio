
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import React, { useEffect } from "react"
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
import { CalendarIcon, Star } from "lucide-react"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import type { Transaction } from "@/lib/types"
import { useLocalStorage } from "@/hooks/use-local-storage"

const formSchema = z.object({
  type: z.enum(["income", "expense"], { required_error: "Please select a transaction type." }),
  amount: z.coerce.number().positive({ message: "Amount must be positive." }),
  category: z.string().min(1, { message: "Please enter a category." }),
  date: z.date({ required_error: "Please select a date." }),
  paymentMethod: z.enum(["UPI", "Cash", "Card", "Bank"]),
  notes: z.string().optional(),
});


type AddTransactionSheetProps = {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  onAddTransaction: (transaction: Omit<Transaction, 'id' | 'date'> & { date: Date | string }) => void
  defaultType?: 'income' | 'expense'
}

export function AddTransactionSheet({ isOpen, setIsOpen, onAddTransaction, defaultType }: AddTransactionSheetProps) {
  const [favoriteCategories, setFavoriteCategories] = useLocalStorage<string[]>("favoriteCategories", []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "expense",
      amount: undefined,
      date: new Date(),
      paymentMethod: "UPI",
      notes: "",
      category: "",
    },
  })
  
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false)

  const watchedType = form.watch("type");
  const watchedCategory = form.watch("category");

  useEffect(() => {
    if (isOpen) {
      form.reset({
        type: defaultType || 'expense',
        amount: undefined,
        date: new Date(),
        paymentMethod: "UPI",
        notes: "",
        category: "",
      });
    }
  }, [isOpen, defaultType, form]);
  
  useEffect(() => {
    if (defaultType) {
      form.setValue('type', defaultType);
    }
  }, [defaultType, form]);


  React.useEffect(() => {
    form.resetField("category", { defaultValue: "" });
  }, [watchedType, form]);

  const handleToggleFavorite = () => {
    if (!watchedCategory) return;
    const isFavorite = favoriteCategories.includes(watchedCategory);
    if (isFavorite) {
      setFavoriteCategories(favs => favs.filter(f => f !== watchedCategory));
    } else {
      setFavoriteCategories(favs => [...favs, watchedCategory]);
    }
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    onAddTransaction(values);
    form.reset();
    setIsOpen(false);
  }
  
  const isCurrentCategoryFavorite = watchedCategory && favoriteCategories.includes(watchedCategory);


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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-6">
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
                  <div className="relative">
                    <FormControl>
                      <Input placeholder="e.g., Food, Salary, Rent" {...field} className="pr-10" />
                    </FormControl>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground"
                      onClick={handleToggleFavorite}
                      disabled={!watchedCategory}
                    >
                      <Star className={cn("h-4 w-4", isCurrentCategoryFavorite && "fill-yellow-400 text-yellow-400")} />
                      <span className="sr-only">Toggle Favorite</span>
                    </Button>
                  </div>
                   {favoriteCategories.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {favoriteCategories.map(fav => (
                        <Button
                          key={fav}
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-auto px-2 py-1 text-xs"
                          onClick={() => form.setValue("category", fav)}
                        >
                          {fav}
                        </Button>
                      ))}
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

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
                        captionLayout="dropdown-buttons"
                        fromYear={new Date().getFullYear() - 10}
                        toYear={new Date().getFullYear() + 10}
                        selected={field.value}
                        onSelect={(date) => {
                          if (date) field.onChange(date)
                          setIsCalendarOpen(false)
                        }}
                        onDayDoubleClick={(date) => {
                          if (date) field.onChange(date)
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
                      <SelectItem value="Bank">Bank</SelectItem>
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
