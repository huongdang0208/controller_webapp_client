"use client";

import { useFormState, useFormStatus } from "react-dom";
import styles from "./style.module.css";
import { SigninFormState, SigninFormSchema } from "@/app/lib/definitions";
import { useMutation } from "@apollo/client";
import { SIGNIN_MUTATION } from "@/app/api/auth";
import { useState } from "react";
import { Snackbar } from "@mui/material";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/app/lib/redux/store";
import { setTokens, setUser } from "@/app/lib/redux/auth-slice";

export function SigninForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [login, { data, error, loading }] = useMutation(SIGNIN_MUTATION);
  const [noti, setNoti] = useState<String>();

  const signin = async (state: SigninFormState, formData: FormData) => {
    const validatedFields = SigninFormSchema.safeParse({
      name: formData.get("name"),
      password: formData.get("password"),
    });
    console.log("validatedFields", validatedFields);

    // If any form fields are invalid, return early
    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }

    // Call the provider or db to create a user...
    try {
      const res = await login({
        variables: {
          loginAuthenticateInput: {
            username: validatedFields?.data?.name,
            password: validatedFields?.data?.password,
          },
        },
      });
      setNoti("Login successfully!");

      if (res.data) {
        // call the store in redux to save the user
        dispatch(setUser(res.data.login.node.user));
        dispatch(
          setTokens({
            accessToken: res.data.login.node.accessToken,
            refreshToken: res.data.login.node.refreshToken,
          })
        );
        // save to local storage
        localStorage.setItem("accessToken", res.data.login.node.accessToken);
        localStorage.setItem("refreshToken", res.data.login.node.refreshToken);
      }
      setTimeout(() => {
        router.push("/dashboard");
      }, 500);
    } catch (error) {
      setNoti(`Login failed: ${error}`);
      console.error(error);
    }
  };
  const [state, action] = useFormState(signin, undefined);
  console.log("state", state);

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
        color={noti == "Login successfully!" ? "success" : "error"}
      />
    </>
  );
}

function SubmitButton({ loading }: { loading: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button disabled={loading} type="submit" className={styles.submitButton}>
      {loading ? "Signing In..." : "Sign In"}
    </button>
  );
}
