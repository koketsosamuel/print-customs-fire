import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function matchFieldValueValidator(fieldName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const matchingControl = control.root.get(fieldName);
      if (matchingControl && control.value !== matchingControl.value) {
        return { matchFieldValue: true };
      }
      return null;
    };
  }