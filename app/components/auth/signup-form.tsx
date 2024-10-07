'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { signup } from '@/app/utils/auth'
import styles from './style.module.css'

export function SignupForm() {
  const [state, action] = useFormState(signup, undefined)

  return (
    <form action={action}>
      <div className={styles.formGroup}>
        <label htmlFor="name" className={styles.label}>Name</label>
        <input id="name" name="name" placeholder="Name" className={styles.input} />
        {state?.errors?.name && <p className={styles.error}>{state.errors.name}</p>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="email" className={styles.label}>Email</label>
        <input id="email" name="email" placeholder="Email" className={styles.input} />
        {state?.errors?.email && <p className={styles.error}>{state.errors.email}</p>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="password" className={styles.label}>Password</label>
        <input id="password" name="password" type="password" className={styles.input} />
        {state?.errors?.password && (
          <div className={styles.passwordError}>
            <p>Password must:</p>
            <ul>
              {state.errors.password.map((error) => (
                <li key={error}>- {error}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <SubmitButton />
    </form>
  )
}

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button disabled={pending} type="submit" className={styles.submitButton}>
      Sign Up
    </button>
  )
}