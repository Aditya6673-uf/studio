
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IndianRupee, Landmark, PlusCircle, Wallet, Trash2 } from "lucide-react";
import { initialAccounts } from "@/lib/data";
import type { Account } from "@/lib/types";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { AddAccountDialog } from "@/components/add-account-dialog";
import { useLocalStorage } from "@/hooks/use-local-storage";
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

const accountIcons = {
  Bank: <Landmark className="h-8 w-8 text-primary" />,
  Wallet: <Wallet className="h-8 w-8 text-primary" />,
};

export default function AccountsPage() {
  const [accounts, setAccounts] = useLocalStorage<Account[]>('rupee-route-accounts', initialAccounts);
  const [isAddAccountOpen, setIsAddAccountOpen] = useState(false);
  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  const handleAddAccount = (accountData: Omit<Account, 'id'>) => {
    const newAccount: Account = {
      ...accountData,
      id: new Date().getTime().toString(),
    };
    setAccounts(prev => [...prev, newAccount]);
  };

  const handleDeleteAccount = (id: string) => {
    setAccounts(prev => prev.filter(acc => acc.id !== id));
  };

  return (
    <>
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="md:hidden" />
            <h1 className="font-headline text-3xl font-bold">Accounts</h1>
          </div>
          <Button onClick={() => setIsAddAccountOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Account
          </Button>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Total Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="font-headline text-4xl font-bold text-primary flex items-center">
                <IndianRupee className="h-8 w-8" />{totalBalance.toLocaleString('en-IN')}
              </div>
              <p className="text-sm text-muted-foreground">Across {accounts.length} accounts</p>
            </CardContent>
          </Card>

          {accounts.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {accounts.map(account => (
                <Card key={account.id} className="flex flex-col">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg font-medium">{account.name}</CardTitle>
                    <div className="flex items-center gap-2">
                        {accountIcons[account.type]}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive/70 hover:text-destructive hover:bg-destructive/10">
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete Account</span>
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the "{account.name}" account.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteAccount(account.id)}>
                                Continue
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow flex flex-col justify-end">
                    <div className="text-sm text-muted-foreground">
                        {account.type} Account
                        {account.type === 'Bank' && account.bankName && <span className="block">{account.bankName}</span>}
                    </div>
                    <div className="font-headline text-2xl font-bold flex items-center">
                      <IndianRupee className="h-6 w-6" />{account.balance.toLocaleString('en-IN')}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="h-48 flex flex-col items-center justify-center text-center text-muted-foreground">
                <p>No accounts added yet.</p>
                <p className="text-sm">Click "Add Account" to get started.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <AddAccountDialog
        isOpen={isAddAccountOpen}
        setIsOpen={setIsAddAccountOpen}
        onAddAccount={handleAddAccount}
      />
    </>
  );
}
