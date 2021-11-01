/* Creating reusable date picker */

import { useField } from 'formik';
import React from 'react';
import { Form, Label } from 'semantic-ui-react';
import DatePicker, { ReactDatePickerProps } from 'react-datepicker';

//Partial in Partial<ReactDatePickerProps>: make every property in ReactDatePickerProps optional
export default function MyDatePicker(props: Partial<ReactDatePickerProps>) {
    const [field, meta,helpers] = useField(props.name!);

    return (
        <Form.Field error={meta.touched && !!meta.error}>
            <DatePicker
                // spread fiedls and props
                {...field}
                {...props}
                selected={(field.value && new Date(field.value)) || null}
                onChange={value=>helpers.setValue(value)}
            />
            {meta.touched && meta.error ? (
                <Label basic color='red'>{meta.error}</Label>
            ) : null}
        </Form.Field>
    )
}