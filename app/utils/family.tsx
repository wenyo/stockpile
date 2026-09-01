import { User, Smile, Baby, PawPrint } from "lucide-react";

export const getIdentityIcon = (identity: string, size: number = 14, className?: string) => {
  switch (identity) {
    case "adult": return <User size={size} className={className || "text-primary/70"} />;
    case "elderly": return <User size={size} className={className || "text-muted-foreground"} />;
    case "child": return <Smile size={size} className={className || "text-info/80"} />;
    case "infant": return <Baby size={size} className={className || "text-warning/80"} />;
    case "pet": return <PawPrint size={size} className={className || "text-danger/70"} />;
    default: return <User size={size} className={className} />;
  }
};
