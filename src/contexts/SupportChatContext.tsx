import { createContext, useContext, useState, ReactNode } from "react";

interface SupportChatContextType {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  openChat: () => void;
  closeChat: () => void;
}

const SupportChatContext = createContext<SupportChatContextType | undefined>(undefined);

export const SupportChatProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const openChat = () => setIsOpen(true);
  const closeChat = () => setIsOpen(false);

  return (
    <SupportChatContext.Provider value={{ isOpen, setIsOpen, openChat, closeChat }}>
      {children}
    </SupportChatContext.Provider>
  );
};

export const useSupportChat = () => {
  const context = useContext(SupportChatContext);
  if (context === undefined) {
    throw new Error("useSupportChat must be used within a SupportChatProvider");
  }
  return context;
};
