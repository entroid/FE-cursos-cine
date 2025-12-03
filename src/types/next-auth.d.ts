import "next-auth"
import { DefaultSession } from "next-auth"

declare module "next-auth" {
    interface User {
        id: string
        strapiToken?: string
        role?: string
    }

    interface Session {
        strapiToken?: string
        strapiUser?: any
        user: {
            id: string
            role?: string
        } & DefaultSession["user"]
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        userId?: string
        strapiToken?: string
        strapiUser?: any
        role?: string
    }
}
