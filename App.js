/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Button,
  Dimensions,
  NativeModules
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import Video from 'react-native-video';

class App extends React.Component {

  videoPlayer;

  constructor(props) {
      super(props);
      this.state = {
        isFullScreen: false,
        paused: true,
        screenType: 'stretch',
        buttonPlayState: true,
        buttonPauseState: false,
        buttonStopState: false,
        isMediaPaused: false,
        isMediaStopped: true
      };
      this.enableSDK();
  }

  configure = (options) => {
      NativeModules.BrightDiagnosticsNative.configure(options)
  }

  enableSDK = () => {
      NativeModules.BrightDiagnosticsNative.enableSDK();
  }

  disableSDK = () => {
      NativeModules.BrightDiagnosticsNative.disableSDK();
  }

  streamDefaultProperties = (session, accoundId, userId) => {
      NativeModules.BrightDiagnosticsNative.streamDefaultProperties(session, accoundId, userId);
  }

  createStream = (streamId, reqBitrate, sessionId, accountId, userId) => {
      NativeModules.BrightDiagnosticsNative.createStream(streamId, reqBitrate, sessionId, accountId, userId);
  }

  readyToPlay = (actualBitrate, cdn) => {
      NativeModules.BrightDiagnosticsNative.readyToPlay(actualBitrate, cdn);
  }

  recordEvent = (brtEvent) => {
      NativeModules.BrightDiagnosticsNative.recordEvent(brtEvent);
  }

  setRequestedBitrate = (requestedBitrate) => {
      NativeModules.BrightDiagnosticsNative.setRequestedBitrate(requestedBitrate);
  }

  setActualBitrate = (actualBitrate) => {
      NativeModules.BrightDiagnosticsNative.setActualBitrate(actualBitrate);
  }

  setLaunchType = (type) => {
      NativeModules.BrightDiagnosticsNative.setLanuchType(type);
  }

  setContentType = (type) => {
      NativeModules.BrightDiagnosticsNative.setContentType(type);
  }

  recordError = (error) => {
      NativeModules.BrightDiagnosticsNative.recordError(error);
  }

  finish = (error) => {
      NativeModules.BrightDiagnosticsNative.finish(error);
  }

  buttonsState = (button) => {
      switch(button) {
          case "play":
              this.setState({buttonPlayState: false,
                buttonPauseState: true,
                buttonStopState: true});
              break;
          case "pause":
              this.setState({buttonPlayState: true,
                buttonPauseState: false,
                buttonStopState: true});
              break;
          case "stop":
              this.setState({buttonPlayState: true,
                buttonPauseState: false,
                buttonStopState: false});
              break;
      }
  }

  onReadyForDisplay = () => {
      this.readyToPlay(1500, "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4");
  }

  onEnd = () => {
      this.finish("Video ended");
  }

  onBuffer = () => {
    this.recordEvent(8);
  }

  onSeek = () => {
  this.recordEvent(7);
  }

  onError = () => {
    console.log("video onError");
  }

render() {
  return (
      <View style={{flex: 1 ,flexDirection: 'column', justifyContent: 'center', alignItems: 'stretch',}}>
        <View style={{flex: 2}}>
          <Video
            ref={videoPlayer => (this.videoPlayer = videoPlayer)}
            resizeMode={this.state.screenType}
            onFullScreen={this.state.isFullScreen}
            source={{uri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', type: 'mp4' }}
            style={{
              width: Dimensions.get('window').width,
              height: 300,
            }}
            paused={this.state.paused}
            onReadyForDisplay={this.onReadyForDisplay}
            onBuffer={this.onBuffer}
            onSeek={this.onSeek}
            onError={this.onError}
            onEnd={this.onEnd} />
          </View>
        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center'}}>
          <Button
            onPress={() => {
              this.setState({paused: false, isMediaPaused: false})
              this.buttonsState("play")
              if (this.state.isMediaPaused) {
                  this.recordEvent(4);
              } else if (this.state.isMediaStopped) {
                  this.createStream("streamId", 2000, "sessionId", "accoundId", "userId");
                  this.setState({isMediaStopeed: false})
              }
            }}
            title="Play"
            disabled={!this.state.buttonPlayState}
          />
          <Button
            onPress={() => {
              this.setState({paused: true, isMediaPaused: true})
              this.buttonsState("pause")
              this.recordEvent(2);
            }}
            title="Pause"
            disabled={!this.state.buttonPauseState}
          />
          <Button
            onPress={() => {
              this.finish("User stopped video");
              this.buttonsState("stop")
              this.videoPlayer.seek(0);
              this.setState({paused: true, isMediaPaused: false, isMediaStopped: true})
            }}
            title="Stop"
            disabled={!this.state.buttonStopState}
          />
        </View>
      </View>
  );
}
};

export default App;
