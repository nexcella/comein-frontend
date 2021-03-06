import React, {useEffect} from "react";
import styled from "astroturf";
import {useTranslation} from "react-i18next";
import {observer} from "mobx-react-lite";
import {object as yupObject, string as yupString} from 'yup';
import {useFormik} from "formik";

import {useAuthStore} from "../../providers/StoreProvider";
import {LoginData} from "../../stores/AuthStore";
import {Input} from "../ui-kit/forms/Input";
import {Button} from "../ui-kit/Button";
import {ErrorLabel} from "../error/ErrorLabel";

const FormWrapper = styled.form`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  & > div:first-child input {
    margin-top: 0;
  }
  & button {
    margin-top: 35px;
  }
`

export const AuthForm = observer(function AuthForm() {
  const {t} = useTranslation();
  const authStore = useAuthStore();
  useEffect(() => {
    authStore.clear();
  }, [authStore.clear])

  const validationSchema = yupObject().shape({
    username: yupString().required(t('validation.required')),
    password: yupString().required(t('validation.required'))
  });

  const formik = useFormik<LoginData>({
    validationSchema,
    initialValues: {
      username: '',
      password: ''
    },
    onSubmit: ({username, password}) => {
      authStore.login({username, password});
    }
  });

  const isLoading = formik.isSubmitting && authStore.isLoading;
  const isValid = formik.dirty && formik.isValid;

  return (
    <FormWrapper onSubmit={formik.handleSubmit}>
      <Input
        value={formik.values.username}
        onChange={formik.handleChange}
        autocomplete='username'
        name='username'
        placeholder={t('label.username')}
        showError={formik.touched.username}
        error={formik.errors.username}
        required
      />
      <Input
        type='password'
        value={formik.values.password}
        onChange={formik.handleChange}
        autocomplete='current-password'
        name='password'
        placeholder={t('label.password')}
        showError={formik.touched.password}
        error={formik.errors.password}
        required
      />
      {authStore.error && <ErrorLabel text={t(`errors.${authStore.error}`)}/>}
      <Button
        disabled={!isValid || isLoading}
        pending={isLoading}
        text={t('button.login')}
      />
    </FormWrapper>
  )
})
