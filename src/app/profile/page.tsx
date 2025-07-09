"use client";

import { useRef, useState, type ChangeEvent } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Camera } from 'lucide-react';

export default function ProfilePage() {
  const [avatarSrc, setAvatarSrc] = useState("https://placehold.co/96x96.png");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarSrc(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-8">
      <div className="mb-6 flex items-center gap-4">
        <SidebarTrigger className="md:hidden" />
        <h1 className="font-headline text-3xl font-bold">Profile</h1>
      </div>
      <div className="flex justify-center">
        <Card className="w-full max-w-lg">
          <CardHeader className="items-center text-center">
            <div className="relative group mb-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={avatarSrc} alt="@aditya" data-ai-hint="male portrait" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
              <Label
                htmlFor="avatar-upload"
                className="absolute inset-0 flex h-24 w-24 cursor-pointer items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                <Camera className="h-8 w-8" />
                <span className="sr-only">Upload profile picture</span>
              </Label>
              <Input
                id="avatar-upload"
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
              />
            </div>
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
