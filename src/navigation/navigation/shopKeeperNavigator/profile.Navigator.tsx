import React from 'react';
import {
    RouteProp,
} from '@react-navigation/core';
import {
    createStackNavigator,
    StackNavigationProp,
} from '@react-navigation/stack';
import { AppRoute } from '../app-routes';
import { AddProfileImageScreen, AdminProfileScreen } from '../../scenes/shopkeeper/home';

type ProfileDrawerNavigatorParams = {
    [AppRoute.PROFILE]: undefined;
    [AppRoute.ADD_IMAGE]: undefined;
}

export interface MyOrderScreenProps {
    navigation: StackNavigationProp<ProfileDrawerNavigatorParams, AppRoute.PROFILE>;
    route: RouteProp<ProfileDrawerNavigatorParams, AppRoute.PROFILE>;
}

export interface ImageUploadScreenProps {
    navigation: StackNavigationProp<ProfileDrawerNavigatorParams, AppRoute.ADD_IMAGE>;
    route: RouteProp<ProfileDrawerNavigatorParams, AppRoute.ADD_IMAGE>;
}

const Stack = createStackNavigator<ProfileDrawerNavigatorParams>();

export const ProfileDrawerNavigator = (): React.ReactElement => (
    <Stack.Navigator headerMode='none'>
        <Stack.Screen name={AppRoute.PROFILE} component={AdminProfileScreen} />
        <Stack.Screen name={AppRoute.ADD_IMAGE} component={AddProfileImageScreen} />
    </Stack.Navigator>
);
