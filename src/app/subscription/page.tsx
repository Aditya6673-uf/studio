
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { CheckCircle, Crown } from "lucide-react";
import { AdBanner } from "@/components/ad-banner";
import { useSubscription } from "@/context/subscription-context";
import { useToast } from "@/hooks/use-toast";
import type { Plan } from "@/lib/types";
import { format } from "date-fns";
import Link from "next/link";

const plans: Plan[] = [
  {
    name: "Free",
    price: "₹0",
    period: "",
    durationInMonths: null,
    features: [
      "Supported by ads",
    ],
    buttonText: "Current Plan",
    buttonVariant: "outline",
    isPopular: false,
  },
  {
    name: "Pro Monthly",
    price: "₹29",
    period: "/ month",
    durationInMonths: 1,
    features: [
      "Ad-free experience",
    ],
    buttonText: "Choose Plan",
    buttonVariant: "default",
    isPopular: true,
  },
  {
    name: "Pro Semi-Annual",
    price: "₹149",
    period: "/ 6 months",
    durationInMonths: 6,
    features: [
      "Ad-free experience",
      "Save ~15% vs monthly",
    ],
    buttonText: "Choose Plan",
    buttonVariant: "default",
    isPopular: false,
  },
  {
    name: "Pro Annual",
    price: "₹299",
    period: "/ year",
    durationInMonths: 12,
    features: [
      "Ad-free experience",
      "Save ~20% vs monthly",
    ],
    buttonText: "Choose Plan",
    buttonVariant: "default",
    isPopular: false,
  },
];

export default function SubscriptionPage() {
  const { isSubscribed, subscriptionInfo, subscribe, cancelSubscription } = useSubscription();
  const { toast } = useToast();

  const handleChoosePlan = (plan: Plan) => {
    if (plan.durationInMonths === null) return;
    subscribe({ planName: plan.name, durationInMonths: plan.durationInMonths });
    toast({
        title: "Subscription Activated!",
        description: `You've successfully subscribed to the ${plan.name} plan.`,
    });
  };

  const handleCancelSubscription = () => {
    cancelSubscription();
    toast({
      title: "Subscription Cancelled",
      description: "You have been moved to the Free plan.",
    });
  };
  
  const currentPlan = isSubscribed && subscriptionInfo ? plans.find(p => p.name === subscriptionInfo.planName) : plans[0];


  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-8">
      <div className="mb-8 flex items-center gap-4">
        <SidebarTrigger className="md:hidden" />
        <h1 className="font-headline text-3xl font-bold">Subscription Plans</h1>
      </div>

      {isSubscribed && subscriptionInfo && (
        <Card className="mb-8 bg-primary/10 border-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Crown className="text-primary"/>
                Your Current Plan
            </CardTitle>
            <CardDescription>You are currently on the <strong>{subscriptionInfo.planName}</strong> plan.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              Your subscription is active. You can manage your subscription here.
              {subscriptionInfo.endDate && (
                <span className="block mt-1 text-muted-foreground">Expires on: {format(new Date(subscriptionInfo.endDate), 'dd MMM, yyyy')}</span>
              )}
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {plans.map((plan) => {
            const isCurrentPlan = subscriptionInfo?.planName === plan.name;
            return (
            <Card key={plan.name} className={`flex flex-col ${plan.isPopular && !isCurrentPlan ? 'border-primary border-2' : ''}`}>
                <CardHeader className="items-center">
                {plan.isPopular && !isCurrentPlan && <div className="text-xs font-bold uppercase text-primary -mt-2 mb-2">Most Popular</div>}
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
                <Button 
                    className="w-full"
                    variant={isCurrentPlan ? "outline" : "default"}
                    onClick={() => handleChoosePlan(plan)}
                    disabled={isCurrentPlan}
                >
                    {isCurrentPlan ? "Current Plan" : plan.buttonText}
                </Button>
                </div>
            </Card>
            )
        })}
      </div>
      {!isSubscribed && (
        <div className="mt-8">
          <AdBanner />
        </div>
      )}
    </main>
  );
}
