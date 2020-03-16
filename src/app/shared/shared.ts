// shared

import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

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
     * Decodes JWT, to get the value of it.
     * @param jwt 
     */
    public static DecodeJwt() {
        if (PublicFunctions.getCookie('authorization') !== '') {
            return (JSON.parse(atob(PublicFunctions.getCookie('authorization').split('.')[1])));
        } else {
            return '';
        }
    }

    /**
     * Logouts from a team.
     */
    public static logout() {
        // Redirect to shraga to authenticate
        window.location.href = 'http://localhost:3000/auth/saml';
    }

    /**
     * Checks if user needs to be relogged.
     */
    public static checkLogin(): boolean {
        if (PublicFunctions.getCookie('authorization').length > 0) {
            return true;
        } else {
            this.logout();
            return false;
        }
    }

    /**
     * Handles the error.
     * @param error - The returned error
     */
    public static handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
        // A client-side or network error occurred. Handle it accordingly.
        console.error('An error occurred:', error.error.message);
        } else {
        // The backend returned an unsuccessful response code.
        // The response body may contain clues as to what went wrong,
        console.error(
            `Backend returned code ${error.status}, ` +
            `body was: ${error.error}`);
        }

        if (error.status && error.status === 401) {
            PublicFunctions.checkLogin();
        }

        // return an observable with a user-facing error message
        return throwError(
        'Something bad happened; please try again later.');
    };
}
