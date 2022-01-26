import React from 'react';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/core';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import { CategoryListTabNavigatorProp, ShopListTabNavigatorProp } from '../customer-navigator/customer.navigator';
import { AppRoute } from '../app-routes';
import { ShopListScreen } from '../../screens/customer/shop';
import { CategoryListScreen } from '../../screens/customer/product';

type ShopListNavigatorParams = {
  [AppRoute.CUSTOMER_SHOP_LIST]: undefined;
  [AppRoute.CUSTOMER_CATEGORY_LIST]: undefined;
}

export interface ShopListScreenProps {
  navigation: CompositeNavigationProp<
  ShopListTabNavigatorProp,
    StackNavigationProp<ShopListNavigatorParams, AppRoute.CUSTOMER_SHOP_LIST>>;
  route: RouteProp<ShopListNavigatorParams, AppRoute.CUSTOMER_SHOP_LIST>;
}

export interface CategoryListScreenProps {
  navigation: CompositeNavigationProp<
  CategoryListTabNavigatorProp,
    StackNavigationProp<ShopListNavigatorParams, AppRoute.CUSTOMER_CATEGORY_LIST>>;
  route: RouteProp<ShopListNavigatorParams, AppRoute.CUSTOMER_CATEGORY_LIST>;
}

const Stack = createStackNavigator<ShopListNavigatorParams>();

export const ShopListNavigator = (): React.ReactElement => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name={AppRoute.CUSTOMER_CATEGORY_LIST} component={CategoryListScreen}/>
    <Stack.Screen name={AppRoute.CUSTOMER_SHOP_LIST} component={ShopListScreen}/>
  </Stack.Navigator>
);