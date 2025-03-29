import React from "react";
import {Dashboard} from "~/dashboard/dashboard";
import type {Route} from "./+types/dashboard";

export async function clientLoader({params}: Route.ClientLoaderArgs) {
    const res = await fetch(`http://localhost:8080/api/v1/list/`);
    const data = await res.json();
    return data;
}

// HydrateFallback is rendered while the client loader is running
export function HydrateFallback() {
    return <div>Loading...</div>;
}

export default function DB({loaderData}: Route.ComponentProps) {
    return <Dashboard loaderData={loaderData} />;
}