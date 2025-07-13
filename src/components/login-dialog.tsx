
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
import { IndianRupee, User, Fingerprint } from "lucide-react";
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
import { Label } from "./ui/label";
import { browserSupportsWebAuthn, startAuthentication } from '@simplewebauthn/browser';
import { useToast } from "@/hooks/use-toast";

type LoginDialogProps = {
  onLoginSuccess: () => void;
  onSwitchToSignUp: () => void;
};

export function LoginDialog({ onLoginSuccess, onSwitchToSignUp }: LoginDialogProps) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [correctUser, setCorrectUser] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const { toast } = useToast();
  const [hasBiometrics, setHasBiometrics] = useState(false);

  useEffect(() => {
    const storedName = localStorage.getItem("rupee-route-user");
    const storedPassword = localStorage.getItem("rupee-route-password");
    if (storedName && storedPassword) {
      setCorrectUser({ name: storedName, password: storedPassword });
      setName(storedName);
    }
    const credential = localStorage.getItem('rupee-route-webauthn-credential');
    setHasBiometrics(!!credential);
  }, []);
  
  const handleUnlock = () => {
    if (name === correctUser.name && password === correctUser.password) {
      onLoginSuccess();
    } else {
      setError("Incorrect username or password.");
      setTimeout(() => {
        setPassword("");
      }, 500);
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
         toast({ variant: 'destructive', title: 'Biometrics Not Set Up', description: 'Please log in with your password and set up biometrics first.' });
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
      handleUnlock();
    }
  };

  const handleResetApp = () => {
    localStorage.clear();
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
          <DialogTitle className="text-2xl">Welcome Back!</DialogTitle>
          <DialogDescription>
            Enter your credentials to unlock RupeeRoute.
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
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="login-password">Password</Label>
            <div className="flex items-center gap-2">
                <Input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="flex-1"
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
          <Button onClick={handleUnlock} className="w-full">Sign In</Button>
          <div className="text-center text-sm">
            Don't have an account?{" "}
            <Button variant="link" size="sm" className="p-0 h-auto" onClick={onSwitchToSignUp}>
                Sign Up
            </Button>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="link" size="sm" className="p-0 h-auto">Forgot password or want to reset?</Button>
            </AlertDialogTrigger>
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
