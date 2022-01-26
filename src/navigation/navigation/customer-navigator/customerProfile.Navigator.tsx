import React from 'react';
import {
    RouteProp,
} from '@react-navigation/core';
import {
    createStackNavigator,
    StackNavigationProp,
} from '@react-navigation/stack';
import { AppRoute } from '../app-routes';
import { AddProfileImageScreen, } from '../../scenes/shopkeeper/home';
import { AddCustomerImageScreen, CustomerProfileScreen } from '../../scenes/Customer/home';

type CustomerProfileDrawerNavigatorParams = {
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
    <Stack.Navigator headerMode='none'>
        <Stack.Screen name={AppRoute.CUSTOMER_PROFILE} component={CustomerProfileScreen} />
        <Stack.Screen name={AppRoute.ADD_CUSTOMER_IMAGE} component={AddCustomerImageScreen} />
    </Stack.Navigator>
);
