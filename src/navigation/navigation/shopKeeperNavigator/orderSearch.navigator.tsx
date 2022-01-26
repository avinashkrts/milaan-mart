import React from 'react';
import { RouteProp } from '@react-navigation/core';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';
import { AppRoute } from '../app-routes';
import { AppNavigatorParams } from '../app.navigator';
import { MyOrderSearchScreen, MyOrderDetailScreen } from '../../scenes/shopkeeper/home';

type OrderNavigatorParams = AppNavigatorParams & {
  [AppRoute.MY_ORDER_SEARCH]: undefined;
  [AppRoute.MY_ORDER_SEARCH_DETAIL]: undefined;

}

export interface MyOrderSearchScreenProps {
  navigation: StackNavigationProp<OrderNavigatorParams, AppRoute.MY_ORDER_SEARCH>;
  route: RouteProp<OrderNavigatorParams, AppRoute.MY_ORDER_SEARCH>;
}

export interface MyOrderSearchDetailScreenProps {
  navigation: StackNavigationProp<OrderNavigatorParams, AppRoute.MY_ORDER_SEARCH_DETAIL>;
  route: RouteProp<OrderNavigatorParams, AppRoute.MY_ORDER_SEARCH_DETAIL>;
}

const Stack = createStackNavigator<OrderNavigatorParams>();

export const OrderSearchNavigator = (): React.ReactElement => (
  <Stack.Navigator headerMode='none'>
    <Stack.Screen name={AppRoute.MY_ORDER_SEARCH} component={MyOrderSearchScreen} />
    <Stack.Screen name={AppRoute.MY_ORDER_SEARCH_DETAIL} component={MyOrderDetailScreen} />
  </Stack.Navigator>
);
