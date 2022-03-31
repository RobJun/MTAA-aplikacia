/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import React from 'react';
import GlobProvider from './src/context/globContext';
import  AppContainer from './src/navigations'


export default function App() {
  return ( <GlobProvider><AppContainer></AppContainer></GlobProvider>)
}
