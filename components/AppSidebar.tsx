'use client'

import * as React from 'react'
import { useSession } from 'next-auth/react'
import { Newspaper } from 'lucide-react'
import Link from 'next/link' // Using Next.js Link for client-side navigation

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
} from '@/components/ui/sidebar'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session, status } = useSession()

  const roleId = (session?.user as any)?.roleId
  const isAuthorized = status === 'authenticated' && roleId !== undefined && roleId >= 2

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <h1 className="p-2 text-lg font-bold transition-opacity duration-300 group-data-[collapsible=icon]:opacity-0">
          Ταμπλό
        </h1>
      </SidebarHeader>
      <SidebarContent>
        {isAuthorized && (
          <SidebarMenu>
            <SidebarMenuItem>
              {/* This is now a single item, not a group, and uses Link to prevent page reloads */}
              <SidebarMenuButton asChild>
                <Link href="/dashboard">
                  <Newspaper size={20} />
                  <span>Αναρτήσεις</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        )}
      </SidebarContent>
      <SidebarFooter>
        {/* The footer content like user profile can go here */}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
