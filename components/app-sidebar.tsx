"use client";

import * as React from "react";
import Image from "next/image";
import { Users } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavMain } from "./ui/nav-main";
import { NavUser } from "./ui/nav-user";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },

  navMain: [
    {
      title: "Gestion",
      url: "/",
      isActive: true,
    },
    {
      title: "Clientes",
      url: "/dashboard/clients",
      icon: Users,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="px-4">
        <Image
          src="/mm.png"
          alt="Logo"
          width={140}
          height={40}
          quality={70}
          priority
          style={{ objectFit: "contain", maxWidth: "100%" }}
          className="w-full"
        />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
