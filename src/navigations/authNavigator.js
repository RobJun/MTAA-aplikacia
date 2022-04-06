import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginValidator from '../screens/login'
import RegisterValidator from '../screens/register'



const stack = createStackNavigator()

export default function AuthNavigator() {
    return (
        <stack.Navigator screenOptions={{headerShown:false}}>
            <stack.Screen
                name="Login"
                component={LoginValidator}
            ></stack.Screen>
            <stack.Screen
            name="Register"
            component={RegisterValidator}>
            </stack.Screen>
        </stack.Navigator>
    );
  }