export const getShortURL = async (originalURL: string) => {
    const response = await fetch(process.env.SHORTNER_API_URL as string, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            url: originalURL,
        }),
    });

    if (!response.ok) {
        throw new Error('Failed to get short URL');
    }

    const { short_url } = await response.json();
    return short_url;
}