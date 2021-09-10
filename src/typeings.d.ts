interface Values {
  [key: string]: any
}

// FIXME
type FormRef = any

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
  error: string | undefined // FIXME can this be removed?
  custom: any // FIXME can this be removed?
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
  error: string | undefined
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
