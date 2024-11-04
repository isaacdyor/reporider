"use client";

import {
  SidebarHeader as Header,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { FolderGit2, Plus } from "lucide-react";
import Link from "next/link";

export function SidebarHeader() {
  return (
    <Header>
      <SidebarMenu className="flex flex-col gap-4">
        <SidebarMenuItem>
          <SidebarMenuButton size="lg">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <FolderGit2 className="size-4" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">RepoRider</span>
              <span className="truncate text-xs">Free</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <Link href="/repos">
            <SidebarMenuButton variant="default" tooltip="Create Article">
              <Plus className="size-4" />
              <span>Create Article</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      </SidebarMenu>
    </Header>
  );
}
