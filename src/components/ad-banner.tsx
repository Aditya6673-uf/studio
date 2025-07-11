
"use client";

import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";

export function AdBanner() {
  return (
    <Card className="overflow-hidden">
      <Link href="/subscription" className="block group">
        <div className="relative aspect-video w-full">
          <Image
            src="https://placehold.co/1200x300.png"
            alt="Advertisement"
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-300 group-hover:scale-105"
            data-ai-hint="advertisement banner"
          />
           <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <div className="text-center text-white p-4 bg-black/50 rounded-lg">
                <h3 className="font-headline text-2xl font-bold">Go Pro, Go Ad-Free!</h3>
                <p className="text-sm">Upgrade now to remove ads and unlock more features.</p>
            </div>
           </div>
        </div>
      </Link>
    </Card>
  );
}
