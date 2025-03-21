import React from 'react';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/core';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import { CategoryListTabNavigatorProp, ShopListTabNavigatorProp } from './customer.navigator';
import { AppRoute } from '../app-routes';
import { ShopListScreen } from '../../screens/customer/shop';
import { CategoryListScreen, ProductDetailScreen } from '../../screens/customer/product';

type ShopListNavigatorParams = {
  [AppRoute.CUSTOMER_CATEGORY_PRODUCT_DETAIL]: undefined;
  [AppRoute.CUSTOMER_CATEGORY_LIST]: undefined;
}

export interface CategoryListScreenProps {
  navigation: CompositeNavigationProp<
  CategoryListTabNavigatorProp,
    StackNavigationProp<ShopListNavigatorParams, AppRoute.CUSTOMER_CATEGORY_LIST>>;
  route: RouteProp<ShopListNavigatorParams, AppRoute.CUSTOMER_CATEGORY_LIST>;
}

export interface CategoryProductDetailScreenProps {
  navigation: CompositeNavigationProp<
  CategoryListTabNavigatorProp,
    StackNavigationProp<ShopListNavigatorParams, AppRoute.CUSTOMER_CATEGORY_PRODUCT_DETAIL>>;
  route: RouteProp<ShopListNavigatorParams, AppRoute.CUSTOMER_CATEGORY_PRODUCT_DETAIL>;
}

const Stack = createStackNavigator<ShopListNavigatorParams>();

export const CategoryListNavigator = (): React.ReactElement => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name={AppRoute.CUSTOMER_CATEGORY_LIST} component={CategoryListScreen}/>
    <Stack.Screen name={AppRoute.CUSTOMER_CATEGORY_PRODUCT_DETAIL} component={ProductDetailScreen}/>
  </Stack.Navigator>
);