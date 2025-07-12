
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import React from "react"
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
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "./ui/calendar"
import type { RealEstate } from "@/lib/types"

const formSchema = z.object({
  sellPrice: z.coerce.number().positive({ message: "Sell price must be positive." }),
  sellDate: z.date({ required_error: "Please select the sale date." }),
});

type SellPropertyDialogProps = {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  property: RealEstate
  onConfirmSale: (property: RealEstate, sellPrice: number, sellDate: Date) => void
}

export function SellPropertyDialog({ isOpen, setIsOpen, property, onConfirmSale }: SellPropertyDialogProps) {
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);
  
  const fromYear = property.purchaseDate ? new Date(property.purchaseDate).getFullYear() : new Date().getFullYear() - 50;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sellPrice: undefined,
      sellDate: new Date(),
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    onConfirmSale(property, values.sellPrice, values.sellDate);
    form.reset();
    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Sell Property: {property.name}</DialogTitle>
          <DialogDescription>
            Enter the sale details. This will create an income transaction.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="sellPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Selling Price (₹)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 20000000" {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="sellDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date of Sale</FormLabel>
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
                        fromYear={fromYear}
                        toYear={new Date().getFullYear()}
                        selected={field.value}
                        onSelect={(date) => {
                          if (date) field.onChange(date)
                          setIsCalendarOpen(false)
                        }}
                        disabled={(date) => date > new Date() || date < new Date(property.purchaseDate)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Confirm Sale</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
