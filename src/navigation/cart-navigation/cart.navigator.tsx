import React from 'react';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/core';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';
import { AppRoute } from '../app-routes';
import { CartScreen } from '../../screens/customer/cart';
import { RootNavigatorParams } from '../root.navigator';

type CartNavigatorParams = RootNavigatorParams & {
  [AppRoute.CUSTOMER_CART]: undefined;
}

export interface CartScreenProps {
  navigation: StackNavigationProp<CartNavigatorParams, AppRoute.CUSTOMER_CART>;
  route: RouteProp<CartNavigatorParams, AppRoute.CUSTOMER_CART>;
}

const Stack = createStackNavigator<CartNavigatorParams>();

export const CartNavigator = (): React.ReactElement => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name={AppRoute.CUSTOMER_CART} component={CartScreen} />
  </Stack.Navigator>
);