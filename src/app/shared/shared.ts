// shared

export class PublicFunctions {
    /**
     * Gets a cookie value by name.
     * @param name - Cookie name.
     */
    public static getCookie(name: string) {
    const ca: Array < string > = document.cookie.split(';');
    const caLen: number = ca.length;
    const cookieName = `${name}=`;
    let c: string;

    for (let i = 0; i < caLen; i += 1) {
        c = ca[i].replace(/^\s+/g, '');
        if (c.indexOf(cookieName) === 0) {
        return c.substring(cookieName.length, c.length);
        }
    }

    return '';
    }

    /**
     * Logouts from a team.
     */
    public static logout() {
        document.cookie = 'token=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        window.location.href = '/login';
    }
}
