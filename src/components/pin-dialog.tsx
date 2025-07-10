
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
import { Fingerprint, IndianRupee } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CORRECT_PIN = "1234";

type PinDialogProps = {
  onPinSuccess: () => void;
};

export function PinDialog({ onPinSuccess }: PinDialogProps) {
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

  const handleUnlock = () => {
    if (pin === CORRECT_PIN) {
      onPinSuccess();
    } else {
      setError("Incorrect PIN. Please try again.");
      setPin("");
    }
  };

  const handleBiometricUnlock = async () => {
    if (typeof window.PublicKeyCredential === 'undefined' || !navigator.credentials) {
       toast({
        variant: "destructive",
        title: "Biometrics Not Supported",
        description: "Your browser or device does not support biometric authentication.",
      });
      return;
    }
    
    try {
      // In a real-world app, you would fetch a challenge from your server here.
      // For this prototype, we use a static, simplified challenge.
      const publicKeyCredentialRequestOptions: PublicKeyCredentialRequestOptions = {
        challenge: new Uint8Array(16), // Dummy challenge
        allowCredentials: [], // In a real app, you would provide credential IDs
        timeout: 60000,
        userVerification: 'preferred',
      };
      
      // This will trigger the browser's biometric prompt (e.g., fingerprint, face ID)
      await navigator.credentials.get({ publicKey: publicKeyCredentialRequestOptions });

      // If the above line doesn't throw an error, the user has successfully authenticated.
      toast({
        title: "Biometric Scan Successful",
        description: "Unlocking app...",
      });
      onPinSuccess();

    } catch (err) {
      console.error("Biometric authentication error:", err);
      toast({
        variant: "destructive",
        title: "Biometric Failed",
        description: "Could not verify your identity. Please try again or use your PIN.",
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleUnlock();
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
                <IndianRupee className="h-6 w-6 text-primary-foreground" />
            </div>
          <DialogTitle className="text-2xl">Enter Your PIN</DialogTitle>
          <DialogDescription>
            Unlock RupeeRoute to manage your finances.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <Input
            type="password"
            value={pin}
            onChange={handlePinChange}
            onKeyPress={handleKeyPress}
            maxLength={4}
            placeholder="****"
            className="text-center text-2xl font-mono tracking-[0.5em] h-12"
            autoFocus
          />
           <Button variant="outline" className="w-full" onClick={handleBiometricUnlock}>
            <Fingerprint className="mr-2 h-4 w-4" />
            Use Biometrics
          </Button>
          {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
        </div>
        <DialogFooter>
          <Button onClick={handleUnlock} className="w-full">Unlock with PIN</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
