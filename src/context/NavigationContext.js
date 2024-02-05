import React from 'react';
import { CommonActions, StackActions } from '@react-navigation/native';

export const navigationRef = React.createRef();

export const navigateTo = (name = '', params = {}) => {
  navigationRef.current?.navigate(name, params);
};

export const resetTo = (screen = '', params = {}) => {
  navigationRef.current?.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [{ name: screen, params }],
    })
  );
};

export const push = (name = '', params = {}) => {
  navigationRef.current?.dispatch(StackActions.push(name, params));
};

export const goBack = () => {
  navigationRef.current?.dispatch(StackActions.pop());
};

export const popToTop = () => {
  navigationRef.current?.dispatch(StackActions.popToTop());
};
