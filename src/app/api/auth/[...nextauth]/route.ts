import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import {
    loginUser,
    getStrapiUser,
    getCurrentUser,
    findUserByEmail,
    createStrapiUser,
} from "@/lib/strapi";

export const authOptions: NextAuthOptions = {
    providers: [
        // Google OAuth Provider (conditional - only if credentials are configured)
        ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
            ? [
                GoogleProvider({
                    clientId: process.env.GOOGLE_CLIENT_ID,
                    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                }),
            ]
            : []),

        // Credentials Provider (Email/Password)
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }
                try {
                    // Login to Strapi using utility function
                    const data = await loginUser(
                        credentials.email,
                        credentials.password
                    );

                    return {
                        id: data.user.id.toString(),
                        email: data.user.email,
                        name: data.user.displayName || data.user.username,
                        strapiToken: data.jwt,
                    };
                } catch (error) {
                    console.error("Auth error:", error);
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            // For OAuth providers (Google, etc.)
            if (account?.provider === "google") {
                try {
                    // Check if user exists in Strapi
                    const userEmail = user.email ?? null;
                    if (!userEmail) {
                        return false;
                    }
                    const existingUsers = await findUserByEmail(userEmail);

                    // If user doesn't exist, create them
                    if (existingUsers.length === 0) {
                        const username = userEmail.split("@")[0];
                        await createStrapiUser({
                            username,
                            email: userEmail,
                            displayName: user.name || "Alumno",
                            password: crypto.randomUUID(), // Random password (not used)
                            confirmed: true,
                            blocked: false,
                        });
                    }
                    return true;
                } catch (error) {
                    console.error("Error creating user in Strapi:", error);
                    return false;
                }
            }
            return true;
        },
        async jwt({ token, user, account }) {
            // Initial sign in
            if (user) {
                token.strapiToken = user.strapiToken;
                token.userId = user.id;
            }

            // Refresh Strapi user data
            if (token.strapiToken) {
                try {
                    // Method 1: Use user's own token (Preferred if authenticated)
                    const currentUser = await getCurrentUser(token.strapiToken as string);
                    token.strapiUser = currentUser;
                } catch (error) {
                    console.error("Error fetching current user with JWT:", error);
                    // Fallback to API Token method if JWT fails (e.g. expired)
                    if (token.email && process.env.STRAPI_API_TOKEN) {
                        try {
                            const strapiUser = await getStrapiUser(token.email);
                            token.strapiUser = strapiUser;
                        } catch (adminError) {
                            console.error("Fallback admin fetch failed:", adminError);
                        }
                    }
                }
            } else if (token.email && process.env.STRAPI_API_TOKEN) {
                // Method 2: Use API Token (Server-side only, no user session yet)
                try {
                    const strapiUser = await getStrapiUser(token.email);
                    token.strapiUser = strapiUser;
                } catch (error) {
                    console.error("Error fetching Strapi user:", error);
                }
            }
            return token;
        },
        async session({ session, token }) {
            session.user.id = token.userId as string;
            session.strapiToken = token.strapiToken as string;
            session.strapiUser = token.strapiUser as {
                id: number;
                username: string;
                email: string;
                displayName: string;
                avatar?: { url: string } | null;
                courses: Array<{
                    id: number;
                    title: string;
                    slug: string;
                    coverImage?: { url: string };
                }>;
            } | undefined;

            return session;
        },
    },
    pages: {
        signIn: "/login",
        error: "/auth/error",
    },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
