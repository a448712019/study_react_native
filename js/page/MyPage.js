/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Button, Platform, StyleSheet, Text, View,TouchableOpacity} from 'react-native';
import NavigationUtil from "../navigator/NavigationUtil";
import NavigationBar from '../common/NavigationBar';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';

const THEME_COLOR='#678';

type Props = {};
export default class MyPage extends Component<Props> {
  getRightButton(){
    return <View style={{flexDirection:'row'}}>
      <TouchableOpacity onPress={()=>{
      }
      }>
        <View style={{padding:5,marginRight:8}}>
          <Feather
            name={'search'}
            size={24}
            style={{color:'white'}}
          />
        </View>
      </TouchableOpacity>
    </View>
  }

  getLeftButton(callBack){
    return <TouchableOpacity
      style={{padding:8,paddingLeft:12}}
      onPress={callBack}
    >
      <Ionicons name={'ios-arrow-back'} size={26} style={{color:'white'}}/>
    </TouchableOpacity>
  }



  render() {
    let statusBar={
      backgroundColor: THEME_COLOR,
      barStyle:'light-content',
    };

    let navigationBar=
      <NavigationBar
        title={'我的'}
        statusBar={statusBar}
        style={{backgroundColor:THEME_COLOR}}
        rightButton={this.getRightButton()}
        leftButton={this.getLeftButton()}
      />;
    return (
      <View style={styles.container}>
        {navigationBar}
        <Text style={styles.welcome}>MyPage</Text>
        <Button title={'跳转到FetchDemoPage'} onPress={()=>{
          NavigationUtil.goPage({},'FetchDemoPage');
        }}/>

        <Button title={'跳转到AsyncStorageDemoPage'} onPress={()=>{
          NavigationUtil.goPage({},'AsyncStorageDemoPage');
        }}/>
        <Button title={'跳转到DataStoreDemoPage'} onPress={()=>{
          NavigationUtil.goPage({},'DataStoreDemoPage');
        }}/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop:30
    // justifyContent: 'center',
    // alignItems: 'center',
    // backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,

  },


});