import React from 'react';
import {
  CompositeNavigationProp,
  RouteProp,
} from '@react-navigation/core';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';
import {
  createMaterialTopTabNavigator,
  MaterialTopTabBarProps,
  MaterialTopTabNavigationProp,
} from '@react-navigation/material-top-tabs';
import { TodoTabNavigationProp } from './home.navigator';
import { AppRoute } from './app-routes';
import {
  TodoDetailsRouteParams,
  TodoDetailsScreen,
  TodoDoneScreen,
  TodoInProgressScreen,
  TodoTabBar,
} from '../scenes/todo';
import {AccountsScreen} from '../scenes/home'
import {
  DoneAllIcon,
  GridIcon,
} from '../assets/icons';
import {ExpertListScreens} from '../scenes/todo'

type TodoNavigatorParams = {
  [AppRoute.TODO]: undefined;
  [AppRoute.TODO_DETAILS]: TodoDetailsRouteParams;
  [AppRoute.EXPERTLIST]: ExpertListScreens;
}

type TodoTabsNavigatorParams = {
  [AppRoute.TODO_IN_PROGRESS]: undefined;
  [AppRoute.TODO_DONE]: undefined;
}

export type TodoScreenProps = MaterialTopTabBarProps & {
  navigation: TodoTabNavigationProp;
}

export interface TodoInProgressScreenProps {
  navigation: CompositeNavigationProp<TodoTabNavigationProp,
    MaterialTopTabNavigationProp<TodoTabsNavigatorParams, AppRoute.TODO_IN_PROGRESS>>;
  route: RouteProp<TodoTabsNavigatorParams, AppRoute.TODO_IN_PROGRESS>;
}

export interface TodoDoneScreenProps {
  navigation: CompositeNavigationProp<TodoTabNavigationProp,
    MaterialTopTabNavigationProp<TodoTabsNavigatorParams, AppRoute.TODO_DONE>>;
  route: RouteProp<TodoTabsNavigatorParams, AppRoute.TODO_DONE>;
}

export interface TodoDetailsScreenProps {
  navigation: StackNavigationProp<TodoNavigatorParams, AppRoute.TODO_DETAILS>;
  route: RouteProp<TodoNavigatorParams, AppRoute.TODO_DETAILS>;
}

export interface ExpertListScreensProps {
  navigation: StackNavigationProp<TodoNavigatorParams, AppRoute.EXPERTLIST>;
  route: RouteProp<TodoNavigatorParams, AppRoute.EXPERTLIST>;
}

const Stack = createStackNavigator<TodoNavigatorParams>();
const TopTab = createMaterialTopTabNavigator<TodoTabsNavigatorParams>();

// FIXME: Is it possible to track swipe progress?
// In this case, it's needed to synchronize tab-bar indicator in TodoScreen
//
// Currently I have set `swipeEnabled` to `false` just for saving navigation consistence
//
// Btw, it's not possible to use `@react-navigation/material-top-tabs
// without `react-native-tab-view` even if you use custom `tabBarComponent`
//
// Anyway, it's possible to create top tab navigation with gesture support with UI Kitten `TabView`

const TodoTabsNavigator = (): React.ReactElement => (
  // @ts-ignore: `tabBar` also contains a DrawerNavigationProp & BottomTabNavigationProp

//   <Stack.Navigator headerMode='none'>
//   <Stack.Screen name={AppRoute.ACCOUNTS} component={AccountsScreen}/>
//   {/* <Stack.Screen name={AppRoute.ASK} component={AskScreen}/> */}
// </Stack.Navigator>

  <TopTab.Navigator tabBar={props => <TodoTabBar {...props} />}>
    <TopTab.Screen
      name={AppRoute.TODO_IN_PROGRESS}
      component={ExpertListScreens}
    />
    {/* <TopTab.Screen
      name={AppRoute.TODO_DONE}
      component={TodoDoneScreen}
      options={{ title: 'DONE', tabBarIcon: DoneAllIcon }}
    /> */}
  </TopTab.Navigator>
);

export const TodoNavigator = (): React.ReactElement => (
  <Stack.Navigator headerMode='none'>
    <Stack.Screen name={AppRoute.TODO} component={TodoTabsNavigator}/>
    <Stack.Screen name={AppRoute.TODO_DETAILS} component={TodoDetailsScreen}/>
    <Stack.Screen name={AppRoute.EXPERTLIST} component={ExpertListScreens}/>
  </Stack.Navigator>
);
