import React from 'react';
import {
    CompositeNavigationProp,
    RouteProp,
} from '@react-navigation/core';
import {
    createStackNavigator,
    StackNavigationProp,
} from '@react-navigation/stack';
import { BillBookTabNavigationProps } from './customerHome.navigator';
import { AppRoute } from '../app-routes';
import { CandidateScreen } from '../../scenes/hr/candidate'
import { BillBookScreen } from '../../scenes/Customer/billBook';
type BillBookNavigatorParams = {
    [AppRoute.BILL_BOOK]: undefined;
}

export interface BillBookScreenProps {
    navigation: CompositeNavigationProp<BillBookTabNavigationProps,
    StackNavigationProp<BillBookNavigatorParams, AppRoute.BILL_BOOK>>;
    route: RouteProp<BillBookNavigatorParams, AppRoute.BILL_BOOK>;
}


const Stack = createStackNavigator<BillBookNavigatorParams>();

export const BillBookNavigator = (): React.ReactElement => (
    <Stack.Navigator headerMode='none'>
        <Stack.Screen name={AppRoute.BILL_BOOK} component={BillBookScreen} />
    </Stack.Navigator>
);
