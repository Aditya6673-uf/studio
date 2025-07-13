
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
import { IndianRupee, User } from "lucide-react";
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

type LoginDialogProps = {
  onLoginSuccess: () => void;
};

export function LoginDialog({ onLoginSuccess }: LoginDialogProps) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [correctUser, setCorrectUser] = useState<Record<string, string>>({});
  const [error, setError] = useState("");

  useEffect(() => {
    const storedName = localStorage.getItem("rupee-route-user");
    const storedPassword = localStorage.getItem("rupee-route-password");
    if (storedName && storedPassword) {
      setCorrectUser({ name: storedName, password: storedPassword });
      setName(storedName); // Pre-fill username
    }
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
            <Input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        </div>
        <DialogFooter className="flex-col items-center justify-center space-y-2">
          <Button onClick={handleUnlock} className="w-full">Unlock</Button>
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
