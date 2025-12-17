import "next-auth"
import { DefaultSession } from "next-auth"

declare module "next-auth" {
    interface User {
        id: string
        strapiToken?: string
    }

    interface Session {
        user: {
            id: string
            email: string
            name: string
        } & DefaultSession["user"]
        strapiToken?: string
        strapiUser?: {
            id: number
            username: string
            email: string
            displayName: string
            avatar?: {
                url: string
            } | null
            courses: Array<{
                id: number
                title: string
                slug: string
                coverImage?: {
                    url: string
                }
            }>
        }
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        strapiToken?: string
        userId?: string
        strapiUser?: {
            id: number
            username: string
            email: string
            displayName: string
            avatar?: {
                url: string
            } | null
            courses: Array<{
                id: number
                title: string
                slug: string
                coverImage?: {
                    url: string
                }
            }>
        }
    }
}
