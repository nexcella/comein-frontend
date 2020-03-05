import React, {useEffect} from "react";
import {useForm} from "react-hook-form";
import {Redirect} from "react-router-dom"
import {reaction} from "mobx";
import styled from "astroturf";
import {useTranslation} from "react-i18next";

import {useAuthActions, useAuthState} from "../components/auth/AuthProvider";
import {Logo} from "../components/logo/Logo";
import {useAppStore} from "../stores/StoreProvider";
import {logger} from "../utils/logger";

const AuthWrapper = styled.div`
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  text-align: center;
  width: 200px;
`

const Subtitle = styled.span`
  color: #5F5E5E;
  margin-top: 8px;
  font-size: 16px;
`

const FormWrapper = styled.form`
  display: flex;
  flex-direction: column;
  margin-top: 10px;
  & input {
    margin-top: 20px;
    height: 30px;
    border-radius: 4px;
    border: 1px solid rgba(196, 196, 196, 0.7);
    background-color: rgba(248, 248, 248, 0.5);
    padding-left: 12px;
    font-size: 12px;
    line-height: 30px;
    outline: none;
    &:focus {
      border-color: rgba(79, 172, 254, 0.7);
    }
  }
  & button {
    margin-top: 20px;
  }
`

export const Auth = () => {
  const authState = useAuthState();
  const appStore = useAppStore();
  const authActions = useAuthActions();
  const {register, handleSubmit} = useForm();

  const {t, i18n} = useTranslation();

  const onSubmit = handleSubmit(({username, password}) => {
    authActions.login({username, password});
  });

  if (authState.isLoggedIn) {
    return <Redirect to="/"/>
  }

  useEffect(() => {
    logger.debug(`App locale: ${appStore.locale}`);
    i18n.changeLanguage(appStore.locale)
  }, [])

  reaction(
    () => appStore.locale,
    locale => {
      logger.debug(`Change locale: ${locale}`);
      i18n.changeLanguage(locale);
    }
  );

  return (
    <AuthWrapper>
      <Logo/>
      <Subtitle>личный кабинет организатора</Subtitle>
      <FormWrapper onSubmit={onSubmit}>
        <input type="text" ref={register} name='username' autoComplete='username' placeholder='Логин'/>
        <input type="password" ref={register} name='password' autoComplete='current-password' placeholder='Пароль'/>
        <button type='submit' disabled={authState.isLoading}>{t('button.login')}</button>
      </FormWrapper>
    </AuthWrapper>
  );
};
