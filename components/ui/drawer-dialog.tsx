"use client";

import * as React from "react";

import {
  Dialog,
  // DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface DrawerDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

interface DrawerDialogTriggerProps {
  children?: React.ReactNode;
  render?: React.ReactElement;
  className?: string;
}

interface DrawerDialogContentProps {
  children: React.ReactNode;
  className?: string;
}

interface DrawerDialogHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface DrawerDialogTitleProps {
  children: React.ReactNode;
  className?: string;
}

interface DrawerDialogDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

// interface DrawerDialogBodyProps {
//   children: React.ReactNode;
//   className?: string;
// }

interface DrawerDialogFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function DrawerDialogTrigger({
  children,
  render,
  ...props
}: DrawerDialogTriggerProps) {
  const isMobile = useIsMobile();
  if (isMobile) {
    return (
      <DrawerTrigger asChild={!!render} {...props}>
        {render ?? children}
      </DrawerTrigger>
    );
  }

  return (
    <DialogTrigger render={render} {...props}>
      {children}
    </DialogTrigger>
  );
}

export function DrawerDialogContent({
  children,
  className,
  ...props
}: DrawerDialogContentProps) {
  const isMobile = useIsMobile();
  if (isMobile) {
    return (
      <DrawerContent className={cn("px-4", className)} {...props}>
        {children}
      </DrawerContent>
    );
  }

  return (
    <DialogContent className={className} {...props}>
      {children}
    </DialogContent>
  );
}

export function DrawerDialogHeader({
  children,
  ...props
}: DrawerDialogHeaderProps) {
  const isMobile = useIsMobile();
  if (isMobile) {
    return <DrawerHeader {...props}>{children}</DrawerHeader>;
  }
  return <DialogHeader {...props}>{children}</DialogHeader>;
}

export function DrawerDialogTitle({
  children,
  ...props
}: DrawerDialogTitleProps) {
  const isMobile = useIsMobile();
  if (isMobile) {
    return <DrawerTitle {...props}>{children}</DrawerTitle>;
  }
  return <DialogTitle {...props}>{children}</DialogTitle>;
}

export function DrawerDialogDescription({
  children,
  ...props
}: DrawerDialogDescriptionProps) {
  const isMobile = useIsMobile();
  if (isMobile) {
    return <DrawerDescription {...props}>{children}</DrawerDescription>;
  }
  return <DialogDescription {...props}>{children}</DialogDescription>;
}

// export function DrawerDialogBody({
//   children,
//   ...props
// }: DrawerDialogBodyProps) {
//   const isMobile = useIsMobile();
//   if (isMobile) {
//     return <DrawerBody {...props}>{children}</DrawerBody>;
//   }
//   return <DialogBody {...props}>{children}</DialogBody>;
// }

export function DrawerDialogFooter({
  children,
  ...props
}: DrawerDialogFooterProps) {
  const isMobile = useIsMobile();
  if (isMobile) {
    return <DrawerFooter {...props}>{children}</DrawerFooter>;
  }
  return <DialogFooter {...props}>{children}</DialogFooter>;
}

export function DrawerDialog({ children, ...props }: DrawerDialogProps) {
  const isMobile = useIsMobile();

  if (!isMobile) {
    return <Dialog {...props}>{children}</Dialog>;
  }

  return <Drawer {...props}>{children}</Drawer>;
}
