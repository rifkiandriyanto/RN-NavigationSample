import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import axios from 'axios';

class DetailMovie extends React.Component {
  static navigationOptions = { header: null }
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.navigation.getParam('id'),
      base_url: 'https://api.themoviedb.org/3/tv/',
      image_url: 'https://image.tmdb.org/t/p/w500/',
      poster_url: 'https://image.tmdb.org/t/p/w185',
      seasons: [],
      backdrop_path: '',
      original_name: '',
      overview: '',
    };
  }
  componentDidMount() {
    this.getMovie();
  }

  getMovie = () => {
    axios
      .get(
        this.state.base_url +
          this.state.id +
          '?api_key=3ce403f6811be9928b4421dcb5193690',
      )
      .then(response => {
        const {backdrop_path, original_name, overview, seasons} = response.data;
        this.setState({
          backdrop_path,
          original_name,
          overview,
          seasons,
        });
      })
      .catch(error => console.log(error));
  };

  renderRow = ({item}) => {
    return (
      <>
        <View style={Styles.header}>
          <View>
            <Image
              source={{uri: this.state.poster_url + item.poster_path}}
              style={Styles.image}
            />
          </View>
          <View style={{marginLeft: 8, flex: 1}}>
            <Text style={{fontWeight: 'bold', fontSize: 18}}> {item.name}</Text>
            <Text style={{fontSize: 16, fontWeight: '500'}}>
              {item.air_date ? item.air_date.substr(0, 4) : null}
              {item.episode_count} Episode
            </Text>
            <Text>{item.overview}</Text>
          </View>
        </View>
      </>
    );
  };

  render() {
    return (
      <>
     
          <View style={Styles.button}>
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <Image
                source={require('../icons/back.png')}
                style={{height: 25, width: 20}}
              />
            </TouchableOpacity>
          </View>
          <View style={{flex: 1}}>
            <View>
              <Image
                source={{uri: this.state.image_url + this.state.backdrop_path}}
                style={{width: '100%', height: 250, resizeMode: 'stretch'}}
              />
            </View>

            <View style={{padding: 10}}>
              <Text
                style={{fontSize: 24, fontWeight: 'bold', marginBottom: 10}}>
                {this.state.original_name}
              </Text>
              <Text>{this.state.overview}</Text>
            </View>
            <View style={{paddingHorizontal: 5}}>
              <Text style={{paddingLeft: 5, fontSize: 20, fontWeight: 'bold'}}>
                Season
              </Text>
            </View>

            <FlatList
              style={{paddingHorizontal: 5}}
              data={this.state.seasons}
              renderItem={this.renderRow}
              showsVerticalScrollIndicator={false}
              keyExtractor={item => item.id.toString()}
            />
          </View>
        
      </>
    );
  }
}

const Styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    borderBottomColor: '#ccc',
    borderBottomWidth: 2,
    padding: 5,
    position: 'relative',
  },
  image: {
    width: 100,
    height: 140,
    resizeMode: 'stretch',
  },
  button: {
    position: 'absolute',
    left: 15,
    top: 15,
    zIndex: 2,
  },
});

export default DetailMovie;
