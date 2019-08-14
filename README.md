amiable-forms
=========

A library for creating forms in React using hooks. This project requires no dependencies other than React as a peer dependency and is written from the ground up with hooks in mind. It is easy to integrate into any form UI. To achieve this, no rendererable form or field component are provided or required. Instead hooks are used transform any components needed into forms. If desired, this allows forms to be created even without the use of standard browser form elements.

- built using React Hooks
- independent field handling
- highly compatible, easy to integrate
- efficient, fields only render when needed

# Installation

React Redux requires **React 16.8.3 or later.**

```
npm install --save amiable-forms
```

# Getting Started

```jsx
import React from 'react'
import ReactDOM from 'react-dom'
import { Form, useField, useForm } from 'amiable-forms'

const Input = props => {
  const { value, onChange } = useField({ name: props.name })
  return <input {...props} value={value} onChange={onChange} />
}

const SubmitButton = () => {
  const { onSubmit } = useForm()
  return <button onClick={onSubmit}>Login</button>
}

const process = values => console.log('Submit', values)

const LoginForm = () => (
  <Form process={process}>
    <Input name="username" placeholder="username" />
    <Input name="password" placeholder="password" type="password" />
    <SubmitButton />
  </Form>
)

const rootElement = document.getElementById('root')
ReactDOM.render(<LoginForm />, rootElement)
```


# Documentation

## Form

The `Form` component is used to provide a React context and is not a visual component. This shouldn't be confused with any visual UI Form components that might be required for your specific form setup. The `Form` component must be wrapped around the entire form for any of the `amiable-forms` hooks and helper components to function. This allows form state to be shared without needing explicit prop passing.

```jsx
<Form
  process={() => {}}
  processInvalid={() => {}}
  validate={() => {}}
  transform={() => {}}
  initialValues={{}}>
  ...
</Form>
```

| Prop Name | Type | Description | |
|-----------|------|-------------|-|
| process | `function(values, ...args)` | function called when a valid form is submitted | required
| processInvalid | `function(values, formMeta, fields)` | function called when an invalid form is submitted |
| validate | `function(values)` | return error string |
| transform | `function({ current, next })` |return transformed state |
| initialValues | `plain object` | the initial values to set to the form |

## useField

The `useField` hook is used to define a field component. `amiable-form` doesn't provide a Field component and instead provides this hook. This is a design choice to increase compatibility to various form layouts making its integration a more _amiable_ task.

The `useField` hook will only cause renders when the value for that field changes.

```jsx
const YourField = () => {
  const { value, onChange } = useField({ name: 'field1' })
  return <input value={value} onChange={onChange} />
}
```

| Input Key Name | Type | Description | |
|-----------|------|-------------|-|
| name | `string` | The name of the field and key in the values object. The name can use a path following the same convention as lodash's set and get functions. | required
| validators | `[function(), ...]` | An array of validation function |
| parse | `function()` | |
| format | `function()` | |

The `useField` hook returns many variables to accommodate a variety of situations.

| Return Name | Type | Description | |
|-------------|------|-------------|-|
| value | `any` | the current value of the field |
| submitted | `boolean` | if the form has attempted to be submitted |
| setValue | `function()` | sets the value of the field |
| setVisited | `function()` | marks the field as visited |
| onChange | `function(ev)` | helper handler, calls `setValue` |
| onBlur | `function(ev)` | helper handler, calls `setVisited(true)` |
| error | `string` | contains error messages from the validator functions |
| valid | `boolean` | signals the field is valid or invalid |
| touched | `boolean` | signals if the field's value has ever changed |
| visited | `boolean` | signals if a user as _clicked through_ a field |
| dirty | `boolean` | signals if the value of the field differs from the initial state |

### Field Validators

Field level validation is accomplished by providing an array of validation functions to the `useField` hook under the `validators` input key. The current field value is passed to each validation function when invoked and the validator will either return `undefined` for a pass condition or a string containing the error message. The error message from the first failing validator will be set to the `error` key return value of the `useField` hook.

**Validator Function Exmaples**
```js
const required = value => value ? undefined : 'required'

const numeric = value => (!value || /^\\d+$/i.test(value)) ? undefined : 'invalid'
```

### Field Parse and Format

The `parse` and `format` functions can be used when the value shown to the user in the form differs from the what needs to be saved in the data. For example, date fields might want to display a format of MM/DD/YYYY to the user but store the value as YYYY-MM-DD. The `parse` function is used to read the information in the field and convert it into the form data format. `format` is used to convert the form data value into a value to be shown to the user. The `parse` function can also be used as a way to normalize the user input.

**Validator Function Exmaples**
```js
const parse = value => (value && value.toUpperCase()) || undefined

const format = value => (value || '').toLowerCase()
```

## useForm

The `useForm` hook is the base `amiable-forms` hook and provides access to the entire state of the form. By default it will cause the component it is in to render on every change. To avoid unnessary renders, the `shouldUpdate` function needs to be passed into it has an argument.

```jsx
const never = () => false
const { setValues } = useForm({ shouldUpdate: never })
```

| Input Key Name | Type | Description |
|-----------|------|-------------|
| shouldUpdate | `function({ previous, current })` | is given the current and previous form state and returns `true` if the component should render or false if not


| Return Name | Type | Category | Description |
|-------------|------|--------|-----|
| setValue | `function()` | actions |
| setValues | `function()` | actions |
| setField | `function()` | actions |
| setMetaValue | `function()` | actions |
| removeField | `function()` | actions |
| reset | `function()` | actions |
| clear | `function()` | actions |
| values | `object` | state |
| fields | `object` | state |
| meta | `object` | state |
| cleanValues | `object` | state |
| submit | `function()` | submission |
| onSubmit | `function()` | submission |
| register | `function()` | registraion |
| deregister | `function()` | registraion |

### Field Meta
| Name | Type | Description |
|-------------|------|--------|
| error | `string` |
| valid | `boolean` |
| touched | `boolean` |
| visited | `boolean` |
| dirty | `boolean` |
| registered | `boolean` |

### Form Meta
| Name | Type | Description |
|-------------|------|--------|
| touched | `boolean` |
| submitted | `boolean` |
| visited | `boolean` |
| valid | `boolean` |
| dirty | `boolean` |
| error | `string` |




# Helper Utilties

## useArrayField

## useRepeated

## Debug

# Solutions to Common Problems

- conditional sections based on form state
- setting form state (or submitting) from external source


