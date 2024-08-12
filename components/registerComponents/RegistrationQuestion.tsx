import React, { Fragment } from 'react';
import { Field, ErrorMessage } from 'formik';
import { MenuItem, TextField } from '@mui/material';

/**
 *Text input question Component
 *
 *
 */
function Question(props) {
  if (props.type === 'text') {
    return (
      <Fragment>
        <TextField
          required={props.question.required}
          label={props.question.question}
          id={props.question.id}
          name={props.question.name}
          variant="outlined"
          type="text"
          onChange={props.onChange}
          sx={{
            fieldset: { borderColor: '#79747E' },
          }}
          InputProps={{
            classes: {
              notchedOutline: '!border-red',
              input: 'focus:ring-offset-0 focus:ring-0 focus:ring-shadow-0',
            },
          }}
          className="!mt-4 poppins-regular mb-1"
        />
        <ErrorMessage
          name={props.question.name}
          render={(msg) => <div className="text-red-600 poppins-regular">{msg}</div>}
        />
      </Fragment>
    );
  } else if (props.type === 'number') {
    return (
      <Fragment key={props.question.id}>
        <TextField
          required={props.question.required}
          label={props.question.question}
          id={props.question.id}
          name={props.question.name}
          variant="outlined"
          type="number"
          sx={{
            fieldset: { borderColor: '#79747E' },
          }}
          onChange={props.onChange}
          InputProps={{
            inputProps: {
              min: props.question.min,
              max: props.question.max,
              pattern: props.question.pattern,
            },
            classes: {
              notchedOutline: '!border-red',
              input: 'focus:ring-offset-0 focus:ring-0 focus:ring-shadow-0',
            },
          }}
          className="!mt-4 poppins-regular mb-1"
        />
        <ErrorMessage
          name={props.question.name}
          render={(msg) => <div className="text-red-600 poppins-regular">{msg}</div>}
        />
      </Fragment>
    );
  } else if (props.type === 'dropdown') {
    return (
      <Fragment>
        <TextField
          select
          id={props.question.id}
          required={props.question.required}
          label={props.question.question}
          name={props.question.name}
          className="!mt-4 poppins-regular mb-1"
        >
          <MenuItem selected disabled value="" />
          {props.question.options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.title}
            </MenuItem>
          ))}
        </TextField>
        <ErrorMessage
          name={props.question.name}
          render={(msg) => <div className="text-red-600 poppins-regular">{msg}</div>}
        />
      </Fragment>
    );
  } else if (props.type === 'checkbox') {
    return (
      <Fragment>
        <label htmlFor={props.question.name} className="mt-4 poppins-regular mb-1">
          {props.question.required ? '*' : ''}
          {props.question.question}
        </label>
        <div role="group" aria-labelledby="checkbox-group" className="flex flex-col">
          {props.question.options.map((option) => (
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
              <a href={option.link} className="text-[#40B7BA] hover:underline">
                {option.linkText}
              </a>
            </label>
          ))}
        </div>
        <ErrorMessage
          name={props.question.name}
          render={(msg) => <div className="text-red-600 poppins-regular">{msg}</div>}
        />
      </Fragment>
    );
  } else if (props.type === 'datalist') {
    return (
      <Fragment>
        <label htmlFor={props.question.name} className="mt-4 mb-1 poppins-regular">
          {props.question.required ? '*' : ''}
          {props.question.question}
        </label>
        <Field
          type="text"
          id={props.question.id}
          name={props.question.name}
          list={props.question.datalist}
          className="border border-complementary/20 rounded-md md:p-2 p-1 poppins-regular"
          autoComplete="off"
        ></Field>
        <datalist id={props.question.datalist}>
          <option value="" disabled selected></option>
          {props.question.options.map((option) => (
            <option key={option.value} value={option.value} className="poppins-regular">
              {option.title}
            </option>
          ))}
        </datalist>
        <ErrorMessage
          name={props.question.name}
          render={(msg) => <div className="text-red-600 poppins-regular">{msg}</div>}
        />
      </Fragment>
    );
  } else if (props.type === 'textArea') {
    return (
      <Fragment>
        <label htmlFor={props.question.name} className="mt-4 poppins-regular mb-1">
          {props.question.required ? '*' : ''}
          {props.question.question}
        </label>
        <Field
          as="textarea"
          name={props.question.name}
          placeholder={props.question.placeholder}
          className="border border-complementary/20 rounded-md md:p-2 p-1 poppins-regular"
        ></Field>
        <ErrorMessage
          name={props.question.name}
          render={(msg) => <div className="text-red-600 poppins-regular">{msg}</div>}
        />
      </Fragment>
    );
  }
}

export default Question;
