
"use client"

import React from "react";
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
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "./ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { AutoCredit } from "@/lib/types";

const formSchema = z.object({
  name: z.string().min(1, { message: "Please enter a name." }),
  amount: z.coerce.number().positive({ message: "Amount must be positive." }),
  frequency: z.enum(["Monthly", "Quarterly", "Yearly", "One-Time"], { required_error: "Please select a frequency." }),
  nextDate: z.date({ required_error: "Please select a date." }),
});

type AddAutoCreditDialogProps = {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  onAddAutoCredit: (data: Omit<AutoCredit, 'id'>) => void
}

export function AddAutoCreditDialog({ isOpen, setIsOpen, onAddAutoCredit }: AddAutoCreditDialogProps) {
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      amount: undefined,
      frequency: "Monthly",
      nextDate: new Date(),
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    onAddAutoCredit(values);
    form.reset();
    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Auto Credit</DialogTitle>
          <DialogDescription>
            Schedule a new automatic payment.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Mutual Fund SIP" {...field} />
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
              name="frequency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Frequency</FormLabel>
                   <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Monthly">Monthly</SelectItem>
                      <SelectItem value="Quarterly">Quarterly</SelectItem>
                      <SelectItem value="Yearly">Yearly</SelectItem>
                      <SelectItem value="One-Time">One-Time</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="nextDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Next Payment Date</FormLabel>
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
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Add Auto Credit</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
