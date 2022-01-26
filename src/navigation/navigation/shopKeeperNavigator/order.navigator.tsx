import React from 'react';
import { RouteProp } from '@react-navigation/core';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';
import { AppRoute } from '../app-routes';
import { AppNavigatorParams } from '../app.navigator';
import {MyOrderScreen, MyOrderDetailScreen} from '../../scenes/shopkeeper/home';

type OrderNavigatorParams = AppNavigatorParams & {
  [AppRoute.MY_ORDER]: undefined;
  [AppRoute.MY_ORDER_DETAIL]: undefined;
 
}

export interface MyOrderScreenProps {
  navigation: StackNavigationProp<OrderNavigatorParams, AppRoute.MY_ORDER>;
  route: RouteProp<OrderNavigatorParams, AppRoute.MY_ORDER>;
}

export interface MyOrderDetailScreenProps {
    navigation: StackNavigationProp<OrderNavigatorParams, AppRoute.MY_ORDER_DETAIL>;
    route: RouteProp<OrderNavigatorParams, AppRoute.MY_ORDER_DETAIL>;
  }

const Stack = createStackNavigator<OrderNavigatorParams>();

export const OrderNavigator = (): React.ReactElement => (
  <Stack.Navigator headerMode='none'>
    <Stack.Screen name={AppRoute.MY_ORDER} component={MyOrderScreen}/>
    <Stack.Screen name={AppRoute.MY_ORDER_DETAIL} component={MyOrderDetailScreen}/>
  
  </Stack.Navigator>
);
