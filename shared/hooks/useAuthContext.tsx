'use client'

import { createContext, useContext, ReactNode } from "react"

interface AuthContextType {
    userId: string | null;
    isAdmin: boolean | null;
}

const AuthContext = createContext<AuthContextType>({ userId: null, isAdmin: null });

// Provider Component
export const AuthProvider = ({
    children,
    userId,
    isAdmin
}: {
    children: ReactNode;
    userId: string | null;
    isAdmin: boolean | null;
}) => {
    return (
        <AuthContext.Provider value={{ userId, isAdmin }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuthContext = () => useContext(AuthContext);