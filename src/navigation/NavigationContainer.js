import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Entypo from "react-native-vector-icons/Entypo";
import FontAwesome from "react-native-vector-icons/FontAwesome";

import SplashScreen from '../modules/Auth/SplashScreen';

import { navigationRef } from '../context/NavigationContext';
import LandingScreen from '../modules/Auth/LandingScreen';
import SignUpScreen from '../modules/Auth/SignUpScreen';
import SignInScreen from '../modules/Auth/SignInScreen';
import OTPScreen from '../modules/Auth/OTPScreen';
import ForgotPassword from '../modules/Auth/ForgotPassword';
import ResetPassword from '../modules/Auth/ResetPassword';

import HomeScreen from "../modules/Home/HomeScreen";
import EventList from "../modules/Events/EventList";
import EventDetails from "../modules/Events/EventDetails";
import GameDetails from "../modules/Game/GameDetails";
import NewsDetails from "../modules/News/NewsDetails";
import VenueDetails from "../modules/Venues/VenueDetails";
import NewsScreen from "../modules/News/NewsScreen";
import VenueTypes from "../modules/Venues/VenueTypes";
import VenueList from "../modules/Venues/VenueList";
import MoreScreen from "../modules/More/MoreScreen";
import DownloadsScreen from "../modules/More/DownloadsScreen";
import MyProfileScreen from "../modules/More/MyProfile";
import NotificationScreen from "../modules/Notifications/NotificationScreen";

import BottomTabComponent from "../components/BottomTabComponent";

const Tab = createBottomTabNavigator();
const AuthStack = createNativeStackNavigator();
const AppStack = createNativeStackNavigator();
const HomeStack = createNativeStackNavigator();
const NewsStack = createNativeStackNavigator();
const VenuesStack = createNativeStackNavigator();
const MoreStack = createNativeStackNavigator();

const HomeNavigator = () => (
  <HomeStack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <HomeStack.Screen name="Home" component={HomeScreen} />
    <HomeStack.Screen name="EventList" component={EventList} />
    <HomeStack.Screen name="EventDetails" component={EventDetails} />
    <HomeStack.Screen name="GameDetails" component={GameDetails} />
    <HomeStack.Screen name="NewsDetails" component={NewsDetails} />
    <HomeStack.Screen name="VenueDetails" component={VenueDetails} />
    <HomeStack.Screen name="Notifications" component={NotificationScreen} />
  </HomeStack.Navigator>
);

const NewsNavigator = () => (
  <NewsStack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <NewsStack.Screen name="News" component={NewsScreen} />
    <NewsStack.Screen name="NewsDetails" component={NewsDetails} />
    <NewsStack.Screen name="EventDetails" component={EventDetails} />
    <NewsStack.Screen name="GameDetails" component={GameDetails} />
  </NewsStack.Navigator>
);

const VenuesNavigator = () => (
  <VenuesStack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <VenuesStack.Screen name="VenueTypes" component={VenueTypes} />
    <VenuesStack.Screen name="VenueList" component={VenueList} />
    <VenuesStack.Screen name="VenueDetails" component={VenueDetails} />
  </VenuesStack.Navigator>
);

const MoreNavigator = () => (
  <MoreStack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <MoreStack.Screen name="More" component={MoreScreen} />
    <MoreStack.Screen name="Downloads" component={DownloadsScreen} />
    <MoreStack.Screen name="MyProfile" component={MyProfileScreen} />
  </MoreStack.Navigator>
);

const AppContainer = () => {
  const { bottom } = useSafeAreaInsets();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        lazy: false,
        tabBarShowLabel: false,
        headerShown: false,
        tabBarActiveTintColor: "#062D5B",
        tabBarInactiveTintColor: '#7E7E7E',
        tabBarStyle: {
          height: 56 + bottom,
        },
        tabBarIconStyle: {
          paddingBottom: 3,
        },
        tabBarIcon: ({ focused, color }) => {
          let IconComponent = Entypo, IconName = "home", TabName = "Home";
          if (route.name === "HomeTab") {
            IconName = "home";
            TabName = "Home";
          } else if (route.name === "NewsTab") {
            IconComponent = FontAwesome;
            IconName = "newspaper-o";
            TabName = "News";
          } else if (route.name === "VenuesTab") {
            IconName = "location";
            TabName = "Venues";
          } else if (route.name === "MoreTab") {
            IconName = "menu";
            TabName = "More";
          }
          return (
            <BottomTabComponent
              size={24}
              name={IconName}
              tabName={TabName}
              focused={focused}
              Component={IconComponent}
              tintColor={color || "#062D5B"}
            />
          );
        },
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeNavigator} />
      <Tab.Screen name="NewsTab" component={NewsNavigator} />
      <Tab.Screen name="VenuesTab" component={VenuesNavigator} />
      <Tab.Screen name="MoreTab" component={MoreNavigator} />
    </Tab.Navigator>
  );
};

const AuthNavigator = () => {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <AuthStack.Screen name="Landing" component={LandingScreen} />
      <AuthStack.Screen name="SignUp" component={SignUpScreen} />
      <AuthStack.Screen name="SignIn" component={SignInScreen} />
      <AuthStack.Screen name="OTP" component={OTPScreen} />
      <AuthStack.Screen name="ForgotPassword" component={ForgotPassword} />
      <AuthStack.Screen name="ResetPassword" component={ResetPassword} />
    </AuthStack.Navigator>
  );
};

const NavContainer = () => {
  return (
    <NavigationContainer ref={navigationRef}>
      <AppStack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
        }}>
        <AppStack.Screen name="Splash" component={SplashScreen} />
        <AppStack.Screen name="LoginFlow" component={AuthNavigator} />
        <AppStack.Screen name="MainFlow" component={AppContainer} />
      </AppStack.Navigator>
    </NavigationContainer>
  );
};

export default NavContainer;
