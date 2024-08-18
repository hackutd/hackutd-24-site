import React from 'react';
import { Field, ErrorMessage, FieldProps } from 'formik';
import { MenuItem, TextField } from '@mui/material';
import {
  CheckboxQuestion,
  datalistQuestion,
  DropdownQuestion,
  NumberInputQuestion,
  textAreaQuestion,
} from '@/hackportal.config';

interface QuestionProps {
  question: {
    name: string;
    required: boolean;
    id: string;
    initialValue: any;
    question: string;
  };
  type: string;
}
/**
 *Text input question Component
 *
 *
 */
function Question(props: QuestionProps) {
  if (props.type === 'text') {
    return (
      <div key={props.question.id} className="flex flex-col">
        <label htmlFor={props.question.name} className="mt-4 poppins-regular mb-1">
          {props.question.required ? '*' : ''}
          {props.question.question}
        </label>
        <Field name={props.question.name} type="text">
          {({ field }: FieldProps) => (
            <TextField
              required={props.question.required}
              id={props.question.id}
              variant="outlined"
              type="text"
              sx={{
                fieldset: { borderColor: '#79747E' },
              }}
              InputProps={{
                classes: {
                  notchedOutline: '!border-red',
                  input: 'focus:ring-offset-0 focus:ring-0 focus:ring-shadow-0',
                },
              }}
              className="poppins-regular mb-1"
              {...field}
            />
          )}
        </Field>
        <ErrorMessage
          name={props.question.name}
          render={(msg) => <div className="text-red-600 poppins-regular">{msg}</div>}
        />
      </div>
    );
  } else if (props.type === 'number') {
    return (
      <div className="flex flex-col" key={props.question.id}>
        <label htmlFor={props.question.name} className="mt-4 poppins-regular mb-1">
          {props.question.required ? '*' : ''}
          {props.question.question}
        </label>
        <Field name={props.question.name}>
          {({ field }: FieldProps) => (
            <TextField
              required={props.question.required}
              id={props.question.id}
              variant="outlined"
              type={props.type}
              sx={{
                fieldset: { borderColor: '#79747E' },
              }}
              InputProps={{
                inputProps: {
                  min: (props.question as NumberInputQuestion).min,
                  max: (props.question as NumberInputQuestion).max,
                  pattern: (props.question as NumberInputQuestion).pattern,
                },
                classes: {
                  notchedOutline: '!border-red',
                  input: 'focus:ring-offset-0 focus:ring-0 focus:ring-shadow-0',
                },
              }}
              className="poppins-regular mb-1"
              {...field}
            />
          )}
        </Field>
        <ErrorMessage
          name={props.question.name}
          render={(msg) => <div className="text-red-600 poppins-regular">{msg}</div>}
        />
      </div>
    );
  } else if (props.type === 'dropdown') {
    return (
      <div className="flex flex-col" key={props.question.id}>
        <label htmlFor={props.question.name} className="mt-4 poppins-regular mb-1">
          {props.question.required ? '*' : ''}
          {props.question.question}
        </label>
        <Field as="select" name={props.question.name}>
          {({ field }: FieldProps) => (
            <TextField
              select
              variant="outlined"
              id={props.question.id}
              required={props.question.required}
              defaultValue={props.question.initialValue}
              className="poppins-regular mb-1"
              {...field}
            >
              <MenuItem selected disabled value="" />
              {(props.question as DropdownQuestion).options.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.title}
                </MenuItem>
              ))}
            </TextField>
          )}
        </Field>
        <ErrorMessage
          name={props.question.name}
          render={(msg) => <div className="text-red-600 poppins-regular">{msg}</div>}
        />
      </div>
    );
  } else if (props.type === 'checkbox') {
    return (
      <div className="flex flex-col" key={props.question.id}>
        <label htmlFor={props.question.name} className="mt-4 poppins-regular mb-1">
          {props.question.required ? '*' : ''}
          {props.question.question}
        </label>
        <div role="group" aria-labelledby="checkbox-group" className="flex flex-col">
          {(props.question as CheckboxQuestion).options.map((option) => (
            <label
              key={option.value}
              className={`text-[#313131] text-sm ml-2 ${
                props.question.id === 'codeOfConduct' ? 'poppins-semibold' : 'poppins-regular'
              }`}
            >
              <Field
                type="checkbox"
                name={props.question.name}
                value={option.value}
                className="rounded border-[#313131] border-2 cursor-pointer"
              />
              &nbsp;{option.title}
              {option.link && option.linkText && (
                <a href={option.link} className="text-[#40B7BA] hover:underline">
                  {option.linkText}
                </a>
              )}
            </label>
          ))}
        </div>
        <ErrorMessage
          name={props.question.name}
          render={(msg) => <div className="text-red-600 poppins-regular">{msg}</div>}
        />
      </div>
    );
  } else if (props.type === 'datalist') {
    return (
      <div className="flex flex-col" key={props.question.id}>
        <label htmlFor={props.question.name} className="mt-4 mb-1 poppins-regular">
          {props.question.required ? '*' : ''}
          {props.question.question}
        </label>
        <Field
          type="text"
          id={props.question.id}
          name={props.question.name}
          list={(props.question as datalistQuestion).datalist}
          className="border border-complementary/20 rounded-md md:p-2 p-1 poppins-regular"
          autoComplete="off"
        ></Field>
        <datalist id={(props.question as datalistQuestion).datalist}>
          <option value="" disabled selected></option>
          {(props.question as datalistQuestion).options.map((option) => (
            <option key={option.value} value={option.value} className="poppins-regular">
              {option.title}
            </option>
          ))}
        </datalist>
        <ErrorMessage
          name={props.question.name}
          render={(msg) => <div className="text-red-600 poppins-regular">{msg}</div>}
        />
      </div>
    );
  } else if (props.type === 'textArea') {
    return (
      <div className="flex flex-col" key={props.question.id}>
        <label htmlFor={props.question.name} className="mt-4 poppins-regular mb-1">
          {props.question.required ? '*' : ''}
          {props.question.question}
        </label>
        <Field
          as="textarea"
          name={props.question.name}
          placeholder={(props.question as textAreaQuestion).placeholder}
          className="border border-complementary/20 rounded-md md:p-2 p-1 poppins-regular"
        ></Field>
        <ErrorMessage
          name={props.question.name}
          render={(msg) => <div className="text-red-600 poppins-regular">{msg}</div>}
        />
      </div>
    );
  }
}

export default Question;
