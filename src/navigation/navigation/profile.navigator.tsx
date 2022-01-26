// import React from 'react';
// import { RouteProp } from '@react-navigation/core';
// import {
//   createStackNavigator,
//   StackNavigationProp,
// } from '@react-navigation/stack';
// import { AppRoute } from './app-routes';
// import { AppNavigatorParams } from './app.navigator';
// import {
//   SignInScreen,
//   SignUpScreen,
//   OtpScreen,
//   ForgetPasswordScreen
// } from '../scenes/auth';
// import { ProfileScreen } from '../scenes/home';

// type ProfileNavigatorParams = AppNavigatorParams & {
//   [AppRoute.PROFILE]: undefined;
// //   [AppRoute.OTP]: undefined;
// //   [AppRoute.SIGN_UP]: undefined;
// //   [AppRoute.FORGET_PASSWORD]: undefined;
// }

// export interface ProfileScreenProps {
//   navigation: StackNavigationProp<ProfileNavigatorParams, AppRoute.PROFILE>;
//   route: RouteProp<ProfileNavigatorParams, AppRoute.PROFILE>;
// }

// // export interface SignUpScreenProps {
// //   navigation: StackNavigationProp<AuthNavigatorParams, AppRoute.SIGN_UP>;
// //   route: RouteProp<AuthNavigatorParams, AppRoute.SIGN_UP>;
// // }

// // export interface ForgetPasswordScreenProps {
// //   navigation: StackNavigationProp<AuthNavigatorParams, AppRoute.FORGET_PASSWORD>;
// //   route: RouteProp<AuthNavigatorParams, AppRoute.FORGET_PASSWORD>;
// // }

// // export interface OtpScreenProps {
// //   navigation: StackNavigationProp<AuthNavigatorParams, AppRoute.OTP>;
// //   route: RouteProp<AuthNavigatorParams, AppRoute.OTP>;
// // }

// const Stack = createStackNavigator<ProfileNavigatorParams>();

// export const ProfileNavigator = (): React.ReactElement => (
//   <Stack.Navigator headerMode='none'>
//     <Stack.Screen name={AppRoute.PROFILE} component={ProfileScreen}/>
//     {/* <Stack.Screen name={AppRoute.SIGN_UP} component={SignUpScreen}/>
//     <Stack.Screen name={AppRoute.FORGET_PASSWORD} component={ForgetPasswordScreen}/>
//     <Stack.Screen name={AppRoute.OTP} component={OtpScreen}/> */}
//   </Stack.Navigator>
// );
