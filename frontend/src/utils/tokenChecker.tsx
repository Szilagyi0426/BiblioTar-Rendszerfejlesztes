export function isTokenExpired(token: string): boolean {
    try {
        const payloadBase64 = token.split('.')[1];
        const decodedPayload = JSON.parse(atob(payloadBase64));
        const exp = decodedPayload.exp;
        if (!exp) return true;
        const now = Math.floor(Date.now() / 1000);
        return now >= exp;
    } catch (err) {
        return true;
    }
}
