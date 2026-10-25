import { createContext, useContext, useState, type ReactNode } from "react";
import { ContactModal } from "./ContactModal";

const Ctx = createContext<{ open: () => void }>({ open: () => {} });

export function ContactProvider({ children }: { children: ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  return (
    <Ctx.Provider value={{ open: () => setOpen(true) }}>
      {children}
      <ContactModal open={isOpen} onOpenChange={setOpen} />
    </Ctx.Provider>
  );
}

export const useContact = () => useContext(Ctx);
