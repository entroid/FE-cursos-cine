import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

export const authOptions: NextAuthOptions = {
    providers: [
        // Google OAuth Provider
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),

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
                    // Login to Strapi
                    const response = await fetch(`${STRAPI_URL}/api/auth/local`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            identifier: credentials.email,
                            password: credentials.password,
                        }),
                    });

                    if (!response.ok) {
                        return null;
                    }

                    const data = await response.json();

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
                    const checkResponse = await fetch(
                        `${STRAPI_URL}/api/users?filters[email][$eq]=${user.email}`,
                        {
                            headers: {
                                Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
                            },
                        }
                    );
                    const existingUsers = await checkResponse.json();

                    // If user doesn't exist, create them
                    if (existingUsers.length === 0) {
                        await fetch(`${STRAPI_URL}/api/users`, {
                            method: "POST",
                            headers: {
                                Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                username: user.email?.split("@")[0],
                                email: user.email,
                                displayName: user.name || "Alumno",
                                password: crypto.randomUUID(), // Random password (not used)
                                confirmed: true,
                                blocked: false,
                            }),
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

            // Refresh Strapi user data using API Token (server-side)
            if (token.email) {
                try {
                    const response = await fetch(`${STRAPI_URL}/api/users/me`, {
                        method: 'POST',
                        headers: {
                            Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ email: token.email }),
                    });

                    if (response.ok) {
                        const strapiUser = await response.json();
                        token.strapiUser = strapiUser;
                    }
                } catch (error) {
                    console.error("Error fetching Strapi user:", error);
                }
            }
            return token;
        },
        async session({ session, token }) {
            session.user.id = token.userId as string;
            session.strapiToken = token.strapiToken as string;
            session.strapiUser = token.strapiUser as any;

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
