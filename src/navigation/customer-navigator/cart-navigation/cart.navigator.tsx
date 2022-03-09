import React from 'react';
import { RouteProp } from '@react-navigation/core';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';
import { AppRoute } from '../../app-routes';
import { CartScreen, PaymentScreen } from '../../../screens/customer/cart';
import { RootNavigatorParams } from '../../root.navigator';
import { CustomerAddressScreen } from '../../../screens/customer/drawer';

type CartNavigatorParams = RootNavigatorParams & {
  [AppRoute.CUSTOMER_CART]: undefined;
  [AppRoute.PAYMENT]: undefined;
  [AppRoute.CART_ADDRESS]: undefined;
}

export interface CartScreenProps {
  navigation: StackNavigationProp<CartNavigatorParams, AppRoute.CUSTOMER_CART>;
  route: RouteProp<CartNavigatorParams, AppRoute.CUSTOMER_CART>;
}

export interface PaymentScreenProps {
  navigation: StackNavigationProp<CartNavigatorParams, AppRoute.PAYMENT>;
  route: RouteProp<CartNavigatorParams, AppRoute.PAYMENT>;
}

export interface CartAddressScreenProps {
  navigation: StackNavigationProp<CartNavigatorParams, AppRoute.CART_ADDRESS>;
  route: RouteProp<CartNavigatorParams, AppRoute.CART_ADDRESS>;
}

const Stack = createStackNavigator<CartNavigatorParams>();

export const CartNavigator = (): React.ReactElement => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name={AppRoute.CUSTOMER_CART} component={CartScreen} />
    <Stack.Screen name={AppRoute.PAYMENT} component={PaymentScreen} />
    <Stack.Screen name={AppRoute.CART_ADDRESS} component={CustomerAddressScreen} />
  </Stack.Navigator>
);