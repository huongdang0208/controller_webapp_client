"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useRouter } from 'next/navigation'
import { useMutation } from "@apollo/client";
import { SIGNUP_MUTATION } from "@/app/api/auth";
import { SignupFormSchema, FormState } from "@/app/lib/definitions";
import styles from "./style.module.css";
import { Snackbar } from "@mui/material";
import { useState } from "react";

export function SignupForm() {
  const [register, { data, error, loading }] = useMutation(SIGNUP_MUTATION);
  const router = useRouter();
  const [noti, setNoti] = useState<String>();

  const signup = async (state: FormState, formData: FormData) => {
    // Validate form fields
    const validatedFields = SignupFormSchema.safeParse({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
    });

    // If any form fields are invalid, return early
    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
      };
    } else {
      try {
        const res = await register({
          variables: {
            params: {
              email: validatedFields?.data?.email,
              password: validatedFields?.data?.password,
              username: validatedFields?.data?.name,
            },
          },
        });
        // console.log(data, "error: ", error);
        // console.log("res: ", res);
        setNoti("User created successfully. You will be redirected to the login page.");
        setTimeout(() => {
          router.push("/sign-in");
        }, 2000)
      } catch (error) {
        setNoti(`Registration failed: ${error}`);
        console.error(error);
      }
    }

    // Call the provider or db to create a user...
  };
  const [state, action] = useFormState(signup, undefined);

  return (
    <>
      <form action={action}>
        <div className={styles.formGroup}>
          <label htmlFor="name" className={styles.label}>
            Name
          </label>
          <input
            id="name"
            name="name"
            placeholder="Name"
            className={styles.input}
          />
          {state?.errors?.name && (
            <p className={styles.error}>{state.errors.name}</p>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.label}>
            Email
          </label>
          <input
            id="email"
            name="email"
            placeholder="Email"
            className={styles.input}
          />
          {state?.errors?.email && (
            <p className={styles.error}>{state.errors.email}</p>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="password" className={styles.label}>
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            className={styles.input}
          />
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

        <SubmitButton loading={loading} />
      </form>
      <Snackbar
        open={noti ? true : false}
        autoHideDuration={6000}
        message={noti}
        color={noti == "User created successfully. You will be redirected to the login page." ? "success" : "error"}
      />
    </>
  );
}

function SubmitButton({ loading }: { loading: boolean }) {
  return (
    <button disabled={loading} type="submit" className={styles.submitButton}>
      {loading ? "Signing Up..." : "Sign Up"}
    </button>
  );
}
