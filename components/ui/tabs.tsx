"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const Tabs = TabsPrimitive.Root;

type TabsVariant = NonNullable<VariantProps<typeof tabsListVariants>["variant"]>;

const TabsVariantContext = React.createContext<TabsVariant>("default");

const tabsListVariants = cva("inline-flex items-center", {
  variants: {
    variant: {
      default:
        "h-10 justify-center rounded-lg bg-[#eef2f6] p-1 text-[rgba(8,8,12,0.55)]",
      line: "h-auto w-full justify-start gap-8 rounded-none border-b border-[rgba(8,8,12,0.1)] bg-transparent p-0",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> &
    VariantProps<typeof tabsListVariants>
>(({ className, variant, ...props }, ref) => {
  const resolvedVariant = variant ?? "default";

  return (
  <TabsVariantContext.Provider value={resolvedVariant}>
    <TabsPrimitive.List
      ref={ref}
      className={cn(tabsListVariants({ variant: resolvedVariant }), className)}
      {...props}
    />
  </TabsVariantContext.Provider>
  );
});
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => {
  const variant = React.useContext(TabsVariantContext);

  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#972dc8]/40 focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        variant === "default" &&
          "rounded-md px-3 py-1.5 text-[rgba(8,8,12,0.55)] hover:text-[#08080c] data-[state=active]:bg-white data-[state=active]:text-[#08080c] data-[state=active]:shadow-sm",
        variant === "line" &&
          "rounded-none border-0 border-b-0 bg-transparent px-0 pb-3 pt-1 text-[rgba(8,8,12,0.55)] shadow-none ring-offset-0 hover:bg-transparent hover:text-[#08080c] data-[state=active]:border-b-2 data-[state=active]:border-[#972dc8] data-[state=active]:font-semibold data-[state=active]:text-[#972dc8]",
        className,
      )}
      {...props}
    />
  );
});
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#972dc8]/40",
      className,
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
