import React, { useState } from "react";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import Card from "../../components/shared/Card/Card";
import Button from "../../components/shared/Button/Button";
import TextInput from "../../components/shared/TextInput/TextInput";
import { signInSchema } from "../../schemas";
import { login } from "../../api";
import { setAuth } from "../../store/authSlice";
import { setUser } from "../../store/userSlice";
import styles from "./SignIn.module.css";

function SignIn() {
  const { values, handleBlur, handleChange, errors, touched } = useFormik({
    initialValues: {
      email: "",
      password: "",
    },

    validationSchema: signInSchema,
  });

  const dispatch = useDispatch();

  const [frontendError, setFrontendError] = useState("");

  const loginHandler = async () => {
    const response = await login({
      email: values.email,
      password: values.password,
    });
    if (response.code === "ERR_BAD_REQUEST") {
      setFrontendError("email or password is wrong!");
      return;
    }
    const { data } = response;

    if (data.status === "success") {
      dispatch(setAuth(data.auth));
      dispatch(setUser(data.data.user));
    }
  };

  return (
    <div className="cardWrapper" data-testid="cardWrapper">
      <Card cardHeading="Welcome back" cardLogo="lock_key_sign_in">
        <div className="cardFlex" data-testid="cardFlex">
          <TextInput
            type="email"
            placeholder="email"
            value={values.email}
            onChange={handleChange}
            name="email"
            onBlur={handleBlur}
            error={errors.email && touched.email ? 1 : undefined}
            errormessage={errors.email}
          />

          <TextInput
            type="password"
            placeholder="password"
            value={values.password}
            onChange={handleChange}
            name="password"
            onBlur={handleBlur}
            error={errors.password && touched.password ? 1 : undefined}
            errormessage={errors.password}
          />
          <Button
            onClick={loginHandler}
            buttontitle="Sign In"
            buttonimage="arrow_right"
            disabled={
              !values.password ||
              !values.email ||
              errors.email ||
              errors.password
            }
          />
          {frontendError !== "" && (
            <div className={styles.errorWrapper}>{frontendError}</div>
          )}
        </div>
      </Card>
    </div>
  );
}

export default SignIn;
