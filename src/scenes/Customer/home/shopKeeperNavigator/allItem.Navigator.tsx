import React from 'react';
import {
    CompositeNavigationProp,
    RouteProp,
} from '@react-navigation/core';
import {
    createStackNavigator,
    StackNavigationProp,
} from '@react-navigation/stack';
import { EmployeeTabNavigationProp } from '../home.navigator';
import { AppRoute } from '../app-routes';
import { AllItemScreen, ProductDetailScreen, CartScreen } from '../../scenes/shopkeeper/allItem';

type AllItemNavigatorParams = {
    [AppRoute.ALLITEM]: undefined;
    [AppRoute.PRODUCT_DETAIL]: undefined;
    [AppRoute.CART]: undefined;
}

export interface AllItemScreenProps {
    navigation: CompositeNavigationProp<
        EmployeeTabNavigationProp,
        StackNavigationProp<AllItemNavigatorParams, AppRoute.ALLITEM>
    >;
    route: RouteProp<AllItemNavigatorParams, AppRoute.ALLITEM>;
}

export interface ProductDetailScreenProps {
    navigation: CompositeNavigationProp<
        EmployeeTabNavigationProp,
        StackNavigationProp<AllItemNavigatorParams, AppRoute.PRODUCT_DETAIL>
    >;
    route: RouteProp<AllItemNavigatorParams, AppRoute.PRODUCT_DETAIL>;
}

export interface CartScreenProps {
    navigation: CompositeNavigationProp<
        EmployeeTabNavigationProp,
        StackNavigationProp<AllItemNavigatorParams, AppRoute.CART>
    >;
    route: RouteProp<AllItemNavigatorParams, AppRoute.CART>;
}

const Stack = createStackNavigator<AllItemNavigatorParams>();

export const AllItemNavigator = (): React.ReactElement => (
    <Stack.Navigator initialRouteName={AppRoute.ALLITEM} headerMode='none'>
        <Stack.Screen name={AppRoute.ALLITEM} component={AllItemScreen} />
        <Stack.Screen name={AppRoute.PRODUCT_DETAIL} component={ProductDetailScreen} />
        <Stack.Screen name={AppRoute.CART} component={CartScreen} />
    </Stack.Navigator>
);
