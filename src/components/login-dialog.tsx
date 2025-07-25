
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
import { Fingerprint } from "lucide-react";
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
import { Label } from "./ui/label";
import { browserSupportsWebAuthn, startAuthentication } from '@simplewebauthn/browser';
import { useToast } from "@/hooks/use-toast";
import { Logo } from "./logo";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

type LoginDialogProps = {
  onLoginSuccess: () => void;
  onSwitchToSignUp: () => void;
};

export function LoginDialog({ onLoginSuccess, onSwitchToSignUp }: LoginDialogProps) {
  const [name, setName] = useState("");
  const [pin, setPin] = useState("");
  const [correctUser, setCorrectUser] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const { toast } = useToast();
  const [hasBiometrics, setHasBiometrics] = useState(false);
  
  const [isResetPhoneDialogOpen, setIsResetPhoneDialogOpen] = useState(false);
  const [isOtpDialogOpen, setIsOtpDialogOpen] = useState(false);
  const [isResetConfirmDialogOpen, setIsResetConfirmDialogOpen] = useState(false);
  const [phoneInput, setPhoneInput] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [otpError, setOtpError] = useState("");

  useEffect(() => {
    const storedName = localStorage.getItem("rupee-route-user");
    const storedCredential = localStorage.getItem("rupee-route-credential");
    
    if (storedName && storedCredential) {
      const storedPhone = localStorage.getItem("rupee-route-phone") || "";
      setCorrectUser({ name: storedName, credential: storedCredential, phone: storedPhone });
      setName(storedName);
    }
    
    const storedBiometricCredential = localStorage.getItem('rupee-route-webauthn-credential');
    setHasBiometrics(!!storedBiometricCredential);
  }, []);

  const handleUnlock = (currentPin: string) => {
    if (name === correctUser.name && currentPin === correctUser.credential) {
      onLoginSuccess();
    } else {
      setError("Incorrect name or PIN.");
      setTimeout(() => {
        setPin("");
        setError("");
      }, 1000);
    }
  };
  
  const handleBiometricLogin = async () => {
    if (!browserSupportsWebAuthn()) {
      toast({ variant: 'destructive', title: 'Unsupported Browser', description: 'Your browser does not support biometric login.' });
      return;
    }
    try {
      const storedCredential = localStorage.getItem('rupee-route-webauthn-credential');
       if (!storedCredential) {
         toast({ variant: 'destructive', title: 'Biometrics Not Set Up', description: 'Please log in with your PIN and set up biometrics first.' });
         return;
       }
      
      const credential = JSON.parse(storedCredential);
      
      const auth = await startAuthentication({
          challenge: 'login-challenge',
          rpId: window.location.hostname,
          allowCredentials: [{
            id: Uint8Array.from(credential.rawId, c => c),
            type: 'public-key'
          }],
      });
      onLoginSuccess();
    } catch (err: any) {
        toast({ variant: 'destructive', title: 'Biometric Login Failed', description: err.message || 'Please try again.' });
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      handleUnlock(pin);
    }
  };
  
  const handlePhoneVerification = () => {
    if (phoneInput === correctUser.phone) {
      setPhoneError("");
      setIsResetPhoneDialogOpen(false);
      setIsOtpDialogOpen(true); // Open OTP dialog next
    } else {
      setPhoneError("Phone number does not match.");
    }
  };

  const handleOtpVerification = () => {
    // We can't send a real OTP, so we'll use a hardcoded value for demonstration.
    if (otpInput === "123456") {
      setOtpError("");
      setIsOtpDialogOpen(false);
      setIsResetConfirmDialogOpen(true);
    } else {
      setOtpError("Incorrect OTP. Please try again.");
    }
  };

  const handleResetApp = () => {
    localStorage.clear();
    window.location.reload(); // Reload the page to trigger the setup flow
  };

  const handlePhoneInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setPhoneInput(value);
    }
  };

  const handlePinChange = (value: string) => {
    if (/^\d*$/.test(value)) {
        setPin(value);
        if (value.length === 4) {
            handleUnlock(value);
        }
    }
  };

  return (
    <>
      <Dialog open={!isResetPhoneDialogOpen && !isResetConfirmDialogOpen && !isOtpDialogOpen}>
        <DialogContent
          className="max-w-sm"
          onInteractOutside={(e) => e.preventDefault()}
          hideCloseButton={true}
        >
          <DialogHeader className="items-center text-center">
              <Logo className="mb-4" />
            <DialogTitle className="text-2xl">Welcome Back!</DialogTitle>
            <DialogDescription>
              Enter your PIN to unlock RupeeRoute.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4" onKeyPress={handleKeyPress}>
            <div className="space-y-2">
              <Label htmlFor="login-name">Name</Label>
              <Input
                id="login-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="login-credential">PIN</Label>
              <div className="flex items-center gap-2">
                  <Input
                    id="login-credential"
                    type="password"
                    inputMode="numeric"
                    value={pin}
                    onChange={(e) => handlePinChange(e.target.value)}
                    placeholder="Enter your 4-digit PIN"
                    maxLength={4}
                    className="flex-1"
                    autoFocus
                  />
                  {hasBiometrics && (
                      <Button variant="outline" size="icon" onClick={handleBiometricLogin} aria-label="Login with biometrics">
                          <Fingerprint className="h-5 w-5"/>
                      </Button>
                  )}
              </div>
            </div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          </div>
          <DialogFooter className="flex-col items-center justify-center space-y-2">
            <Button onClick={() => handleUnlock(pin)} className="w-full">Sign In</Button>
            <div className="text-center text-sm">
              Don't have an account?{" "}
              <Button variant="link" size="sm" className="p-0 h-auto" onClick={onSwitchToSignUp}>
                  Sign Up
              </Button>
            </div>
            <Button variant="link" size="sm" className="p-0 h-auto" onClick={() => setIsResetPhoneDialogOpen(true)}>
              Forgot PIN or want to reset?
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isResetPhoneDialogOpen} onOpenChange={setIsResetPhoneDialogOpen}>
        <DialogContent>
            <DialogHeader>
              <DialogTitle>Verify Your Identity</DialogTitle>
              <DialogDescription>
                To reset the app, please enter the phone number you used during signup.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-2">
              <Label htmlFor="phone-verify">Phone Number</Label>
              <Input
                id="phone-verify"
                type="tel"
                value={phoneInput}
                onChange={handlePhoneInputChange}
                placeholder="Enter 10-digit number"
                maxLength={10}
              />
              {phoneError && <p className="text-red-500 text-sm pt-2">{phoneError}</p>}
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={() => setIsResetPhoneDialogOpen(false)}>Cancel</Button>
                <Button onClick={handlePhoneVerification}>Continue</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isOtpDialogOpen} onOpenChange={setIsOtpDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter OTP</DialogTitle>
            <DialogDescription>
              An OTP has been sent to your number. Please enter it below. (Hint: use 123456)
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 py-4">
            <InputOTP maxLength={6} value={otpInput} onChange={setOtpInput}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
            {otpError && <p className="text-red-500 text-sm">{otpError}</p>}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOtpDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleOtpVerification}>Verify OTP</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isResetConfirmDialogOpen} onOpenChange={setIsResetConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset App?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. All your data, including your account and transactions, will be permanently deleted. You will have to set up the app again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleResetApp}>Reset App</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
