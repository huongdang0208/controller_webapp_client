import { SigninForm } from "../components/auth/signin-form";
import styles from "./style.module.css";

export default function Signin() {
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Sign Up</h1>
      <div className={styles.formWrapper}>
        <SigninForm />
      </div>
    </div>
  );
}