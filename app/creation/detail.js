var ReactNative = require('react-native')
var React = require('react')
import Icon from 'react-native-vector-icons/Ionicons'
var Video = require('react-native-video').default
var Button = require('react-native-button')
var config = require('../common/config')
var request = require('../common/request')

var StyleSheet = ReactNative.StyleSheet
var Text = ReactNative.Text
var View = ReactNative.View
var ListView = ReactNative.ListView
var Image = ReactNative.Image
var Modal = ReactNative.Modal
var AlertIOS = ReactNative.AlertIOS
var TouchableOpacity = ReactNative.TouchableOpacity
var Dimensions = ReactNative.Dimensions
var TextInput = ReactNative.TextInput
var width = Dimensions.get('window').width
var ActivityIndicatorIOS = ReactNative.ActivityIndicatorIOS

// import React, { Component } from 'react';
// import {
//   AppRegistry,
//   StyleSheet,
//   Text,
//   View
// } from 'react-native';

var cachedResults = {
  nextPage: 1,
  items: [],
  total: 0
}

var Detail = React.createClass({
  getInitialState() {
    var data = this.props.data
    var ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    })

    return {
      data: data,

      //comments
      dataSource: ds.cloneWithRows([]),

      // video loads
      videoOk: true,
      videoLoaded: false,
      playing: false,
      paused: false,
      videoProgress: 0.01,
      videoTotal: 0,
      currentTime: 0,

      //modal
      content: '',
      animationType: 'none',
      modalVisible: false,
      isSending: false,

      //video player
      rate: 1,
      muted: false,
      resizeMode: 'contain',
      repeat: false
    }
  },

  _pop() {
    this.props.navigator.pop()
  },

  _onLoadStart() {
    console.log('load start')
  },

  _onLoad() {
    console.log('load')
  },

  _onProgress(data) {
    if (!this.state.videoLoaded) {
      this.setState({
        videoLoaded: true
      })
    }

    var duration = data.playableDuration
    var currentTime = data.currentTime
    var percent = Number((currentTime / duration).toFixed(2))
    var newState ={
      videoTotal: duration,
      currentTime: Number(data.currentTime.toFixed(2)),
      videoProgress: percent
    }

    if (!this.state.videoLoaded) {
      newState.videoLoaded = true
    }
    if (!this.state.playing) {
      newState.playing = true
    }

    this.setState(newState)

    console.log(data)
    console.log('progress')
  },

  _onEnd() {
    this.setState({
      videoProgress: 1,
      playing: false
    })

    console.log('end')
  },

  _onError(e) {
    this.setState({
      videoOk: false
    })
    console.log(e)
    console.log('error')
  },

  _rePlay() {
    this.refs.videoPlayer.seek(0)
  },

  _pause() {
    if (!this.state.paused) {
      this.setState({
        paused: true
      })
    }
  },

  _resume() {
    if (this.state.paused) {
      this.setState({
        paused: true
      })
    }
  },

  componentDidMount() {
    this._fetchData()
  },

  _fetchData: function (page){
    var that = this

    this.setState({
      isLoadingTail: true
    })

    request.get(config.api.base + config.api.comment, {
      creation: 124,
      accessToken: '123a'
      page: page
    })
      .then((data) => {
        if (data.success) {
          var items = cachedResults.items.slice()

          items = items.concat(data.data)
          cachedResults.nextPage += 1
          cachedResults.items = items
          cachedResults.total = data.total

          that.setState({
            isLoadingTail: false,
            dataSource: this.state.dataSource.cloneWithRows(cachedResults.items)
          })
        }
      })
      .catch((error) => {
        this.setState({
          isLoadingTail: false
        })
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

  _renderRow(row) {
    return (
      <View key={row._id} style={styles.replyBox}>
        <Image style={styles.replyAvatar} source={{uri: row.replyBy.avatar}} 
        />
          <View style={styles.reply}>
            <Text style={styles.replyNickname}>{row.replyBy.nickname}</Text>
            <Text style={styles.replyContent}>{row.content}</Text>
          </View>
      </View>
    )
  },

  _focus() {
    this._setModalVisible(true)
  },

  _blur() {

  },

  _closeModal() {
    this._setModalVisible(false)
  },

  _setModalVisible() {
    this.setState({
      modalVisible: isVisible
    })
  },

  _renderHeader() {
    var data = this.state.data

    return (
      <View style={styles.listHeader}>
        <View style={styles.infoBox}>
          <Image style={styles.avatar} source={{uri: data.author.avatar}} 
        />
          <View style={styles.descBox}>
            <Text style={styles.nickname}>{data.author.nickname}</Text>
            <Text style={styles.title}>{data.title}</Text>
          </View>
        </View>
        <View style={styles.commentBox}>
          <View style={styles.comment}>
            <Text>comment one</Text>
            <TextInput
              placeholder="like the dog"
              style={styles.content}
              multiline={true}
              onFocus={this._focus}
            />
        </View>
      </View>

      <View style={styles.commentArea}>
        <Text style={styles.commentTitle}>nice comment</Text>
      </View>
    )
  },

  _submit() {
   var that = this
   if (!this.state.content) {
    return AlertIOS.alert('comment cant be null')
   }

   if (this.state.isSending) {
    return AlertIOS.alert('is commenting')
   }

   this.setState({
    isSending: true
   }, function() {
    var body = {
      accessToken: 'abc',
      creation: '1323',
      content: this.state.content
    }

    var url = config.api.base + config.api.comment

    request.post(url, body)
      .then(function(data) {
        if (data && data.success) {
          var items = cachedResults.items.slice()
          var content = that.state.content

          items = [{
            content: content,
            content: that.state.content,
            replyBy: {
              avatar: '',
              nickname: 'dogsay'
            }
          }].concat(items)

          cachedResults.items = items
          cachedResults.total = cachedResults.total + 1

          that.setState({
            content: '',
            isSending: false,
            dataSource: that.state.dataSource.cloneWithRows(
              cachedResults.items)
          })

          that._setModalVisible(false)
        }
      })
      .catch((err) => {
        console.log(err)
        that.setState({
          isSending: false
        })
        that._setModalVisible(false)
        AlertIOS.alert('comment fails, try again')
      })
   })
  },

  render: function() {
    var data = this.props.data
    console.log(data)

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBox} onPress={this._pop}>
            <Icon name='ios-arrow-back' style={styles.backIcon} />
            <Text style={styles.backText}>back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>videoDetail</Text>
        </View>
        <Text onPress={this._backToList}>Detail Page</Text>
        <View style={styles.videoBox}>
          <Video
            ref='videoPlayer'
            source={{uri: data.video}}
            style={styles.video}
            volume={5}
            paused={this.state.paused}
            rate={this.state.rate}
            muted={this.state.muted}
            resizeMode={this.state.resizeMode}
            repeat={this.state.repeat}

            onLoadStart={this._onLoadStart}
            onLoad={this._onLoad}
            onProgress={this._onProgress}
            onEnd={this._onEnd}
            onError={this._onError}
          />

          {
            !this.state.videoOk && <Text style={styles.failText}>
              video error!</Text>
          }

          {
            !this.state.videoLoaded && <ActivityIndicatorIOS color='#ee735c' style={styles.loading} />
          }

          {
            this.state.videoLoaded && !this.state.playing
            ? <Icon
                onPress={this._rePlay}
                name='ios-play'
                size={48}
                style={styles.playIcon} />
            : null
          }

          {
            this.state.videoLoaded && this.state.playing
            ? <TouchableOpacity onPress={this._pause} style={styles.pauseBtn}>
            {
              this.state.paused
              ? <Icon onPress={this._resume} size={48} name='ios-play' style={styles.resumeIcon} />
              : <Text></Text>
            }
            </TouchableOpacity>
            : null
          }

          <View style={styles.progressBox}>
            <View style={[styles.progressBar, {width: width * this.state.videoProgress}]}></View>
        </View>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this._renderRow}
          renderHeader={this._renderHeader}
          renderFooter={this._renderFooter}
          onEndReached={this._fetchMoreData}
          onEndReachedThreshold={20}
          enableEmptySections={true}
          showsVerticalScrollIndicator={false}
          automaticallyAdjustContentInsets={false}
        />

        <Modal
          animationType={'fade'}
          visible={this.state.modalVisible}
          onRequestClose={() => {this._setModalVisible(false)}}>
          <View style={styles.modalContainer}>
            <Icon
              onPress={this._closeModal}
              name='ios-close-outline'
              style={styles.closeIcon} 
            />
            <View style={styles.commentBox}>
              <View style={styles.comment}>
                <TextInput
                  placeholder='comment one'
                  style={styles.content}
                  multiline={true}
                  defaultValue={this.state.content}
                  onChangeText={(text) => {
                    this.setState({
                      content: text
                    })
                  }}
                />
              </View>
            </View>
            <Button style={styles.submitBtn} onPress={this._submit}>comment</Button>
          </View>
        </Modal>
    )
  }
})

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF'
  },

  modalContainer: {
    flex: 1,
    paddingTop: 45,
    backgroundColor: '#fff'
  },

  closeIcon: {
    alignSelf: 'center',
    fontSize: 30,
    color: '#rr753c'
  },

  submitBtn: {
    width: width - 20,
    padding: 16,
    marginTop: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ee735c',
    borderRadius: 4,
    fontSize: 18,
    color: '#ee753c'
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: width,
    height: 64,
    paddingTop: 20,
    paddingLeft: 10,
    paddingRight: 10,
    borderBottomWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    backgroundColor: '#fff'
  },

  backBox: {
    position: 'absolute',
    left: 12,
    top: 32,
    width: 50,
    flexDirection: 'row',
    alignItems: 'center'
  },

  headerTitle: {
    width: width - 120,
    textAlign: 'center'
  },

  backIcon: {
    color: '#999',
    fontSize: 20,
    marginRight: 5
  }

  backText: { 
    color: '#999'
  },

  videoBox: {
    width: width,
    height: width * 0.56,
    backgroundColor: '#000'
  },

  video: {
    width: width,
    height: width * 0.56,
    backgroundColor: '#000'
  },

  failText: {
    position: 'absolute',
    left: 0,
    top: 90,
    width: width,
    textAlign: 'center',
    color: '#fff',
    backgroundColor: 'transparent'
  },

  loading: {
    position: 'absolute',
    left: 0,
    top: 80,
    width: width,
    alignSelf: 'center',
    backgroundColor: 'transparent'
  },

  progressBox: {
    width: width,
    height: 2,
    backgroundColor: '#ccc'
  },

  progressBar: {
    width: 1,
    height: 2,
    backgroundColor: '#ff6600'
  },

  playIcon: {
    position: 'absolute',
    top: 90,
    left: width / 2 - 30,
    width: 60,
    height: 60,
    paddingTop: 8,
    paddingLeft: 22,
    backgroundColor: 'transparent',
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 30,
    color: '#ed7b66'
  },

  pauseBtn: {
    position: 'absolute',
    left: 0,
    top: 0,
    width:width,
    height: 360
  },

  resumeIcon: {
    position: 'absolute',
    top: 80,
    left: width / 2 - 30,
    width: 60,
    height: 60,
    paddingTop: 8,
    paddingLeft: 22,
    backgroundColor: 'transparent',
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 30,
    color: '#ed7b66'
  },

  infoBox: {
    width: width,
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10
  },

  avatar: {
    width: 60,
    height: 60,
    marginRight: 10,
    borderRadius: 30
  },

  descBox: {
    flex: 1
  },

  nickname: {
    fontSize: 18
  },

  title: {
    marginTop: 8,
    fontSize: 16,
    color: '#666'
  },

  replyBox: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 10
  },

  replyAvatar: {
    width: 40,
    height: 40,
    marginRight: 10,
    marginLeft: 10,
    borderRadius: 20
  },

  replyNickname: {
    color: '#666'
  },

  replyContent: {
    marginTop: 4,
    color: '#666'
  },

  reply: {
    flex: 1
  }，

  loadingMore: {
    marginVertical: 20
  },

  loadingText: {
    color: '#777',
    textAlign: 'center'
  },

  listHeader: {
    width: width,
    marginTop: 10
  }

  commentBox: {
    marginTop: 10,
    marginBottom: 10,
    padding: 8,
    width: width
  },

  content: {
    paddingLeft: 2,
    color: '#333',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    fontSize: 14,
    height: 80
  },

  commentArea: {
    width: width,
    paddingBottom: 6,
    paddingLeft: 10,
    paddingRight: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  }
})

module.exports = Detail