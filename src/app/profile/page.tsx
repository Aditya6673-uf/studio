"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function ProfilePage() {
  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-8">
      <div className="mb-6 flex items-center gap-4">
        <SidebarTrigger className="md:hidden" />
        <h1 className="font-headline text-3xl font-bold">Profile</h1>
      </div>
      <div className="flex justify-center">
        <Card className="w-full max-w-lg">
          <CardHeader className="items-center text-center">
             <Avatar className="h-24 w-24 mb-4">
              <AvatarImage src="https://placehold.co/96x96.png" alt="@aditya" data-ai-hint="male portrait" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
            <CardTitle className="text-3xl">Aditya</CardTitle>
            <CardDescription>aditya@example.com</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" defaultValue="Aditya" />
            </div>
             <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="aditya@example.com" />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Save Changes</Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
