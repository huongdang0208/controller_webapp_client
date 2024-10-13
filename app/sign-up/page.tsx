'use client'; 
import { SignupForm } from "@/app/components/auth/signup-form";
import styles from "./style.module.css";

export default function Signup() {
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Sign Up</h1>
      <div className={styles.formWrapper}>
        <SignupForm />
      </div>
    </div>
  );
}