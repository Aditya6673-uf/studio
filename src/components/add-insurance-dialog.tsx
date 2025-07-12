
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
import type { Insurance } from "@/lib/types"

const formSchema = z.object({
  provider: z.string().min(1, { message: "Please enter the provider's name." }),
  policyName: z.string().min(1, { message: "Please enter the policy name." }),
  type: z.enum(["Health", "Life", "Vehicle", "Other"], { required_error: "Please select a policy type." }),
  premium: z.coerce.number().positive({ message: "Premium must be positive." }),
  coverage: z.coerce.number().positive({ message: "Coverage must be positive." }),
  nextDueDate: z.date({ required_error: "Please select the next due date." }),
});

type AddInsuranceDialogProps = {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  onAddInsurance: (insurance: Omit<Insurance, 'id'>) => void
}

export function AddInsuranceDialog({ isOpen, setIsOpen, onAddInsurance }: AddInsuranceDialogProps) {
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      provider: "",
      policyName: "",
      type: "Health",
      premium: undefined,
      coverage: undefined,
      nextDueDate: new Date(),
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    onAddInsurance(values);
    form.reset();
    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Insurance Policy</DialogTitle>
          <DialogDescription>
            Enter the details for your new insurance policy.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="policyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Policy Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Jeevan Anand" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="provider"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Insurance Provider</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., LIC, HDFC Ergo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Policy Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a policy type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Health">Health</SelectItem>
                      <SelectItem value="Life">Life</SelectItem>
                      <SelectItem value="Vehicle">Vehicle</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="premium"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Premium (₹)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 12000" {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="coverage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Coverage (₹)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 500000" {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
             <FormField
              control={form.control}
              name="nextDueDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Next Premium Due Date</FormLabel>
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
                        fromYear={new Date().getFullYear()}
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
              <Button type="submit">Add Policy</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
