import React from 'react';
import { RouteProp } from '@react-navigation/core';
import {
    createStackNavigator,
    StackNavigationProp,
} from '@react-navigation/stack';
import { AppRoute } from '../app-routes';
import { AppNavigatorParams } from '../app.navigator';
import { CustomerOrderScreen, CustomerOrderDetailScreen } from '../../scenes/Customer/home';

type CustomerOrderNavigatorParams = AppNavigatorParams & {
    [AppRoute.CUSTOMER_ORDER]: undefined;
    [AppRoute.CUSTOMER_ORDER_DETAIL]: undefined;
}

export interface CustomerOrderScreenProps {
    navigation: StackNavigationProp<CustomerOrderNavigatorParams, AppRoute.CUSTOMER_ORDER>;
    route: RouteProp<CustomerOrderNavigatorParams, AppRoute.CUSTOMER_ORDER>;
}

export interface CustomerOrderDetailScreenProps {
    navigation: StackNavigationProp<CustomerOrderNavigatorParams, AppRoute.CUSTOMER_ORDER_DETAIL>;
    route: RouteProp<CustomerOrderNavigatorParams, AppRoute.CUSTOMER_ORDER_DETAIL>;
}

const Stack = createStackNavigator<CustomerOrderNavigatorParams>();

export const CustomerOrderNavigator = (): React.ReactElement => (
    <Stack.Navigator headerMode='none' initialRouteName={AppRoute.CUSTOMER_ORDER}>
        <Stack.Screen name={AppRoute.CUSTOMER_ORDER} component={CustomerOrderScreen} />
        <Stack.Screen name={AppRoute.CUSTOMER_ORDER_DETAIL} component={CustomerOrderDetailScreen} />
    </Stack.Navigator>
);
