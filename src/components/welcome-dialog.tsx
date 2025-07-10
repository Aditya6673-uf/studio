
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IndianRupee, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Label } from "./ui/label";

type WelcomeDialogProps = {
  onSetupSuccess: () => void;
};

export function WelcomeDialog({ onSetupSuccess }: WelcomeDialogProps) {
  const [name, setName] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const { toast } = useToast();

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 4) {
      setPin(value);
      setError("");
    }
  };

  const handleCompleteSetup = () => {
    if (name.trim().length < 2) {
      setError("Please enter a valid name.");
      return;
    }
    if (pin.length !== 4) {
      setError("PIN must be exactly 4 digits.");
      return;
    }
    
    localStorage.setItem("rupee-route-user", name.trim());
    localStorage.setItem("rupee-route-pin", pin);
    
    toast({
      title: "Setup Complete!",
      description: `Welcome to RupeeRoute, ${name.trim()}!`,
    });
    
    onSetupSuccess();
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCompleteSetup();
    }
  };

  return (
    <Dialog open={true}>
      <DialogContent
        className="max-w-sm"
        onInteractOutside={(e) => e.preventDefault()}
        hideCloseButton={true}
      >
        <DialogHeader className="items-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary mb-4">
                <User className="h-6 w-6 text-primary-foreground" />
            </div>
          <DialogTitle className="text-2xl">Welcome to RupeeRoute!</DialogTitle>
          <DialogDescription>
            Let's get your account set up.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-6">
           <div className="space-y-2">
            <Label htmlFor="name">What should we call you?</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pin">Set a 4-digit PIN</Label>
            <Input
              id="pin"
              type="password"
              value={pin}
              onChange={handlePinChange}
              onKeyPress={handleKeyPress}
              maxLength={4}
              placeholder="****"
              className="text-center text-2xl font-mono tracking-[0.5em] h-12"
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center -mt-2">{error}</p>}
        </div>
        <DialogFooter>
          <Button onClick={handleCompleteSetup} className="w-full">Complete Setup</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
