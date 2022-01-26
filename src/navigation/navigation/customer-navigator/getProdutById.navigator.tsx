import React from 'react';
import { RouteProp } from '@react-navigation/core';
import {
    createStackNavigator,
    StackNavigationProp,
} from '@react-navigation/stack';
import { AppRoute } from '../app-routes';
import { AppNavigatorParams } from '../app.navigator';
import { SearchProductScreen, CustomerOrderDetailScreen } from '../../scenes/Customer/home';
import { CustProductDetailScreen1 } from '../../scenes/Customer/allProduct';

type CustomerOrderNavigatorParams = AppNavigatorParams & {
    [AppRoute.GET_PRODUCT]: undefined;
    [AppRoute.SEARCH_PRODUCT_DETAIL]: undefined;
}

export interface SearchProductScreennProps {
    navigation: StackNavigationProp<CustomerOrderNavigatorParams, AppRoute.GET_PRODUCT>;
    route: RouteProp<CustomerOrderNavigatorParams, AppRoute.GET_PRODUCT>;
}

export interface SearchProductDetailScreenProps {
    navigation: StackNavigationProp<CustomerOrderNavigatorParams, AppRoute.SEARCH_PRODUCT_DETAIL>;
    route: RouteProp<CustomerOrderNavigatorParams, AppRoute.SEARCH_PRODUCT_DETAIL>;
}

const Stack = createStackNavigator<CustomerOrderNavigatorParams>();

export const GetProductByIdNavigator = (): React.ReactElement => (
    <Stack.Navigator headerMode='none' initialRouteName={AppRoute.CUSTOMER_ORDER}>
        <Stack.Screen name={AppRoute.GET_PRODUCT} component={SearchProductScreen} />
        <Stack.Screen name={AppRoute.SEARCH_PRODUCT_DETAIL} component={CustProductDetailScreen1} />
    </Stack.Navigator>
);
