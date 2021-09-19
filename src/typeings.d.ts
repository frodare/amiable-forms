
type Submit = (...args: any[]) => void

type OnSubmit = (event: React.SyntheticEvent) => void

interface SubmitHandlers {
  submit: Submit
  onSubmit: OnSubmit
}

interface ProcessorFormState extends FormState, FormDispatchers {

}

type Processor = (values: Values, state: ProcessorFormState, ...args: any[]) => any

interface AmiableFormState extends FormDispatchers {
  stateRef: StateRef
  submit: Submit
  onSubmit: OnSubmit
  addUpdateHandler: HandlerSupplier
  removeUpdateHandler: HandlerSupplier
}

interface UseFormReturn extends FormState, AmiableFormState {

}

interface FieldState extends UseFormReturn {
  field: Field
  value: any
  cleanValue: any
  bypassParseDueToFocus: boolean
}

type FieldStateRef = React.MutableRefObject<FieldState>

type AmiableFormStateRef = React.MutableRefObject<AmiableFormState>

interface AmiableFormProps {
  process: Processor
  processInvalid: Processor
  validate: FormValidator
  transform: Transform
  initialValues: Values
  children: any
}

interface Values {
  [key: string]: any
}

type ShouldUpdateHandler = (event: StateUpdateEvent) => boolean

type FormRef = React.MutableRefObject<AmiableFormState>

type StateRef = React.MutableRefObject<FormState>

type Validator = (value: any, values: Values) => string | undefined

interface StateUpdateEvent {
  previous: FormState
  current: FormState
}

interface TransformEvent {
  next: FormState
  current: FormState
}

interface FormMeta {
  version: string
  touched: boolean
  submitted: boolean
  submitCount: number
  submitting: boolean
  visited: boolean
  valid: boolean
  dirty: boolean
  error: FormError
  custom: any
}

interface FormState {
  cleanValues: Values
  values: Values
  fields: Fields
  meta: FormMeta
}

interface Fields {
  [key: string]: Field
}

interface Field {
  error: FormError
  valid: boolean
  touched: boolean
  visited: boolean
  dirty: boolean
  focused: boolean
  registered: boolean
  custom: any
}

interface Action {
  type: string
}

interface AnyAction extends Action {
  [key: string]: any
}

interface SetFieldAction extends Action {
  name: string
  field: Field
}

interface SetMetaValueAction extends Action {
  key: keyof FormMeta
  value: any
}

interface RemoveFieldAction extends Action {
  name: string
}

interface SetValueAction extends Action {
  name: string
  value: any
}

interface SetValuesOptions {
  merge: boolean
}

interface SetValuesAction extends Action {
  values: Values
  options: SetValuesOptions
}

interface SetValueWithFieldAction extends SetFieldAction, SetValueAction {

}

type ValueGetter = (values: Values) => any

type Reducer = (state: FormState, action: Action) => FormState

type Transform = (event: TransformEvent) => FormState

type FormValidator = (values: Values) => string | undefined

type Dispatch = (action: Action) => void

type SetFieldDispatcher = (name: string, field: Field) => void

type SetMetaValueDispatcher = (key: keyof FormMeta, value: any) => void

type RemoveFieldDispatcher = (name: string) => void

type ResetDispatcher = () => void

type ClearDispatcher = () => void

type SetValueDispatcher = (name: string, valueOrValueGetter: ValueGetter | any) => void

type SetValueWithFieldDispatcher = (name: string, valueOrValueGetter: ValueGetter | any, field: Field) => void

type SetValuesDispatcher = (valuesOrValuesGetter: ValueGetter | any, options: SetValuesOptions | undefined) => void

type FieldParser = (value: any) => any

interface FormDispatchers {
  setField: SetFieldDispatcher
  setMetaValue: SetMetaValueDispatcher
  removeField: RemoveFieldDispatcher
  reset: ResetDispatcher
  clear: ClearDispatcher
  setValue: SetValueDispatcher
  setValueWithField: SetValueWithFieldDispatcher
  setValues: SetValuesDispatcher
}

type Handler = (event: any) => void

type HandlerSupplier = (handler: Handler) => void

type FieldSetFocused = (focused: boolean) => void
type FieldSetVisited = () => void
type FieldOnChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => void
type FieldOnBlurHandler = () => void
type FieldOnFocusHandler = () => void

interface FieldSetValueOptions {
  touch: boolean
}

type FieldSetValue = (value: any, options: FieldSetValueOptions | undefined) => void

interface FieldActions {
  setValueWithEffect: FieldSetValue
  setFocused: FieldSetFocused
  setVisited: FieldSetVisited
  onChange: FieldOnChangeHandler
  onBlur: FieldOnBlurHandler
  onFocus: FieldOnFocusHandler
}

interface FieldComm {
  bypassParseDueToFocus: boolean
  requestRerun: boolean
  prevValue: any
  value: any
  cleanValue: any
}

type FieldCommRef = React.MutableRefObject<FieldComm>

interface UseFieldArgs {
  name: string
  validators: Validator[]
  parse: FieldParser
  format: FieldParser
  parseWhenFocused: boolean
  custom: any
}

interface UseFieldResult extends Field {
  setValue: FieldSetValue
  setVisited: FieldSetVisited
  setFocused: FieldSetFocused
  onChange: FieldOnChangeHandler
  onBlur: FieldOnBlurHandler
  onFocus: FieldOnFocusHandler
  value: any
  submitted: boolean
  cleanValue: any
  submitCount: number
  submitting: boolean
}

type FormError = string | undefined
