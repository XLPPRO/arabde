import { SidebarTrigger } from "@/components/ui/sidebar";
import { LogoIcon } from "@/components/icons";
import { ApiKeyButton } from "../api-key-button";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-10 w-full bg-background/80 backdrop-blur-sm border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="h-8 w-8 hover:bg-accent/50 hover:border rounded-md md:hidden" />
          <div className="flex items-center gap-2">
            <LogoIcon className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-headline font-bold text-foreground">ArabDe Translate</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
            <ApiKeyButton />
        </div>
      </div>
    </header>
  );
}
