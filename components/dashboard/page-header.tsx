import { ForwardRefExoticComponent, ReactNode, RefAttributes } from "react";
import { IconProps } from "@tabler/icons-react";

export function PageHeader({
  title,
  Icon,
  children,
}: {
  title: string;
  Icon: ForwardRefExoticComponent<IconProps & RefAttributes<SVGSVGElement>>;
  children?: ReactNode;
}) {
  return (
    <header className="bg-background sticky top-0 h-12 flex items-center justify-between px-2 border-b">
      <div className="flex items-center justify-center gap-1">
        <Icon className="size-4" />
        <p className="text-sm">{title}</p>
      </div>

      {children}
    </header>
  );
}
