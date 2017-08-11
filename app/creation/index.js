/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

var ReactNative = require('react-native')
var React = require('react')
import Icon from 'react-native-vector-icons/Ionicons'
var request = require('../common/request')
var config = require('../common/config')
var Detail = require('./detail')

var StyleSheet = ReactNative.StyleSheet
var Text = ReactNative.Text
var View = ReactNative.View
var ListView = ReactNative.ListView
var TouchableHighlight = ReactNative.TouchableHighlight
var Image = ReactNative.Image
var Dimensions = ReactNative.Dimensions
var RefreshControl = ReactNative.RefreshControl
var ActivityIndicatorIOS = ReactNative.ActivityIndicatorIOS
var AlertIOS = ReactNative.AlertIOS

var width = Dimensions.get('window').width

var cachedResults = {
	nextPage: 1,
	items: [],
	total: 0
}
// import React, { Component } from 'react';
// import {
//   AppRegistry,
//   StyleSheet,
//   Text,
//   View
// } from 'react-native';

var Item = React.createClass({
	getInitialState() {
		var row = this.props.row

		return {
			up: row.voted,
			row: row
		}
	},

	_up() {
		var that = this
		var up = !this.state.up
		var row = this.state.row
		var url = config.api.base + config.api.up

		var body = {
			id: row._id,
			up: up ? 'yes' : 'no',
			accessToken: 'abcee'
		}

		request.post(url, body)
			.then(function(data) {
				if (data && data.success) {
					that.setState({
						up: up
					})
				} else {
					AlertIOS.alert('up failed')
				}
			})
			.catch(function(err) {
				console.log(err)
				AlertIOS.alert('up failed')
			})
	},

	render() {
		var row = this.state.row

		return(
		  	<TouchableHighlight onPress={this.props.onSelect}>
		  		<View style={styles.item}>
		  			<Text style={styles.title}>{row.title}</Text>
		  			<Image
		  				source={{uri: row.thumb}}
		  				style={styles.thumb}
		  			>
		  				<Icon
					    	name='ios-play'
					    	size={28}
					    	style={styles.play}
					    />
		  			</Image>
		  			<View style={styles.itemFooter}>
		  				<View style={styles.handleBox}>
		  					<Icon
						    	name={this.state.up ? 'ios-heart' : 'ios-heart-outline'}
						    	size={28}
						    	style={[styles.up, this.state.up ? null : styles.down]}
						    />
		  					<Text style={styles.handleText} onPress={this._up}>like</Text>
		  				</View>
		  				<View style={styles.handleBox}>
		  					<Icon
						    	name='ios-chatbubbles-outline'
						    	size={28}
						    	onPress={this._up}
						    	style={styles.commentIcon}
						    />
		  					<Text style={styles.handleText}>comment</Text>
		  				</View>
		  			</View>
		  		</View>
		  	</TouchableHighlight>
		)
	}
})

