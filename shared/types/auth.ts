export type AuthRequest = {
    email: string,
    password: string,
    firstName?: string,
    lastName?: string,
    username?: string,
}

export type AuthResponse = {
    id: string,
    username: string
}
