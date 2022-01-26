import React from 'react';
import { RouteProp } from '@react-navigation/core';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';
import { AppRoute } from './app-routes';
import { AppNavigatorParams } from './app.navigator';
import {
  UserDecide
} from '../scenes/auth';

type UserDecideNavigatorParams = AppNavigatorParams & {
  [AppRoute.USER_LOG_IN]: undefined;
}

export interface UserDecideProps {
  navigation: StackNavigationProp<UserDecideNavigatorParams, AppRoute.USER_LOG_IN>;
  route: RouteProp<UserDecideNavigatorParams, AppRoute.USER_LOG_IN>;
}

const Stack = createStackNavigator<UserDecideNavigatorParams>();

export const UserDecideNavigator = (): React.ReactElement => (
  <Stack.Navigator headerMode='none'>
    <Stack.Screen name={AppRoute.USER_LOG_IN} component={UserDecide}/>
  </Stack.Navigator>
);
