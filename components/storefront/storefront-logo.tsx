import Image from "next/image";

interface StorefrontLogoProps {
  logoUrl?: string | null;
  name?: string | null;
}

export function StorefrontLogo({ logoUrl, name }: StorefrontLogoProps) {
  if (logoUrl) {
    return (
      <div className="flex items-center gap-2">
        <div className="size-8 overflow-hidden rounded-md border">
          <Image
            src={logoUrl}
            alt={name ?? "logo"}
            width={100}
            height={100}
            className="size-full object-cover"
          />
        </div>
        <span className="text-sm font-medium">{name}</span>
      </div>
    );
  }

  return <div className="text-3xl font-semibold text-center">{name}</div>;
}
