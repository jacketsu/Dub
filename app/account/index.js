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

// import React, { Component } from 'react';
// import {
//   AppRegistry,
//   StyleSheet,
//   Text,
//   View
// } from 'react-native';

var Account = React.createClass({
  render: function() {
    return (
      <View style={styles.container}>
        <Text>Account Page</Text>
      </View>
    )
  }
})

var styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5FCFF',
  },
  header: {
    paddingTop: 25,
  }
})

module.exports = Account