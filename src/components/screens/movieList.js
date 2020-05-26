import React from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TextInput,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import DateGenerator from '../helpers/dateGenerator';
class MovieList extends React.Component {
  static navigationOptions = {header: null};

  constructor(props) {
    super(props);
    this.state = {
      notFilteredData: [],
      data: [],
      base_url:
        'https://api.themoviedb.org/3/tv/popular?api_key=3ce403f6811be9928b4421dcb5193690',
      img_url: 'https://image.tmdb.org/t/p/w185',
      page: 1,
      isFetching: false,
      isLoading: true,
      loadMore: false,
      search: '',
    };
  }

  componentDidMount() {
    this.getMovie();
  }

  getMovie = () => {
    axios
      .get(this.state.base_url + '&page=' + this.state.page)
      .then(response => {
        let newData;
        if (this.state.page === 1) {
          newData = response.data.results;
        } else {
          newData = this.state.data.concat(response.data.results);
        }
        this.setState({
          notFilteredData: newData,
          data: newData,
          isLoading: false,
          loadMore: false,
        });
      })
      .catch(error => {
        console.log(error());
      });
  };

  handleRefresh = () => {
    this.setState({isFetching: true, isLoading: true, page: 1}, this.getMovie);
    this.setState({isFetching: false});
  };

  HandleLoadMore = () => {
    this.setState({page: this.state.page + 1, loadMore: true}, this.getMovie);
  };

  handleSearch = text => {
    let newData = this.state.notFilteredData.filter(preData => {
      return preData.original_name.toLowerCase().match(text.toLowerCase());
    });
    this.setState({search: text, data: newData});
  };

  renderRow = ({item}) => {
    return (
      <>
        <TouchableOpacity
          onPress={() =>
            this.props.navigation.navigate('Detail', {id: item.id})
          }>
          <View style={Styles.card}>
            <Image
              source={{uri: this.state.img_url + item.backdrop_path}}
              style={Styles.imageItem}
            />
            <View style={{justifyContent: 'space-between', marginLeft: 8}}>
              <Text style={{fontWeight: 'bold', fontSize: 18}}>
                {item.original_name}
              </Text>
              <Text style={{fontSize: 16}}>
                <DateGenerator date={item.first_air_date} />
              </Text>
            </View>
            <View stye={Styles.vote}>
              <Text style={{color: 'white', fontWeight: 'bold'}}>
                {item.vote_average}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </>
    );
  };

  renderFooter = () => {
    if (this.state.loadMore) {
      return (
        <ActivityIndicator
          size="large"
          color="#169016"
          style={{alignSelf: 'center', marginTop: 10}}
        />
      );
    } else {
      return null;
    }
  };

  render() {
    return (
      <>
        <View style={Styles.container}>
          <View style={Styles.header}>
            <Text style={Styles.tittle}>Streaming Movies</Text>
            <TextInput
              placeholder="Search any movie..."
              value={this.state.search}
              onChangeText={text => this.handleSearch(text)}
              style={Styles.input}
            />
          </View>
          <View style={{flex: 1}}>
            {this.state.isLoading ? (
              <ActivityIndicator
                size="large"
                color="#169016"
                style={{alignSelf: 'center', flex: 1}}
              />
            ) : (
              <FlatList
                style={{paddingHorizontal: 1}}
                data={this.state.data}
                renderItem={this.renderRow}
                keyExtractor={item => item.id.toString()}
                onRefresh={this.handleRefresh}
                refreshing={this.state.isFetching}
                onEndReached={this.HandleLoadMore}
                onEndReachedThreshold={0.0001}
                ListFooterComponent={this.renderFooter}
              />
            )}
          </View>
        </View>
      </>
    );
  }
}

const Styles = StyleSheet.create({
  imageItem: {width: 100, height: 55},
  container: {backgroundColor: '#fff', flex: 1},
  header: {alignItems: 'center', paddingHorizontal: 10},
  tittle: {paddingVertical: 25, fontSize: 16, fontWeight: 'bold'},
  input: {
    backgroundColor: '#eee',
    width: '100%',
    marginBottom: 30,
    borderRadius: 5,
    textAlign: 'center',
    alignItems: 'center',
  },
  vote: {
    position: 'absolute',
    right: 5,
    bottom: 5,
    backgroundColor: '#169016',
    minWidth: 27,
    alignItems: 'center',
    borderRadius: 3,
  },
  card: {
    flexDirection: 'row',
    flex: 1,
    borderBottomColor: '#ccc',
    borderBottomWidth: 2,
    position: 'relative',
    padding: 5,
  },
});
export default MovieList;
