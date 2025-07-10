
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
import { IndianRupee } from "lucide-react";

const CORRECT_PIN = "1234";

type PinDialogProps = {
  onPinSuccess: () => void;
};

export function PinDialog({ onPinSuccess }: PinDialogProps) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

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
        <div className="py-4">
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
          {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
        </div>
        <DialogFooter>
          <Button onClick={handleUnlock} className="w-full">Unlock</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
