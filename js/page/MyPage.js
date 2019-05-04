/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Button, Platform, StyleSheet, Text, View} from 'react-native';
import NavigationUtil from "../navigator/NavigationUtil";



type Props = {};
export default class MyPage extends Component<Props> {
  constructor(props){
    super(props);
  }
  componentDidMount(): void {

  }



  render() {
    const {navigation}=this.props;
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>MyPage</Text>
        <Button title={'改变主题颜色'} onPress={()=>{
          navigation.setParams({
            theme:{
              tintColor: 'blue',
              updateTime: new Date().getTime()
            }
          })
        }}/>
        <Text onPress={()=>{
          NavigationUtil.goPage({},'DetailPage')
        }}>跳转到详情页</Text>
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
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },

});
