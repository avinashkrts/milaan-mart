import React from 'react';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/core';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import { ProductListTabNavigatorProp } from './customer.navigator';
import { AppRoute } from '../app-routes';
import { ProductListScreen } from '../../screens/customer/product';

type ProductListNavigatorParams = {
  [AppRoute.CUSTOMER_PRODUCT_LIST]: undefined;
}

export interface ProductListScreenProps {
  navigation: CompositeNavigationProp<
  ProductListTabNavigatorProp,
    StackNavigationProp<ProductListNavigatorParams, AppRoute.CUSTOMER_PRODUCT_LIST>>;
  route: RouteProp<ProductListNavigatorParams, AppRoute.CUSTOMER_PRODUCT_LIST>;
}

const Stack = createStackNavigator<ProductListNavigatorParams>();

export const ProductListNavigator = (): React.ReactElement => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name={AppRoute.CUSTOMER_PRODUCT_LIST} component={ProductListScreen}/>
  </Stack.Navigator>
);