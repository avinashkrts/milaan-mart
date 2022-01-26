import React from 'react';
import { RouteProp } from '@react-navigation/core';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';
import { AppRoute } from './app-routes';
import { AppNavigatorParams } from './app.navigator';
import {
  SignInScreen,
  SignUpScreen,
  OtpScreen,
  LogoutScreen,
  ForgetPasswordScreen
} from '../scenes/auth';
import { ShopAddressScreen, ShopImageScreen } from '../scenes/registration';

type AuthNavigatorParams = AppNavigatorParams & {
  [AppRoute.SIGN_IN]: undefined;
  [AppRoute.SIGN_REG_IMAGE]: undefined;
  [AppRoute.SIGN_REG_ADDRESS]: undefined;
  [AppRoute.OTP]: undefined;
  [AppRoute.SIGN_UP]: undefined;
  [AppRoute.FORGET_PASSWORD]: undefined;
  [AppRoute.LOG_OUT]: undefined;
}

export interface SignInScreenProps {
  navigation: StackNavigationProp<AuthNavigatorParams, AppRoute.SIGN_IN>;
  route: RouteProp<AuthNavigatorParams, AppRoute.SIGN_IN>;
}

export interface SignRegAddressScreenProps {
  navigation: StackNavigationProp<AuthNavigatorParams, AppRoute.SIGN_REG_ADDRESS>;
  route: RouteProp<AuthNavigatorParams, AppRoute.SIGN_REG_ADDRESS>;
}

export interface SignRegImageScreenProps {
  navigation: StackNavigationProp<AuthNavigatorParams, AppRoute.SIGN_REG_IMAGE>;
  route: RouteProp<AuthNavigatorParams, AppRoute.SIGN_REG_IMAGE>;
}

export interface SignUpScreenProps {
  navigation: StackNavigationProp<AuthNavigatorParams, AppRoute.SIGN_UP>;
  route: RouteProp<AuthNavigatorParams, AppRoute.SIGN_UP>;
}

export interface ForgetPasswordScreenProps {
  navigation: StackNavigationProp<AuthNavigatorParams, AppRoute.FORGET_PASSWORD>;
  route: RouteProp<AuthNavigatorParams, AppRoute.FORGET_PASSWORD>;
}

export interface OtpScreenProps {
  navigation: StackNavigationProp<AuthNavigatorParams, AppRoute.OTP>;
  route: RouteProp<AuthNavigatorParams, AppRoute.OTP>;
}

export interface LogoutScreenProps {
  navigation: StackNavigationProp<AuthNavigatorParams, AppRoute.LOG_OUT>;
  route: RouteProp<AuthNavigatorParams, AppRoute.LOG_OUT>;
}

const Stack = createStackNavigator<AuthNavigatorParams>();

export const AuthNavigator = (): React.ReactElement => (
  <Stack.Navigator headerMode='none'>
    <Stack.Screen name={AppRoute.SIGN_IN} component={SignInScreen}/>
    <Stack.Screen name={AppRoute.SIGN_UP} component={SignUpScreen}/>
    <Stack.Screen name={AppRoute.FORGET_PASSWORD} component={ForgetPasswordScreen}/>
    <Stack.Screen name={AppRoute.OTP} component={OtpScreen}/>
    <Stack.Screen name={AppRoute.LOG_OUT} component={LogoutScreen}/>
    <Stack.Screen name={AppRoute.SIGN_REG_ADDRESS} component={ShopAddressScreen}/>
    <Stack.Screen name={AppRoute.SIGN_REG_IMAGE} component={ShopImageScreen}/>
  </Stack.Navigator>
);
