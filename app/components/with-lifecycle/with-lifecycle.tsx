import React from "react";

export function WithLifecycle({ children }: { children: () => void | React.ReactNode }) {
    return children() ?? null;
}
