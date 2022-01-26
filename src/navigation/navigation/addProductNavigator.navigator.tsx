import React from 'react';
import { RouteProp } from '@react-navigation/core';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';
import { AppRoute } from './app-routes';
import { AppNavigatorParams } from './app.navigator';
import {
 AddDrawerProductScreen,
 AddDrawerProductImageScreen
} from '../scenes/shopkeeper/home';



type AddProductNavigatorParams = AppNavigatorParams & {
  [AppRoute.ADD_DRAWER_PRODUCT]: undefined;
  [AppRoute.ADD_DRAWER_PRODUCT_IMAGE]: undefined; 
}

export interface AddDrawerProductScreenProps {
  navigation: StackNavigationProp<AddProductNavigatorParams, AppRoute.ADD_DRAWER_PRODUCT>;
  route: RouteProp<AddProductNavigatorParams, AppRoute.ADD_DRAWER_PRODUCT>;
}

export interface AddDrawerProductImageScreenProps {
  navigation: StackNavigationProp<AddProductNavigatorParams, AppRoute.ADD_DRAWER_PRODUCT_IMAGE>;
  route: RouteProp<AddProductNavigatorParams, AppRoute.ADD_DRAWER_PRODUCT_IMAGE>;
} 

const Stack = createStackNavigator<AddProductNavigatorParams>();

export const AddProductNavigator = (): React.ReactElement => (
  <Stack.Navigator headerMode='none'>
    <Stack.Screen name={AppRoute.ADD_DRAWER_PRODUCT} component={AddDrawerProductScreen}/>   
    <Stack.Screen name={AppRoute.ADD_DRAWER_PRODUCT_IMAGE} component={AddDrawerProductImageScreen}/>   
  </Stack.Navigator>
);
