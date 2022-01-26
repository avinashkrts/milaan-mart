import React from 'react';
import { RouteProp, CompositeNavigationProp } from '@react-navigation/core';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';
import { AppRoute } from '../app-routes';
import { AppNavigatorParams } from '../app.navigator';
import { CombinedWishListScreen } from '../../scenes/combined/wishList';
import { CombinedWishListTabNavigationProps } from './combinedHome';


type CombinedWishListNavigatorParams = AppNavigatorParams & { 
  [AppRoute.COMBINED_WISH]: undefined;
}

// export interface CombinedWishListScreenProps {
//   navigation: StackNavigationProp<CombinedWishListNavigatorParams, AppRoute.COMBINED_WISH>;
//   route: RouteProp<CombinedWishListNavigatorParams, AppRoute.COMBINED_WISH>;
// }

export interface CombinedWishListScreenProps {
  navigation: CompositeNavigationProp<
  CombinedWishListTabNavigationProps,
      StackNavigationProp<CombinedWishListNavigatorParams, AppRoute.COMBINED_WISH>
  >;
  route: RouteProp<CombinedWishListNavigatorParams, AppRoute.COMBINED_WISH>;
}

const Stack = createStackNavigator<CombinedWishListNavigatorParams>();

export const CombinedWishListNavigator = (): React.ReactElement => (
  <Stack.Navigator headerMode='none'>
    <Stack.Screen name={AppRoute.COMBINED_WISH} component={CombinedWishListScreen}/>    
  </Stack.Navigator>
);
