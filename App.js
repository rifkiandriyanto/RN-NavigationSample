import React from 'react';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import MovieList from './src/components/screens/movieList';
import DetailMovie from './src/components/screens/detailMovie';

const AppNavigator = createStackNavigator({
  Home: MovieList,
  Detail: DetailMovie,
});

const AppContainer = createAppContainer(AppNavigator);

function App() {
  console.disableYellowBox = true
  return (
      <AppContainer />
  );
}
export default App;
