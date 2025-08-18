import { useState } from "react";

export function useTimedError(duration = 3000) {
    const [error, setError] = useState<string | null>(null);

    function showError(msg: string): void {
        setError(msg);
        setTimeout(() => setError(null), duration);
    };

    return [error, showError];
}
