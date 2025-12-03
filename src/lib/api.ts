const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

export async function fetchAPI(path: string, options = {}) {
    try {
        const mergedOptions = {
            headers: {
                "Content-Type": "application/json",
            },
            ...options,
        };

        const requestUrl = `${STRAPI_URL}/api${path}`;
        const response = await fetch(requestUrl, mergedOptions);

        if (!response.ok) {
            console.error(response.statusText);
            throw new Error(`An error occured please try again`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        throw new Error(`An error occured please try again`);
    }
}
