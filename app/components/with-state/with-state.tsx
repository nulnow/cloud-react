import React, { useState } from "react";

type Props<T> = {
    initialState: T;
    children: ({
                   state,
                   setState,
               }: {
        state: T;
        setState: React.Dispatch<React.SetStateAction<T>>;
    }) => React.ReactNode | void;
};

export const WithState = <T,>({ initialState, children }: Props<T>) => {
    const [state, setState] = useState(initialState);

    return children({ state, setState }) ?? null;
};