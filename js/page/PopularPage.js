/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View,Button} from 'react-native';
import {createMaterialTopTabNavigator,createAppContainer} from "react-navigation";
import NavigationUtil from '../navigator/NavigationUtil';


type Props = {};
export default class PopularPage extends Component<Props> {
  constructor(props){
    super(props);
    this.tabNames=['java','Android','IOS','React','React Native','PHP'];

  }
  _genTabs(){
    const tabs={};
    this.tabNames.forEach((item,index)=>{
      tabs[`tab${index}`]={
        screen:props=><PopularTab {...props} tabLabel={item}/>,//形式传参数
        navigationOptions:{
          title:item,
        }
      }
    })
    return tabs;
  }
  componentDidMount(): void {

  }



  render() {
    const TabNavigator=createAppContainer(createMaterialTopTabNavigator(
        this._genTabs(),{
          tabBarOptions:{
            tabStyle:styles.tabStyle,
            upperCaseLabel:false,//是否标签进行大写 默认为true
            scrollEnabled:true, //滚动选项卡
            style:{
              backgroundColor:'#678',//改变背景色
            },
            indicatorStyle:styles.indicatorStyle,//指示器样式
            labelStyle:styles.labelStyle,//文字样式
          }
      }
    ));
    return (
      <View style={{flex:1,marginTop:30}}>
        <TabNavigator/>
      </View>
    );
  }
}

 class PopularTab extends Component<Props> {
  render() {
    const {tabLabel}=this.props;
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>{tabLabel}</Text>
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
    marginTop: 30
  },
  tabStyle:{
    minWidth: 50
  },
  indicatorStyle:{
    height:2,
    backgroundColor: '#fff'
  },
  labelStyle:{
    fontSize:13,
    marginTop:6,
    marginBottom:6
  }


});
