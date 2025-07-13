
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Fingerprint } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Label } from "./ui/label";
import { browserSupportsWebAuthn, startRegistration } from '@simplewebauthn/browser';
import { Logo } from "./logo";


type WelcomeDialogProps = {
  onSetupSuccess: () => void;
  onSwitchToLogin: () => void;
};

export function WelcomeDialog({ onSetupSuccess, onSwitchToLogin }: WelcomeDialogProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const { toast } = useToast();
  const [isBiometricSetupOpen, setIsBiometricSetupOpen] = useState(false);

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
    if (!/^\d{4}$/.test(pin)) {
        setError("PIN must be exactly 4 digits.");
        return;
    }
    
    // Clear previous user data
    localStorage.removeItem("rupee-route-transactions");
    localStorage.removeItem("rupee-route-accounts");
    
    // Save new user data
    localStorage.setItem("rupee-route-user", name.trim());
    localStorage.setItem("rupee-route-phone", phone);
    localStorage.setItem("rupee-route-auth-method", "pin");
    localStorage.setItem("rupee-route-credential", pin);
    
    toast({
      title: "Setup Complete!",
      description: `Welcome to RupeeRoute, ${name.trim()}!`,
    });
    
    if (browserSupportsWebAuthn()) {
      setIsBiometricSetupOpen(true);
    } else {
      onSetupSuccess();
    }
  };
  
  const handleSetupBiometrics = async () => {
    try {
        const registration = await startRegistration({
            challenge: 'registration-challenge',
            rp: { name: 'RupeeRoute', id: window.location.hostname },
            userName: name.trim(),
            userDisplayName: name.trim(),
        });
        
        const credentialForStorage = {
          id: Array.from(registration.rawId),
          rawId: Array.from(registration.rawId),
          type: registration.type
        };

        localStorage.setItem('rupee-route-webauthn-credential', JSON.stringify(credentialForStorage));
        toast({ title: 'Biometric Setup Successful', description: 'You can now log in with your fingerprint or face.' });
    } catch (err: any) {
        toast({ variant: 'destructive', title: 'Biometric Setup Failed', description: err.message || 'Could not set up biometrics.' });
    } finally {
        setIsBiometricSetupOpen(false);
        onSetupSuccess();
    }
  };

  const handleSkipBiometrics = () => {
    setIsBiometricSetupOpen(false);
    onSetupSuccess();
  }


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
  
  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
        setPin(value);
    }
  };

  return (
    <>
      <Dialog open={!isBiometricSetupOpen} onOpenChange={(open) => !open && onSwitchToLogin()}>
        <DialogContent
          className="max-w-sm"
          onInteractOutside={(e) => e.preventDefault()}
          hideCloseButton={true}
        >
          <DialogHeader className="items-center text-center">
              <Logo className="mb-4" />
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
                <Label htmlFor="pin">Set a 4-Digit PIN</Label>
                <Input
                    id="pin"
                    type="password"
                    inputMode="numeric"
                    value={pin}
                    onChange={handlePinChange}
                    placeholder="Enter 4 digits"
                    maxLength={4}
                />
            </div>
            
            {error && <p className="text-red-500 text-sm text-center pt-2">{error}</p>}
          </div>
          <DialogFooter className="flex-col items-center justify-center space-y-2">
            <Button onClick={handleCompleteSetup} className="w-full">Sign Up</Button>
            <div className="text-center text-sm">
              Already have an account?{" "}
              <Button variant="link" size="sm" className="p-0 h-auto" onClick={onSwitchToLogin}>
                Sign In
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={isBiometricSetupOpen}>
        <AlertDialogContent>
          <AlertDialogHeader className="items-center text-center">
              <Fingerprint className="h-12 w-12 text-primary mb-4"/>
            <AlertDialogTitle>Enable Biometric Login?</AlertDialogTitle>
            <AlertDialogDescription>
              Would you like to use your fingerprint or face to log in faster next time?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:justify-center">
            <AlertDialogCancel onClick={handleSkipBiometrics}>Skip</AlertDialogCancel>
            <AlertDialogAction onClick={handleSetupBiometrics}>Enable</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
