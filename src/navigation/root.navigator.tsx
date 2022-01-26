import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthNavigator } from './auth-navigation/auth.navigator';
import { AppRoute } from './app-routes';
import { CustomerNavigator } from './customer-navigator/customer.navigator';
import { UserDecideNavigator } from './user-decide/userDecide.navigator';
import { CartNavigator } from './cart-navigation/cart.navigator';

type StackNavigatorProps = React.ComponentProps<typeof Stack.Navigator>;

export type RootNavigatorParams = {
  [AppRoute.AUTH]: undefined; 
  [AppRoute.CART]: undefined; 
  [AppRoute.CUSTOMER]: undefined; 
  [AppRoute.USER_DECIDE]: undefined; 
}

const Stack = createStackNavigator<RootNavigatorParams>();

export const RootNavigator = (props: Partial<StackNavigatorProps>): React.ReactElement => (
  <Stack.Navigator {...props} screenOptions={{headerShown: false}} >
    <Stack.Screen name={AppRoute.AUTH} component={AuthNavigator}/>   
    <Stack.Screen name={AppRoute.CUSTOMER} component={CustomerNavigator}/>    
    <Stack.Screen name={AppRoute.USER_DECIDE} component={UserDecideNavigator}/>   
    <Stack.Screen name={AppRoute.CART} component={CartNavigator}/>   
  </Stack.Navigator>
);