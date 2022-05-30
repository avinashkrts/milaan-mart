import React from 'react';
import { RouteProp } from '@react-navigation/core';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';
import { RootNavigatorParams } from '../root.navigator';
import { AppRoute } from '../app-routes';
import { UserDecide } from '../../screens/auth';

type UserDecideNavigatorParams = RootNavigatorParams & {
  [AppRoute.USER_DECIDE_PAGE]: undefined;
}

export interface UserDecideProps {
  navigation: StackNavigationProp<UserDecideNavigatorParams, AppRoute.USER_DECIDE_PAGE>;
  route: RouteProp<UserDecideNavigatorParams, AppRoute.USER_DECIDE_PAGE>;
}

const Stack = createStackNavigator<UserDecideNavigatorParams>();

export const UserDecideNavigator = (): React.ReactElement => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name={AppRoute.USER_DECIDE_PAGE} component={UserDecide}/>
  </Stack.Navigator>
);
