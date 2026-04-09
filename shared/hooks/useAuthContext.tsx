'use client'

import { createContext, useContext, ReactNode } from "react"

interface AuthContext {
    userId: string | null;
}

const AuthContext = createContext<AuthContext>({ userId: null });

// Provider Component
export const AuthProvider = ({
    children,
    userId
}: {
    children: ReactNode;
    userId: string | null;
}) => {
    return (
        <AuthContext.Provider value={{ userId }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuthContext = () => useContext(AuthContext);