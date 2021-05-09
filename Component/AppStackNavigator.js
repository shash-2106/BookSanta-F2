import React from 'react';
import {createStackNavigator} from 'react-navigation-stack';
import BookDonateScreen from '../screens/BookDonateScreen';
import ReceiverDetailsScreen from '../screens/ReceiverDetailsScreens';
export const AppStackNavigator = createStackNavigator({BookDonateList:{screen:BookDonateScreen,navigationOptions:{headerShown:false}},
ReceiverDetails:{screen:ReceiverDetailsScreen,navigationOptions:{headerShown:false}}},
{initialRouteName:'BookDonateList'})