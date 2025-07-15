
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "./ui/calendar"
import type { PreciousMetal } from "@/lib/types"

const formSchema = z.object({
  metal: z.enum(["Gold", "Silver"], { required_error: "Please select a metal." }),
  form: z.enum(["Jewelry", "Coin", "Bar", "Digital"], { required_error: "Please select a form." }),
  weightInGrams: z.coerce.number().positive({ message: "Weight must be positive." }),
  purity: z.string().min(1, { message: "Purity is required." }),
  purchaseDate: z.date({ required_error: "Please select the purchase date." }),
  purchasePrice: z.coerce.number().positive({ message: "Purchase price must be positive." }),
});

type AddBullionDialogProps = {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  onAddBullion: (data: Omit<PreciousMetal, 'id'>) => void
}

export function AddBullionDialog({ isOpen, setIsOpen, onAddBullion }: AddBullionDialogProps) {
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      metal: "Gold",
      form: "Jewelry",
      weightInGrams: undefined,
      purity: "",
      purchaseDate: new Date(),
      purchasePrice: undefined,
    },
  });

  const selectedMetal = form.watch("metal");

  function onSubmit(values: z.infer<typeof formSchema>) {
    onAddBullion(values);
    form.reset();
    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Bullion Investment</DialogTitle>
          <DialogDescription>
            Enter the details for your new gold or silver investment. An expense transaction will be created.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="metal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Metal</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a metal" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Gold">Gold</SelectItem>
                          <SelectItem value="Silver">Silver</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="form"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Form</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a form" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Jewelry">Jewelry</SelectItem>
                          <SelectItem value="Coin">Coin</SelectItem>
                          <SelectItem value="Bar">Bar</SelectItem>
                          <SelectItem value="Digital">Digital</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="weightInGrams"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weight (grams)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 10.5" {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="purity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{selectedMetal === 'Gold' ? 'Purity (Karat)' : 'Purity (%)'}</FormLabel>
                    <FormControl>
                      <Input placeholder={selectedMetal === 'Gold' ? 'e.g., 22' : 'e.g., 99.9'} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
             <FormField
              control={form.control}
              name="purchasePrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Purchase Price (₹)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 55000" {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="purchaseDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Purchase Date</FormLabel>
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
                        fromYear={new Date().getFullYear() - 50}
                        toYear={new Date().getFullYear()}
                        selected={field.value}
                        onSelect={(date) => {
                          if (date) field.onChange(date)
                          setIsCalendarOpen(false)
                        }}
                        disabled={(date) => date > new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Add Investment</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
