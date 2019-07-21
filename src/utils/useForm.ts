import { useState } from 'react'

interface HashMap {
  [key: string]: any
}

const useForm = <FormValues extends HashMap>(initialValues: FormValues) => {
  const [values, setValues] = useState<FormValues>(initialValues)

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { currentTarget } = event
    setValues({
      ...values,
      [currentTarget.name]: currentTarget.value
    })
  }

  const fieldProps = (name: string) => {
    return {
      name,
      onChange,
      value: values && values[name]
    }
  }

  type SubmitFunction = (values: FormValues) => void

  const handleSubmit = (submitFn: SubmitFunction) => (
    event: React.FormEvent
  ) => {
    event.preventDefault()
    submitFn(values)
  }

  return {
    values,
    fieldProps,
    handleSubmit
  }
}

export default useForm
