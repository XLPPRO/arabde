"use client";

import { useApiKey } from "@/context/api-key-context";
import { Button } from "@/components/ui/button";
import { KeyRound } from "lucide-react";

export function ApiKeyButton() {
    const { setIsModalOpen } = useApiKey();

    return (
        <Button variant="ghost" size="icon" onClick={() => setIsModalOpen(true)}>
            <KeyRound className="h-5 w-5" />
            <span className="sr-only">Set API Key</span>
        </Button>
    );
}
