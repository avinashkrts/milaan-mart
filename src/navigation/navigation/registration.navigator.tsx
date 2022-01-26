import React from 'react';
import { RouteProp } from '@react-navigation/core';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';
import { AppRoute } from './app-routes';
import { AppNavigatorParams } from './app.navigator';
import {
  SignInScreen
} from '../scenes/auth';
import { ShopRegistrationScreen, ShopAddressScreen, ShopImageScreen } from '../scenes/registration';

type RegistrationNavigatorParams = AppNavigatorParams & {
  [AppRoute.SHOP_REGISTRATION]: undefined;
  [AppRoute.SHOP_ADDRESS]: undefined;
  [AppRoute.SHOP_IMAGE]: undefined;

}

export interface ShopRegistrationScreenProps {
  navigation: StackNavigationProp<RegistrationNavigatorParams, AppRoute.SHOP_REGISTRATION>;
  route: RouteProp<RegistrationNavigatorParams, AppRoute.SHOP_REGISTRATION>;
}

export interface ShopAddressScreenProps {
  navigation: StackNavigationProp<RegistrationNavigatorParams, AppRoute.SHOP_ADDRESS>;
  route: RouteProp<RegistrationNavigatorParams, AppRoute.SHOP_ADDRESS>;
}

export interface ShopImageScreenProps {
  navigation: StackNavigationProp<RegistrationNavigatorParams, AppRoute.SHOP_IMAGE>;
  route: RouteProp<RegistrationNavigatorParams, AppRoute.SHOP_IMAGE>;
}

const Stack = createStackNavigator<RegistrationNavigatorParams>();

export const RegistrationNavigator = (): React.ReactElement => (
  <Stack.Navigator headerMode='none'>
    <Stack.Screen name={AppRoute.SHOP_REGISTRATION} component={ShopRegistrationScreen} />
    <Stack.Screen name={AppRoute.SHOP_ADDRESS} component={ShopAddressScreen} />
    <Stack.Screen name={AppRoute.SHOP_IMAGE} component={ShopImageScreen} />
  </Stack.Navigator>
);
