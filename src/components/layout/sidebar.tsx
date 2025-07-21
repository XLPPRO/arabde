
"use client";

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { LogoIcon } from "@/components/icons";
import { BookOpen, Languages, Mail, Info, FileText, Shield, Lock, Gamepad2, Layers, Newspaper, MessageSquareQuote } from "lucide-react";
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader className="p-4 justify-between">
          <SidebarTrigger>
            <LogoIcon className="size-7 text-primary" />
          </SidebarTrigger>
           <div className="flex-1 overflow-hidden transition-opacity duration-300 group-data-[state=collapsed]:opacity-0 group-data-[state=expanded]:opacity-100 group-data-[state=expanded]:ml-2">
            <span className="font-bold text-lg whitespace-nowrap animate-in fade-in slide-in-from-left-2 duration-500">
              Willkommen
            </span>
          </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href="/">
              <SidebarMenuButton as="a" isActive={pathname === '/'} variant="ghost">
                <BookOpen />
                Dictionary
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/translate">
              <SidebarMenuButton as="a" isActive={pathname === '/translate'} variant="ghost">
                <Languages />
                Translate
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
           <SidebarMenuItem>
             <Link href="/articles">
              <SidebarMenuButton as="a" isActive={pathname === '/articles'} variant="ghost">
                <Newspaper />
                Articles
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
             <Link href="/flashcards">
              <SidebarMenuButton as="a" isActive={pathname === '/flashcards'} variant="ghost">
                <Layers />
                Flash Cards
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/game">
              <SidebarMenuButton as="a" isActive={pathname === '/game'} variant="ghost">
                <Gamepad2 />
                Game
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/conversation">
              <SidebarMenuButton as="a" isActive={pathname === '/conversation'} variant="ghost">
                <MessageSquareQuote />
                Conversation Practice
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/contact">
              <SidebarMenuButton as="a" isActive={pathname === '/contact'} variant="ghost">
                <Mail />
                Contact
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/about">
              <SidebarMenuButton as="a" isActive={pathname === '/about'} variant="ghost">
                <Info />
                About us
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
         <SidebarMenu>
            <SidebarMenuItem>
              <Link href="/imprint">
                <SidebarMenuButton as="a" isActive={pathname === '/imprint'} variant="ghost">
                  <FileText />
                  Imprint
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link href="/terms-of-use">
                <SidebarMenuButton as="a" isActive={pathname === '/terms-of-use'} variant="ghost">
                  <Shield />
                  Terms of use
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link href="/data-privacy">
                <SidebarMenuButton as="a" isActive={pathname === '/data-privacy'} variant="ghost">
                  <Lock />
                  Data privacy
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
