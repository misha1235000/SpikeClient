// shared

import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { config } from './config';

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
     * @param jwt - JWT
     */
    public static DecodeJwt() {
        const authorization = PublicFunctions.getCookie('authorization');
        if (authorization !== '') {
            return (
                JSON.parse(
                    decodeURIComponent(
                        Array.prototype.map.call(
                            atob(authorization.split('.')[1].replace('-', '+').replace('_', '/')),
                            c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
                        ).join('')
                    )
                )
            );
        } else {
            return '';
        }
    }

    /**
     * Logouts from a team.
     */
    public static logout() {
        // Redirect to shraga to authenticate
        window.location.href = `https://localhost:4200/auth`;
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
            console.log(error.error.message);

            if (error.status && error.status === 401) {
                PublicFunctions.checkLogin();
            }

            throw { ...error.error };

            // return an observable with a user-facing error message
            return throwError(
            'Something bad happened; please try again later.');
        }
    }
}
