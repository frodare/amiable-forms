amiable-forms
=========

A library for creating forms in React using hooks. This project requires no dependencies other than React as a peer dependency and is written from the ground up with hooks in mind. It is easy to integrate into any form UI. To achieve this, no renderable form or field component are provided or required. Instead hooks are used to transform any component needed into a form. If desired, this allows forms to be created even without the use of standard browser form elements.

- built using React Hooks
- independent field handling
- highly compatible, easy to integrate
- efficient, fields only render when needed

# Installation

amiable-forms requires **React 16.8.3 or later.**

```
npm install --save amiable-forms
```

# Getting Started

First wrap the form components with the `<AmiableForm>` component provided by `amiable-forms`. This will not add any visual components or inject any props. Its purpose is only to provide a context for the hooks to use.

Field components can be defined with the `useField` hook. This can be done many different ways, a very simplistic version is shown in the example below.

The last hook that will most likely be required is the `useSubmit` hook which provides an `onSubmit` method.

```jsx
const Input = props => {
  const { value, onChange } = useField({ name: props.name })
  return <input {...props} value={value} onChange={onChange} />
}

const SubmitButton = () => {
  const { onSubmit } = useSubmit()
  return <button onClick={onSubmit}>Login</button>
}

const process = values => console.log('Submit', values)

const LoginForm = () => (
  <AmiableForm process={process}>
    <Input name="username" placeholder="username" />
    <Input name="password" placeholder="password" type="password" />
    <SubmitButton />
  </AmiableForm>
)
```
To see a more complete example of a form built with `amiable-forms` use this codesandbox link: 
[Simple Example Form](https://codesandbox.io/s/simple-amiable-forms-example-7qckb)  
// TODO: update example to use 1.1.4

# Documentation

## AmiableForm

The `AmiableForm` component is used to provide a React context and is not a visual component. This shouldn't be confused with any visual UI Form components that might be required for your specific form setup. The `AmiableForm` component must be wrapped around the entire form for any of the `amiable-forms` hooks and helper components to function. This allows form state to be shared without needing explicit prop passing.

```jsx
<AmiableForm
  process={() => {}}
  processInvalid={() => {}}
  validate={() => {}}
  transform={() => {}}
  initialValues={{}}>
  ...
</AmiableForm>
```

| Prop Name | Type | Description | |
|-----------|------|-------------|-|
| process | `function(values, ...args)` | function called when a valid form is submitted | required
| processInvalid | `function(values, formMeta, fields)` | function called when an invalid form is submitted |
| validate | `function(values)` | return error string |
| transform | `function({ current, next })` | return transformed state |
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
| parseWhenFocused | `boolean` | |
| custom | `dunno` | |

The `useField` hook returns many variables to accommodate a variety of situations.

| Return Name | Type | Description | |
|-------------|------|-------------|-|
| value | `any` | the current value of the field |
| submitted | `boolean` | if the form has attempted to be submitted |
| setValue | `function()` | sets the value of the field |
| setVisited | `function()` | marks the field as visited |
| setFocused | `function()` | marks the field as focused |
| onChange | `function(ev)` | helper handler, calls `setValue` |
| onBlur | `function(ev)` | helper handler, calls `setVisited()` |
| error | `string` | contains error messages from the validator functions |
| valid | `boolean` | signals if the field is valid or invalid |
| touched | `boolean` | signals if the field's value has ever changed |
| visited | `boolean` | signals if a user has _clicked through_ a field |
| dirty | `boolean` | signals if the value of the field differs from the initial state |
| cleanValue | `any` | the initial value of the field(?) |

### Field Validators

Field level validation is accomplished by providing an array of validation functions to the `useField` hook under the `validators` input key. The current field value is passed to each validation function when invoked and the validator will either return `undefined` for a pass condition or a string containing the error message. The error message from the first failing validator will be set to the `error` key return value of the `useField` hook.

**Validator Function Exmaples**
```js
const required = value => value ? undefined : 'required'

const numeric = value => (!value || /^\\d+$/i.test(value)) ? undefined : 'invalid'
```

### Field Parse and Format

The `parse` and `format` functions can be used when the value shown to the user in the form differs from what needs to be saved in the data. For example, date fields might want to display a format of MM/DD/YYYY to the user but store the value as YYYY-MM-DD. The `parse` function is used to read the information in the field and convert it into the form data format. `format` is used to convert the form data value into a value to be shown to the user. The `parse` function can also be used as a way to normalize the user input. By default, the value will be parsed when entered, but can be turned off by setting `parseWhenFocused` to `false`.

**Validator Function Exmaples**
```js
const parse = value => (value && value.toUpperCase()) || undefined

const format = value => (value || '').toLowerCase()
```

## useForm

The `useForm` hook is the base `amiable-forms` hook and provides access to the entire state of the form. All of the other hooks are built using `useForm`. By default, `useForm` will cause the component it is in to render on every change. To avoid unnecessary renders, the `shouldUpdate` function needs to be passed into it as an argument.

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
| register | `function()` | registration |
| deregister | `function()` | registration |

### Field Meta
| Name | Type | Description |
|-------------|------|--------|
| error | `string` |
| valid | `boolean` |
| touched | `boolean` |
| visited | `boolean` |
| dirty | `boolean` |
| registered | `boolean` |
| focused | `boolean` |

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

## useFieldValue

## useArrayField

## useRepeated

## useFieldCustomMeta

## Debug

# Solutions to Common Problems

- conditional sections based on form state
- setting form state (or submitting) from external source
- sending additional arguments to the process function
- complex fields
- destructive parse (parseWhenFocused)
