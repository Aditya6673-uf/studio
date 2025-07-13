
"use client";

import { useRef, useState, type ChangeEvent } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Camera, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ProfilePage() {
  const [avatarSrc, setAvatarSrc] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [isEmailVisible, setIsEmailVisible] = useState(true);

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

  const handleDeleteImage = () => {
    setAvatarSrc("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSaveChanges = () => {
    toast({
      title: "Profile Updated",
      description: "Your changes have been saved successfully.",
    });
    setIsEmailVisible(false);
  };

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-8">
      <div className="mb-6 flex items-center gap-4">
        <SidebarTrigger className="md:hidden" />
        <h1 className="font-headline text-3xl font-bold">Profile</h1>
      </div>
      <div className="grid gap-6">
        <Card className="w-full max-w-lg mx-auto">
          <CardHeader className="items-center text-center">
            <div className="relative group mb-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={avatarSrc} alt="@aditya" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
              <div
                className="absolute inset-0 flex h-24 w-24 items-center justify-center gap-4 rounded-full bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                <Label
                  htmlFor="avatar-upload"
                  className="cursor-pointer rounded-full p-2 transition-colors hover:bg-black/20"
                >
                  <Camera className="h-6 w-6" />
                  <span className="sr-only">Upload profile picture</span>
                </Label>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-auto cursor-pointer rounded-full p-2 text-white transition-colors hover:bg-black/20 hover:text-white"
                  onClick={handleDeleteImage}
                >
                  <Trash2 className="h-6 w-6" />
                  <span className="sr-only">Delete profile picture</span>
                </Button>
              </div>
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
            {isEmailVisible && (
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="aditya@example.com" />
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={handleSaveChanges}>Save Changes</Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
