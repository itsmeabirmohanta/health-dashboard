"use client";

import { Sidebar as UISidebar } from "./ui/Sidebar";
import { ComponentProps } from "react";

type SidebarProps = ComponentProps<typeof UISidebar>;

export function Sidebar(props: SidebarProps) {
  return <UISidebar {...props} />;
} 