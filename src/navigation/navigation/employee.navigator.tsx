import React from 'react';
import {
    CompositeNavigationProp,
    RouteProp,
} from '@react-navigation/core';
import {
    createStackNavigator,
    StackNavigationProp,
} from '@react-navigation/stack';
import { EmployeeTabNavigationProp } from './home.navigator';
import { AppRoute } from './app-routes';
import { EmployeeScreen, AddEmployeeScreen, AttendanceScreen, EditEmployeeScreen } from '../scenes/shopkeeper/Employee';
// import { ProfileScreen, EditProfileScreen, ResumeScreen, AddAchivementScreen, AddEducationScreen, AddCertificateScreen, AddExperienceScreen, LogoutScreen } from '../scenes/profile';

type EmployeeNavigatorParams = {
    [AppRoute.EMPLOYEE]: undefined; 
    [AppRoute.ADDEMPLOYEE]: undefined; 
    [AppRoute.EDIT_EMPLOYEE]: undefined; 
    [AppRoute.ATTENDANCE]: undefined; 
      
}

export interface EmployeeScreenProps {
    navigation: CompositeNavigationProp<
    EmployeeTabNavigationProp,
        StackNavigationProp<EmployeeNavigatorParams, AppRoute.EMPLOYEE>
    >;
    route: RouteProp<EmployeeNavigatorParams, AppRoute.EMPLOYEE>;
}

export interface AddEmployeeScreenProps {
    navigation: CompositeNavigationProp<
    EmployeeTabNavigationProp,
        StackNavigationProp<EmployeeNavigatorParams, AppRoute.ADDEMPLOYEE>
    >;
    route: RouteProp<EmployeeNavigatorParams, AppRoute.ADDEMPLOYEE>;
}

export interface EditEmployeeScreenProps {
    navigation: CompositeNavigationProp<
    EmployeeTabNavigationProp,
        StackNavigationProp<EmployeeNavigatorParams, AppRoute.EDIT_EMPLOYEE>
    >;
    route: RouteProp<EmployeeNavigatorParams, AppRoute.EDIT_EMPLOYEE>;
}

export interface AttendanceScreenProps {
    navigation: CompositeNavigationProp<
    EmployeeTabNavigationProp,
        StackNavigationProp<EmployeeNavigatorParams, AppRoute.ATTENDANCE>
    >;
    route: RouteProp<EmployeeNavigatorParams, AppRoute.ATTENDANCE>;
}

const Stack = createStackNavigator<EmployeeNavigatorParams>();

export const EmployeeNavigator = (): React.ReactElement => (
    <Stack.Navigator headerMode='none'>
        <Stack.Screen name={AppRoute.EMPLOYEE} component={EmployeeScreen} />        
         <Stack.Screen name={AppRoute.ADDEMPLOYEE} component={AddEmployeeScreen} />        
         <Stack.Screen name={AppRoute.EDIT_EMPLOYEE} component={EditEmployeeScreen} />     
         <Stack.Screen name={AppRoute.ATTENDANCE} component={AttendanceScreen} />     
    </Stack.Navigator>
);
