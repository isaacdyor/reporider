import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import { SidebarTrigger } from "./ui/sidebar";

interface DashboardContentLayoutProps {
  children: React.ReactNode;
  routes?: {
    label: string;
    href: string;
  }[];
  rightComponent?: React.ReactNode;
}

export function DashboardContentLayout({
  children,
  routes,
  rightComponent,
}: DashboardContentLayoutProps) {
  return (
    <div className="flex flex-col">
      <header className="sticky top-0 z-20 flex h-12 shrink-0 items-center justify-between gap-2 bg-background pl-2 pr-4 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-3">
          <SidebarTrigger className="bg-background" />
          <Breadcrumb>
            <BreadcrumbList>
              {routes?.slice(0, -1).map((route, index) => (
                <React.Fragment key={index}>
                  <BreadcrumbItem key={index}>
                    <BreadcrumbLink href={route.href}>
                      {route.label}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                </React.Fragment>
              ))}
              {routes && routes.length > 0 && (
                <BreadcrumbItem>
                  <BreadcrumbPage>
                    {routes[routes.length - 1]?.label}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              )}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        {rightComponent}
      </header>
      <div className="p-4">{children}</div>
    </div>
  );
}
