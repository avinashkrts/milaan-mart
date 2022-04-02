import React from 'react';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/core';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import { WishListTabNavigatorProp } from './customer.navigator';
import { AppRoute } from '../app-routes';
import { WishListScreen } from '../../screens/customer/wish-list';
import { ProductDetailScreen } from '../../screens/customer/product';

type WishListNavigatorParams = {
  [AppRoute.WISH_LIST]: undefined;
  [AppRoute.WISH_PRODUCT_DETAIL]: undefined;
}

export interface WishListScreenProps {
  navigation: CompositeNavigationProp<
  WishListTabNavigatorProp,
    StackNavigationProp<WishListNavigatorParams, AppRoute.WISH_LIST>>;
  route: RouteProp<WishListNavigatorParams, AppRoute.WISH_LIST>;
}

export interface WishProductDetailScreenProps {
  navigation: CompositeNavigationProp<
  WishListTabNavigatorProp,
    StackNavigationProp<WishListNavigatorParams, AppRoute.WISH_PRODUCT_DETAIL>>;
  route: RouteProp<WishListNavigatorParams, AppRoute.WISH_PRODUCT_DETAIL>;
}

const Stack = createStackNavigator<WishListNavigatorParams>();

export const WishListNavigator = (): React.ReactElement => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name={AppRoute.WISH_LIST} component={WishListScreen}/>
    <Stack.Screen name={AppRoute.WISH_PRODUCT_DETAIL} component={ProductDetailScreen}/>
  </Stack.Navigator>
);