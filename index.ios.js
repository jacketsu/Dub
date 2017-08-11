/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

var ReactNative = require('react-native')
var React = require('react')


var AppRegistry = ReactNative.AppRegistry
var StyleSheet = ReactNative.StyleSheet
var Text = ReactNative.Text
var View = ReactNative.View
var TabBarIOS = ReactNative.TabBarIOS
var NavigatorIOS = ReactNative.NavigatorIOS

// import React, { Component } from 'react';
// import {
//   AppRegistry,
//   StyleSheet,
//   Text,
//   View
// } from 'react-native';

var List = require('./app/creation/index')
var Edit = require('./app/edit/index')
var Account = require('./app/account/index')


var dogDubApp = React.createClass({
  getInitialState: function() {
    console.log('child', 'getInitialState')
    return {
      selectedTab: 'list'
    }
  },

  _renderContent: function(color: string, pageText: string, num?: number) {
    return (
      <View style={[styles.tabContent, {backgroundColor: color}]}>
        <Text style={styles.tabText}>{pageText}</Text>
        <Text style={styles.tabText}>{num} re-renders of the {pageText}</Text>
      </View>
    );
  },

  render: function() {
    return (
      <TabBarIOS
        tintColor="#ee735c">
        <TabBarIOS.Item
          icon={require('./static/images/camera.png')}
          title="Camera"
          selected={this.state.selectedTab === 'list'}
          onPress={() => {
            this.setState({
              selectedTab: 'list',
            });
          }}>
          <NavigatorIOS
            initialRoute={{
              name: 'list',
              component: List
            }}
            configureScene={(route) => {
              return NavigatorIOS.SceneConfigs.FloatFromRight
            }}
            renderScene={(route, navigator) => {
              var Component = route.component

              return <Component {...route.params} navigator={navigator}
                />
            }}
          />
        </TabBarIOS.Item>
        <TabBarIOS.Item
          icon={require('./static/images/video.png')}
          title="Video"
          badge={this.state.notifCount > 0 ? this.state.notifCount : undefined}
          selected={this.state.selectedTab === 'edit'}
          onPress={() => {
            this.setState({
              selectedTab: 'edit',
              notifCount: this.state.notifCount + 1,
            });
          }}>
          <Edit />
        </TabBarIOS.Item>
        <TabBarIOS.Item
          icon={require('./static/images/more.png')}
          title="More"
          selected={this.state.selectedTab === 'account'}
          onPress={() => {
            this.setState({
              selectedTab: 'account',
              presses: this.state.presses + 1
            });
          }}>
          <Account />
        </TabBarIOS.Item>
      </TabBarIOS>
    )
  },

})

var styles = StyleSheet.create({
  tabContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    color: 'white',
    margin: 50,
  },
})

AppRegistry.registerComponent('dogDubApp', () => dogDubApp);
