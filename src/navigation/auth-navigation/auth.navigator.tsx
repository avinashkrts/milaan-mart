import React from 'react';
import { RouteProp } from '@react-navigation/core';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';
import { AppRoute } from '../app-routes';
import { RootNavigatorParams } from '../root.navigator';
import {
  SignInScreen, UserDecide, ForgetPasswordScreen, OtpScreen, SignUpScreen
} from '../../screens/auth';

type AuthNavigatorParams = RootNavigatorParams & {
  [AppRoute.SIGN_IN]: undefined;
  [AppRoute.SIGN_UP]: undefined;
  [AppRoute.USER_DECIDE]: undefined;
  [AppRoute.OTP]: undefined;
  [AppRoute.FORGET_PWD]: undefined;
}

export interface SignInScreenProps {
  navigation: StackNavigationProp<AuthNavigatorParams, AppRoute.SIGN_IN>;
  route: RouteProp<AuthNavigatorParams, AppRoute.SIGN_IN>;
}

export interface SignUpScreenProps {
  navigation: StackNavigationProp<AuthNavigatorParams, AppRoute.SIGN_UP>;
  route: RouteProp<AuthNavigatorParams, AppRoute.SIGN_UP>;
}

export interface UserDecideScreenProps {
  navigation: StackNavigationProp<AuthNavigatorParams, AppRoute.USER_DECIDE>;
  route: RouteProp<AuthNavigatorParams, AppRoute.USER_DECIDE>;
}

export interface OtpScreenProps {
  navigation: StackNavigationProp<AuthNavigatorParams, AppRoute.OTP>;
  route: RouteProp<AuthNavigatorParams, AppRoute.OTP>;
}

export interface ForgetPasswordScreenProps {
  navigation: StackNavigationProp<AuthNavigatorParams, AppRoute.FORGET_PWD>;
  route: RouteProp<AuthNavigatorParams, AppRoute.FORGET_PWD>;
}

const Stack = createStackNavigator<AuthNavigatorParams>();

export const AuthNavigator = (): React.ReactElement => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name={AppRoute.SIGN_IN} component={SignInScreen}/>    
    <Stack.Screen name={AppRoute.SIGN_UP} component={SignUpScreen}/>    
    <Stack.Screen name={AppRoute.OTP} component={OtpScreen}/>    
    <Stack.Screen name={AppRoute.FORGET_PWD} component={ForgetPasswordScreen}/>    
    <Stack.Screen name={AppRoute.USER_DECIDE} component={UserDecide}/>    
  </Stack.Navigator>
);
