import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthNavigator } from './auth.navigator';
import {RegistrationNavigator} from './registration.navigator'
import { UserDecideNavigator } from './userDecide.navigator';
import { AddProductNavigator } from './addProductNavigator.navigator';
import { HomeNavigator } from './home.navigator';
import { InformaionNavigator } from './information.navigator';
import { AppRoute } from './app-routes';
import { CustomerHomeNavigator } from './customer-navigator/customerHome.navigator';
import { OrderNavigator } from './shopKeeperNavigator/order.navigator';
import { CustomerOrderNavigator } from './customer-navigator/customerOrder.navigator';
import { CombinedHomeNavigator } from './combined-navigator/combinedHome';

type StackNavigatorProps = React.ComponentProps<typeof Stack.Navigator>;

export type AppNavigatorParams = {
  [AppRoute.AUTH]: undefined;
  [AppRoute.REGISTRATION]: undefined;
  [AppRoute.ORDER]: undefined;
  [AppRoute.CUSTOMER_ORDER]: undefined;
  [AppRoute.USER_DECIDE]: undefined;
  [AppRoute.ADD_PRODUCT_NAVIGATOR]: undefined;
  [AppRoute.CUSTOMER_HOME]: undefined;
  [AppRoute.COMBINED_HOME]: undefined;
  [AppRoute.INFORMATION]: undefined;
  [AppRoute.HOME]: undefined;
  [AppRoute.HRHOME]: undefined;
}

const Stack = createStackNavigator<AppNavigatorParams>();

export const AppNavigator = (props: Partial<StackNavigatorProps>): React.ReactElement => (
  <Stack.Navigator {...props} headerMode='none'>
    <Stack.Screen name={AppRoute.AUTH} component={AuthNavigator}/>
    <Stack.Screen name={AppRoute.REGISTRATION} component={RegistrationNavigator}/>
    <Stack.Screen name={AppRoute.ORDER} component={OrderNavigator}/>
    <Stack.Screen name={AppRoute.CUSTOMER_ORDER} component={CustomerOrderNavigator}/>
    <Stack.Screen name={AppRoute.USER_DECIDE} component={UserDecideNavigator}/>
    <Stack.Screen name={AppRoute.ADD_PRODUCT_NAVIGATOR} component={AddProductNavigator}/>
    <Stack.Screen name={AppRoute.CUSTOMER_HOME} component={CustomerHomeNavigator}/>
    <Stack.Screen name={AppRoute.INFORMATION} component={InformaionNavigator}/>
    <Stack.Screen name={AppRoute.HOME} component={HomeNavigator}/>
    <Stack.Screen name={AppRoute.COMBINED_HOME} component={CombinedHomeNavigator}/>
  </Stack.Navigator>
);
