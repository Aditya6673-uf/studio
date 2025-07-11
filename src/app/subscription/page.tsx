
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { CheckCircle } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "₹0",
    period: "",
    features: [
      "Track income & expenses",
      "Set savings goals",
      "Basic reporting",
    ],
    buttonText: "Current Plan",
    buttonVariant: "outline",
    isPopular: false,
  },
  {
    name: "Pro Monthly",
    price: "₹29",
    period: "/ month",
    features: [
      "All Free features",
      "Ad-free experience",
      "Advanced reporting & export",
      "SMS transaction import",
      "Loan & auto-credit tracking",
    ],
    buttonText: "Choose Plan",
    buttonVariant: "default",
    isPopular: true,
  },
  {
    name: "Pro Semi-Annual",
    price: "₹149",
    period: "/ 6 months",
    features: [
      "All Pro features",
      "Ad-free experience",
      "Save ~15% vs monthly",
      "Priority support",
    ],
    buttonText: "Choose Plan",
    buttonVariant: "default",
    isPopular: false,
  },
  {
    name: "Pro Annual",
    price: "₹299",
    period: "/ year",
    features: [
      "All Pro features",
      "Ad-free experience",
      "Save ~20% vs monthly",
      "Priority support",
      "Early access to new features",
    ],
    buttonText: "Choose Plan",
    buttonVariant: "default",
    isPopular: false,
  },
];

export default function SubscriptionPage() {
  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-8">
      <div className="mb-8 flex items-center gap-4">
        <SidebarTrigger className="md:hidden" />
        <h1 className="font-headline text-3xl font-bold">Subscription Plans</h1>
      </div>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {plans.map((plan) => (
          <Card key={plan.name} className={`flex flex-col ${plan.isPopular ? 'border-primary border-2' : ''}`}>
            <CardHeader className="items-center">
              {plan.isPopular && <div className="text-xs font-bold uppercase text-primary -mt-2 mb-2">Most Popular</div>}
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <CardDescription className="text-4xl font-bold font-headline text-foreground">
                {plan.price}<span className="text-base font-normal text-muted-foreground">{plan.period}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow space-y-4">
              <ul className="space-y-3 text-sm">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <div className="p-6 pt-0">
               <Button className="w-full" variant={plan.buttonVariant as any} disabled={plan.buttonVariant === 'outline'}>
                {plan.buttonText}
               </Button>
            </div>
          </Card>
        ))}
      </div>
    </main>
  );
}
