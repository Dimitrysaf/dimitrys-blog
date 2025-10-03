'use client'

import * as React from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <h1 className="p-2 text-lg font-bold transition-opacity duration-300 group-data-[collapsible=icon]:opacity-0">
          Ταμπλό
        </h1>
      </SidebarHeader>
      <SidebarContent>
        {/* The main navigation items will go here */}
      </SidebarContent>
      <SidebarFooter>
        {/* The footer content like user profile can go here */}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
