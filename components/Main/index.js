import React from 'react'
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StyleSheet, Text, View } from 'react-native';
import Header from '../Header'
import Home from '../Home'
import TaskDetails from '../TaskItem/TaskDetails';
import Footer from '../Footer'

const Main = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="TaskDetails" component={TaskDetails} />
    </Stack.Navigator>
  )
}

export default Main