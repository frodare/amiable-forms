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

## `useField`

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

## `useForm`

# Helper Utilties

### `useArrayField`

### `useRepeated`

### `Debug`

