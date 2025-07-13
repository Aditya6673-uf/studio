
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
import { User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Label } from "./ui/label";

type WelcomeDialogProps = {
  onSetupSuccess: () => void;
};

export function WelcomeDialog({ onSetupSuccess }: WelcomeDialogProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const { toast } = useToast();

  const handleCompleteSetup = () => {
    setError(""); // Reset error on each attempt
    if (name.trim().length < 2) {
      setError("Please enter a valid name.");
      return;
    }
    if (!/^\d{10}$/.test(phone)) {
        setError("Please enter a valid 10-digit phone number.");
        return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    
    // Clear any sample data that might exist
    localStorage.removeItem("rupee-route-transactions");
    localStorage.removeItem("rupee-route-accounts");
    
    localStorage.setItem("rupee-route-user", name.trim());
    localStorage.setItem("rupee-route-phone", phone);
    localStorage.setItem("rupee-route-password", password);
    
    toast({
      title: "Setup Complete!",
      description: `Welcome to RupeeRoute, ${name.trim()}!`,
    });
    
    onSetupSuccess();
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      handleCompleteSetup();
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setPhone(value);
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
        <div className="py-4 space-y-4" onKeyPress={handleKeyPress}>
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
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={handlePhoneChange}
              placeholder="Enter your 10-digit phone number"
              maxLength={10}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Set a Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter your password"
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center pt-2">{error}</p>}
        </div>
        <DialogFooter>
          <Button onClick={handleCompleteSetup} className="w-full">Complete Setup</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
