import React from 'react';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/core';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import { OffersTabNavigatorProp } from './customer.navigator';
import { AppRoute } from '../app-routes';
import { OffersScreen } from '../../screens/customer/offers';

type OffersListNavigatorParams = {
  [AppRoute.OFFERS_TAB]: undefined;
}

export interface OffersScreenProps {
  navigation: CompositeNavigationProp<
  OffersTabNavigatorProp,
    StackNavigationProp<OffersListNavigatorParams, AppRoute.OFFERS_TAB>>;
  route: RouteProp<OffersListNavigatorParams, AppRoute.OFFERS_TAB>;
}

const Stack = createStackNavigator<OffersListNavigatorParams>();

export const OffersListNavigator = (): React.ReactElement => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name={AppRoute.OFFERS_TAB} component={OffersScreen}/>
  </Stack.Navigator>
);