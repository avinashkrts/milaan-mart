import React from 'react';
import {
    RouteProp,
} from '@react-navigation/core';
import {
    createStackNavigator,
    StackNavigationProp,
} from '@react-navigation/stack';
import { RootNavigatorParams } from '../../root.navigator';
import { AppRoute } from '../../app-routes';
import { AddCustomerImageScreen, CustomerProfileScreen } from '../../../screens/customer/drawer';

type CustomerProfileDrawerNavigatorParams = RootNavigatorParams & {
    [AppRoute.CUSTOMER_PROFILE]: undefined;
    [AppRoute.ADD_CUSTOMER_IMAGE]: undefined;
}

export interface CustomerProfileScreenProps {
    navigation: StackNavigationProp<CustomerProfileDrawerNavigatorParams, AppRoute.CUSTOMER_PROFILE>;
    route: RouteProp<CustomerProfileDrawerNavigatorParams, AppRoute.CUSTOMER_PROFILE>;
}

export interface AddCustomerImageScreenProps {
    navigation: StackNavigationProp<CustomerProfileDrawerNavigatorParams, AppRoute.ADD_CUSTOMER_IMAGE>;
    route: RouteProp<CustomerProfileDrawerNavigatorParams, AppRoute.ADD_CUSTOMER_IMAGE>;
}

const Stack = createStackNavigator<CustomerProfileDrawerNavigatorParams>();

export const CustomerProfileDrawerNavigator = (): React.ReactElement => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name={AppRoute.CUSTOMER_PROFILE} component={CustomerProfileScreen} />
        <Stack.Screen name={AppRoute.ADD_CUSTOMER_IMAGE} component={AddCustomerImageScreen} />
    </Stack.Navigator>
);
