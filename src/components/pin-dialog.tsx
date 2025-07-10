
"use client";

import { useState, useEffect } from "react";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type PinDialogProps = {
  onPinSuccess: () => void;
};

export function PinDialog({ onPinSuccess }: PinDialogProps) {
  const [pin, setPin] = useState("");
  const [correctPin, setCorrectPin] = useState("");
  const [error, setError] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const storedPin = localStorage.getItem("rupee-route-pin");
    if (storedPin) {
      setCorrectPin(storedPin);
    }
  }, []);

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 4) {
      setPin(value);
      setError("");
    }
  };

  const handleUnlock = () => {
    if (pin === correctPin) {
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
      // This is a simplified check. A real implementation would involve storing and verifying credentials.
      const publicKeyCredentialRequestOptions: PublicKeyCredentialRequestOptions = {
        challenge: new Uint8Array(16), 
        allowCredentials: [], 
        timeout: 60000,
        userVerification: 'preferred',
      };
      
      await navigator.credentials.get({ publicKey: publicKeyCredentialRequestOptions });

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

  const handleResetApp = () => {
    localStorage.removeItem("rupee-route-pin");
    localStorage.removeItem("rupee-route-user");
    localStorage.removeItem("favoriteCategories"); // Clear any other stored data
    window.location.reload(); // Reload the page to trigger the setup flow
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
            inputMode="numeric"
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
        <DialogFooter className="flex-col-reverse items-center justify-center space-y-2 space-y-reverse">
          <Button onClick={handleUnlock} className="w-full">Unlock with PIN</Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="link" size="sm" className="p-0 h-auto">Forgot PIN?</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Reset App?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. All your data, including accounts and transactions, will be permanently deleted. You will have to set up the app again.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleResetApp}>Reset App</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
