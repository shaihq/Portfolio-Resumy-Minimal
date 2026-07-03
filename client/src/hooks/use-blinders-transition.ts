import { createContext, useContext } from "react";

export interface BlindersCtx {
  transitionTo: (path: string) => void;
}

export const BlindersContext = createContext<BlindersCtx>({
  transitionTo: () => {},
});

export function useBlindersTransition() {
  return useContext(BlindersContext);
}
