import React from "react";
import {twMerge} from "tailwind-merge";


export function Input({className, ...rest}: React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input className={twMerge("px-2 py-1 text-md rounded-xl border-2 text-black", className)} {...rest} />
    );
}