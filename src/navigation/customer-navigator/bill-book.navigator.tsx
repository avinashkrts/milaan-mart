import React from 'react';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/core';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import { BillBookTabNavigatorProp } from './customer.navigator';
import { AppRoute } from '../app-routes';
import { BillBookScreen } from '../../screens/customer/billBook';

type BillBookNavigatorParams = {
  [AppRoute.BILL_BOOK]: undefined;
}

export interface BillBookScreenProps {
  navigation: CompositeNavigationProp<
  BillBookTabNavigatorProp,
    StackNavigationProp<BillBookNavigatorParams, AppRoute.BILL_BOOK>>;
  route: RouteProp<BillBookNavigatorParams, AppRoute.BILL_BOOK>;
}

const Stack = createStackNavigator<BillBookNavigatorParams>();

export const BillBookNavigator = (): React.ReactElement => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name={AppRoute.BILL_BOOK} component={BillBookScreen}/>
  </Stack.Navigator>
);