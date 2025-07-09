"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart, Home, Landmark } from 'lucide-react';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"

const navItems = [
  { href: '/', label: 'Dashboard', icon: Home },
  { href: '/reports', label: 'Reports', icon: BarChart },
  { href: '/accounts', label: 'Accounts', icon: Landmark },
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <Link href={item.href}>
            <SidebarMenuButton
              isActive={pathname === item.href}
              className="w-full justify-start"
              tooltip={item.label}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