var List = React.createClass({
  getInitialState: function() {
	var ds = new ListView.DataSource({
		rowHasChanged: (r1, r2) => r1 !== r2
	})

	return {
		isLoadingTail: false,
		isRefreshing: false,
	    dataSource: ds.cloneWithRows([{
        "_id":"230000199110204818","thumb":"https://facebook.github.io/react/img/logo_og.png","title":"测试内容y22c","video_address":"http://www.imooc.com/video/10427"
    }
    ,
    {
        "_id":"140000197605209812","thumb":"https://facebook.github.io/react/img/logo_og.png","title":"测试内容y22c","video_address":"http://www.imooc.com/video/10427"
    }
    ,
    {
        "_id":"140000197210217797","thumb":"https://facebook.github.io/react/img/logo_og.png","title":"测试内容y22c","video_address":"http://www.imooc.com/video/10427"
    }
    ,
    {
        "_id":"110000200606076811","thumb":"https://facebook.github.io/react/img/logo_og.png","title":"测试内容y22c","video_address":"http://www.imooc.com/video/10427"
    }
    ,
    {
        "_id":"810000197403180417","thumb":"https://facebook.github.io/react/img/logo_og.png","title":"测试内容y22c","video_address":"http://www.imooc.com/video/10427"
    }
    ,
    {
        "_id":"640000201201279635","thumb":"https://facebook.github.io/react/img/logo_og.png","title":"测试内容y22c","video_address":"http://www.imooc.com/video/10427"
    }]),
	} 
  },
  
  _renderRow: function(row) {
  	return <Item 
  		key={row._id} 
  		onSelect={() => this._loadPage(row)} 
  		row={row} />
  },

  componentDidMount: function() {
  	this._fetchData(1)
  },

  _fetchData: function (page){
  	var that = this

  	if (page !== 0) {
  		this.setState({
  			isLoadingTail: true
  		})
  	} else {
  		this.setState({
	  		isRefreshing: true
	  	})
  	}

    request.get(config.api.base + config.api.creations, {
      accessToken: 'a',
      page: page
    })
      .then((data) => {
      	if (data.success) {
      		var items = cachedResults.items.slice()

      		if (page !== 0) {
      			items = items.concat(data.data)
      			cachedResults.nextPage += 1
      		} else {
      			items = data.data.concat(items)
      		}

      		cachedResults.items = items
      		cachedResults.total = data.total

      		setTimeout(function() {
      			if (page !== 0) {
      				that.setState({
		      			isLoadingTail: false,
		      			dataSource: this.state.dataSource.cloneWithRows(cachedResults.items)
		      		})
      			} else {
      				that.setState({
		      			isRefreshing: false,
		      			dataSource: this.state.dataSource.cloneWithRows(cachedResults.items)
		      		})
      			}
	      	}, 20)
      	}
      })
      .catch((error) => {
      	if (page !== 0) {
      		this.setState({
      			isLoadingTail: false
      		})
      	} else {
      		this.setState({
      			isRefreshing: false
      		})
      	}
        console.error(error)
      })
  },

  _hasMore() {
  	return cachedResults.items.length !== cachedResults.total
  },

  _fetchMoreData() {
  	if (!this._hasMore() || this.state.isLoadingTail) {
  		return
  	}

  	var page = cachedResults.nextPage

  	this._fetchData(page)
  },

  _renderFooter() {
  	if (!this._hasMore() && cachedResults.total != 0) {
  		return (
  			<View style={styles.loadingMore}>
  				<Text style={styles.loadingText}>No more</Text>
  			</View>
  		)
  	}

  	if (!this.state.isLoadingTail) {
  		return <View style={styles.loadingMore} />
  	}

  	return <ActivityIndicatorIOS
  		style={[styles.centering, {height: 80}]}
  	/>
  },

  _loadPage(row) {
  	this.props.navigator.push({ 
  		name: 'detail',
  		component: Detail,
  		params: {
			row: row
  		}
  	})
  },
  
  _onRefresh() {
  	if (!this._hasMore() || this.state.isRefreshing) {
  		return
  	}

  	this._fetchData(0)
  },

  render: function() {
    return (
      <View style={styles.container}>
      	<View style={styles.header}>
      		<Text style={styles.headerTitle}>List Page</Text>
      	</View>
      	<ListView
      		dataSource={this.state.dataSource}
      		renderRow={this._renderRow}
      		renderFooter={this._renderFooter}
      		onEndReached={this._fetchMoreData}
      		refreshControl={
      			<RefreshControl
		           refreshing={this.state.isRefreshing}
		           onRefresh={this._onRefresh}
		           tintColor="#ff6600"
		           title="Loading..."
		        />
      		}
      		onEndReachedThreshold={20}
      		enableEmptySections={true}
      		showsVerticalScrollIndicator={false}
      		automaticallyAdjustContentInsets={false}
      	/>
      </View>
    )
  }
})

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },

  header: {
  	paddingTop: 25,
  	paddingBottom: 12,
  	backgroundColor: '#ee735c'
  },

  headerTitle: {
  	color: '#fff',
  	fontSize: 16,
  	textAlign: 'center',
  	fontWeight: '600'
  },

  item: {
  	width: width,
  	marginBottom: 10,
  	backgroundColor: '#fff'
  },

  thumb: {
  	width: width,
  	height: width * 0.5,
  	resizeMode: 'cover'
  },

  title: {
  	padding: 10,
  	fontSize: 18,
  	color: '#333'
  },

  itemFooter: {
  	flexDirection: 'row',
  	justifyContent: 'space-between',
  	backgroundColor: '#eee'
  },

  handleBox: {
  	padding: 10,
	flexDirection: 'row',
	width: width / 2 - 0.5,
	justifyContent: 'center',
	backgroundColor: '#fff'
  },

  play: {
  	position: 'absolute',
  	bottom: 14,
  	right: 14,
  	width: 46,
  	height: 46,
  	paddingTop: 9,
  	paddingLeft: 18,
  	backgroundColor: 'transparent',
  	borderColor: '#fff',
  	borderWidth: 1,
  	borderRadius: 23,
  	color: '#ed7b66'
  },

  handleText: {
  	paddingLeft: 12,
  	fontSize: 18,
  	color: '#333'
  },

  down: {
  	fontSize: 22,
  	color: '#333'
  },

  up: {
  	fontSize: 22,
  	color: '#ed7b66'
  },

  commentIcon: {
  	fontSize: 22,
  	color: '#333'
  },

  loadingMore: {
  	marginVertical: 20
  },

  loadingText: {
  	color: '#777',
  	textAlign: 'center'
  }  
})

module.exports = List