/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

var ReactNative = require('react-native')
var React = require('react')
var Icon = require('react-native-vector-icons/Ionicons')
var Button = require('react-native-button')
var CountDown = require('react-native-sk-countdown').CountDownText


var request = require('../common/request')

var StyleSheet = ReactNative.StyleSheet
var Text = ReactNative.Text
var View = ReactNative.View
var TextInput = ReactNative.TextInput

// import React, { Component } from 'react';
// import {
//   AppRegistry,
//   StyleSheet,
//   Text,
//   View
// } from 'react-native';

var Login = React.createClass({
  getInitialState() {
    return {
      verifyCode: '',
      phoneNumber: '',
      codeSent: false
    }
  },

  _showVerifyCode() {
    this.setState({
      codeSent: true
    })
  },

  _sendVerifyCode() {
    var phoneNumber = this.state.phoneNumber

    if (!phoneNumber) {
      return AlertIOS.alert('phoneNumber cant be empty')
    }

    var body = {
      phoneNumber: phoneNumber
    }

    var signupURL = config.api.base + config.api.signup

    request.post(signupURL, body)
      .then((data) => {
        if (data && data.success) {
          that._showVerifyCode()
        } else {
          AlertIOS.alert('failed to get Verified Code, please verify if the code is correct')
        }
      })
      .catch((err) => {
        AlertIOS.alert('please check the network')
      })
  },

  _submit() {
    var that = this
    var phoneNumber = this.state.phoneNumber
    var verifyCode = this.state.verifyCode

    if (!phoneNumber || !verifyCode) {
      return AlertIOS.alert('phoneNumber or verifyCode cant be empty')
    }

    var body = {
      phoneNumber: phoneNumber,
      verifyCode: verifyCode
    }

    var verifyURL = config.api.base + config.api.verify

    request.post(verifyURL, body)
      .then((data) => {
        if (data && data.success) {
          that.props.afterLogin(data.data)
          console.log('login ok')
          console.log(data)
        } else {
          AlertIOS.alert('failed to get Verified Code, please verify if the code is correct')
        }
      })
      .catch((err) => {
        AlertIOS.alert('please check the network')
      })
  },

  render: function() {
    return (
      <View style={styles.container}>
        <View style={styles.signupBox}>
          <Text style={styles.title}>quickLogin</Text>
          <TextInput
            placeholder='input phoneNumber'
            autoCaptialize={'none'}
            autoCorrect={false}
            keyboardType={'number-pad'}
            style={styles.inputField}
            onChangeText={(text) => {
              this.setState({
                phoneNumber: text
              })
            }}
          />

          {
            this.state.codeSent
            ? <View style={styles.verifyCodeBox}>
                <TextInput
                placeholder='input verifiedCode'
                autoCaptialize={'none'}
                autoCorrect={false}
                keyboardType={'number-pad'}
                style={styles.inputField}
                onChangeText={(text) => {
                  this.setState({
                    verifiedCode: text
                  })
                }}
                />

                {
                  this.state.countingDone
                  ? <Button 
                    style={styles.countBtn}
                    onPress={this._sendVerifyCode}>getCode</Button>
                  : <CountDown
                      style={styles.countBtn}
                      countType='seconds' // 计时类型：seconds / date
                      auto={true} // 自动开始
                      afterEnd={() => {}} // 结束回调
                      timeLeft={10} // 正向计时 时间起点为0秒
                      step={-1} // 计时步长，以秒为单位，正数则为正计时，负数为倒计时
                      startText='获取验证码' // 开始的文本
                      endText='获取验证码' // 结束的文本
                      intervalText={(sec) => sec + '秒重新获取'} // 定时的文本回调
                    />
                }
            </View>
            : null
          }

          {
            this.state.codeSent
            ? <Button
              style={styles.btn}
              onPress={this._submit}>login</Button>
            : <Button
              style={styles.btn}
              onPress={this._sendVerifyCode}>getVerfiedCode</Button>
          }
        </View>
      </View>
    )
  }
})

var styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f9f9f9',
  },

  signupBox: {
    marginTop: 30
  },

  title: {
    marginBottom: 20,
    color: '#333',
    fontSize: 20,
    textAlign: 'center'
  },

  inputField: {
    flex: 1,
    height: 40,
    padding: 5,
    color: '#666',
    fontSize: 16,
    backgroundColor: '#fff',
    borderRadius: 4
  },

  verifyCodeBox: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },

  countBtn: {
    width: 110,
    height: 40,
    padding: 10,
    marginLeft: 8,
    color: '#fff',
    backgroundColor: '#ee735c',
    borderColor: '#ee735c',
    textAlign: 'left',
    fontWeight: '600',
    fontSize: 15,
    borderRadius: 2
  }

  btn: {
    marginTop: 10,
    padding: 10,
    backgroundColor: 'transparent',
    borderColor: '#ee735c',
    borderWidth: 1,
    borderRadius: 4,
    color: '#ee735c'
  }
})

module.exports = Login