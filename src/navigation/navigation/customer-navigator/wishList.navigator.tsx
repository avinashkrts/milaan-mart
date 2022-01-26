import React from 'react';
import { RouteProp } from '@react-navigation/core';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';
import { AppRoute } from '../app-routes';
import { AppNavigatorParams } from '../app.navigator';
import { WishListScreen } from '../../scenes/Customer/wishList';


type WishListNavigatorParams = AppNavigatorParams & { 
  [AppRoute.WISH_LIST]: undefined;
}

export interface WishListScreenProps {
  navigation: StackNavigationProp<WishListNavigatorParams, AppRoute.WISH_LIST>;
  route: RouteProp<WishListNavigatorParams, AppRoute.WISH_LIST>;
}

const Stack = createStackNavigator<WishListNavigatorParams>();

export const WishListNavigator = (): React.ReactElement => (
  <Stack.Navigator headerMode='none'>
    <Stack.Screen name={AppRoute.WISH_LIST} component={WishListScreen}/>    
  </Stack.Navigator>
);
