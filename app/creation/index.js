/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

var ReactNative = require('react-native')
var React = require('react')

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
        "_id":"35000019800424355X","thumb":"http://dummyimage.com/1200x600/d4d299)","video_address":"http://www.imooc.com/video/10427"
    }
    ,
    {
        "_id":"650000199306250486","thumb":"http://dummyimage.com/1200x600/390620)","video_address":"http://www.imooc.com/video/10427"
    }]),
	}
  },
  
  renderRow: function(row) {
  	return (
	  	<TouchableHighlight>
	  		<View style={styles.item}>
	  			<Text style={styles.title}>{row._id}</Text>
	  			<Image
	  				source={{uri: row.thumb}}
	  				style={styles.thumb}
	  			>
	  				<Image
				      style={styles.play}
				      source={require('../.././static/images/play.png')}
				    />
	  			</Image>
	  			<View style={styles.itemFooter}>
	  				<View style={styles.handleBox}>
	  					<Image
					      style={styles.up}
					      source={require('../.././static/images/like.png')}
					    />
	  					<Text style={styles.handleText}>like</Text>
	  				</View>
	  				<View style={styles.handleBox}>
	  					<Image
					      style={styles.commentIcon}
					      source={require('../.././static/images/comments.png')}
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