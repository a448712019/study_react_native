/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import {createStackNavigator,BottomTabBar,createAppContainer,createBottomTabNavigator} from "react-navigation";
import PoplarPage from '../page/PopularPage';
import FavoritePage from '../page/FavoritePage';
import MyPage from '../page/MyPage';
import TrendingPage from '../page/TrendingPage';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import NavigationUtil from "../navigator/NavigationUtil";
import {connect} from 'react-redux';

type Props = {};
const TABS={//在这里配置页面的路由
  PoplarPage:{
    screen:PoplarPage,
    navigationOptions:{
      tabBarLabel:'最热',
      tabBarIcon:({tintColor,focused})=>(
        <MaterialIcons
          name={'whatshot'}
          size={26}
          style={{color:tintColor}}
        />
      )
    }
  },
  TrendingPage:{
    screen:TrendingPage,
    navigationOptions:{
      tabBarLabel:'趋势',
      tabBarIcon:({tintColor,focused})=>(
        <Ionicons
          name={'md-trending-up'}
          size={26}
          style={{color:tintColor}}
        />
      )
    }
  },
  FavoritePage:{
    screen:FavoritePage,
    navigationOptions:{
      tabBarLabel:'收藏',
      tabBarIcon:({tintColor,focused})=>(
        <MaterialIcons
          name={'favorite'}
          size={26}
          style={{color:tintColor}}
        />
      )
    }
  },
  MyPage:{
    screen:MyPage,
    navigationOptions:{
      tabBarLabel:'我的',
      tabBarIcon:({tintColor,focused})=>(
        <Entypo
          name={'user'}
          size={26}
          style={{color:tintColor}}
        />
      )
    }
  },
};
class DynamicTabNavigators extends Component<Props> {
  constructor(props){
    super(props);
  }
  _tabNavigator(){
    if(this.Tabs){
      return this.Tabs;
    }
    console.log(this.props);
    const {PoplarPage,TrendingPage,FavoritePage,MyPage} =TABS;
    const tabs={PoplarPage,TrendingPage,FavoritePage,MyPage};//根据需要定制显示的tab
    PoplarPage.navigationOptions.tabBarLabel='最热';//动态更新tab属性
    return this.Tabs = createAppContainer(createBottomTabNavigator(
      tabs,
      {
        tabBarComponent:(props)=>{
          console.log(props);
          console.log(this.props);
          return <TabBarComponent theme={this.props.theme} {...props}/>
        }

      }
    ));
  }
  render() {
    console.log(this.props.theme);
    const Tab=this._tabNavigator();
    return <Tab />
  }
}

class TabBarComponent extends Component{
  constructor(props){
    super(props);
    this.theme={
      tintColor: props.activeTintColor,
      updateTime:new Date().getTime(),
    }

  }
  render() {
    console.log(this.props);
    return <BottomTabBar
      {...this.props}
      activeTintColor={this.props.theme}

    />;
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
const mapStateToProps=state=>({
    theme:state.theme.theme
});
export default connect(mapStateToProps)(DynamicTabNavigators);
