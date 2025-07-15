
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart, Home, Landmark, Repeat, List, HandCoins, PiggyBank, User, ShieldCheck, Building2, Gem } from 'lucide-react';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar"

const navItems = [
  { href: '/', label: 'Dashboard', icon: Home },
  { href: '/reports', label: 'Reports', icon: BarChart },
  { href: '/accounts', label: 'Accounts', icon: Landmark },
  { href: '/fixed-costs', label: 'Fixed Costs', icon: Repeat },
  { href: '/all-transactions', label: 'All Transactions', icon: List },
  { href: '/loans', label: 'Loans', icon: HandCoins },
  { href: '/auto-credit', label: 'Auto Credit', icon: PiggyBank },
  { href: '/insurance', label: 'Insurance', icon: ShieldCheck },
  { href: '/real-estate', label: 'Real Estate', icon: Building2 },
  { href: '/gold', label: 'Gold', icon: Gem },
];

export function MainNav() {
  const pathname = usePathname();
  const { setOpenMobile, isMobile } = useSidebar();

  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  }

  return (
    <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <SidebarMenuButton
            asChild
            isActive={pathname === item.href}
            className="w-full justify-start"
            tooltip={item.label}
            onClick={handleLinkClick}
          >
            <Link href={item.href}>
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
