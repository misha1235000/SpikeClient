// equal.validator

import {AbstractControl} from '@angular/forms';

export class EqualValidator {

    static MatchPassword(AC: AbstractControl) {
        if (AC.get('password') && AC.get('passwordConfirm')) {
            const password = AC.get('password').value; // to get value in input tag
            const confirmPassword = AC.get('passwordConfirm').value; // to get value in input tag

            if (password !== confirmPassword && confirmPassword !== '') {
                AC.get('passwordConfirm').setErrors( {MatchPassword: true} );
            } else {
                return null;
            }
        } else {
            return null;
        }
    }
}
