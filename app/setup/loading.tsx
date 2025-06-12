import Logo from "@/components/logo";
import { Separator } from "@/components/ui/separator";
import { Loader2Icon } from "lucide-react";

export default function loading() {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-full">
      <Logo iconSize={50} fontSize="text-3xl" />
      <Separator className="max-w-xs" />
      <div className="flex gap-2 items-center justify-center">
        <Loader2Icon size={16} className="animate-spin stroke-primary" />
        <p>Setting up your account</p>
      </div>
    </div>
  );
}
