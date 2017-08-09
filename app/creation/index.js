/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

var ReactNative = require('react-native')
var React = require('react')
import Icon from 'react-native-vector-icons/Ionicons'

var StyleSheet = ReactNative.StyleSheet
var Text = ReactNative.Text
var View = ReactNative.View
var ListView = ReactNative.ListView
var TouchableHighlight = ReactNative.TouchableHighlight
var Image = ReactNative.Image
var Dimensions = ReactNative.Dimensions

var width = Dimensions.get('window').width
// import React, { Component } from 'react';
// import {
//   AppRegistry,
//   StyleSheet,
//   Text,
//   View
// } from 'react-native';

var List = React.createClass({
  getInitialState: function() {
	var ds = new ListView.DataSource({
		rowHasChanged: (r1, r2) => r1 !== r2
	})

	return {
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
  
  renderRow: function(row) {
  	return (
	  	<TouchableHighlight>
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
					    	name='ios-heart-outline'
					    	size={28}
					    	style={styles.up}
					    />
	  					<Text style={styles.handleText}>like</Text>
	  				</View>
	  				<View style={styles.handleBox}>
	  					<Icon
					    	name='ios-chatbubbles-outline'
					    	size={28}
					    	style={styles.commentIcon}
					    />
	  					<Text style={styles.handleText}>comment</Text>
	  				</View>
	  			</View>

	  		</View>
	  	</TouchableHighlight>
	)
  },

  render: function() {
    return (
      <View style={styles.container}>
      	<View style={styles.header}>
      		<Text style={styles.headerTitle}>List Page</Text>
      	</View>
      	<ListView
      		dataSource={this.state.dataSource}
      		renderRow={this.renderRow}
      		enableEmptySections={true}
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

  up: {
  	fontSize: 22,
  	color: '#333'
  },

  commentIcon: {
  	fontSize: 22,
  	color: '#333'
  }
  
})

module.exports = List