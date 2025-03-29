import React from "react";
import { twMerge } from 'tailwind-merge'

export function Button({className, ...rest}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button className={twMerge("px-4 py-2 text-md rounded-xl border-0 text-black bg-gray-300 hover:bg-gray-400 active:bg-gray-500", className)} {...rest} />
    )
}