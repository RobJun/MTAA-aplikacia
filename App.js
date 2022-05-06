/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import React from 'react';
import { NetworkProvider } from 'react-native-offline';
import GlobProvider from './src/context/globContext';
import  AppContainer from './src/navigations'


export default function App() {
  return ( <NetworkProvider>
            <GlobProvider>
              <AppContainer></AppContainer>
            </GlobProvider>
          </NetworkProvider>)
}
