/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View,BackHandler} from 'react-native';
import NavigationUtil from "../navigator/NavigationUtil";
import {NavigationActions} from 'react-navigation';
import BackPressComponent from '../common/BackPressComponent';

import DynamicTabNavigators from '../navigator/DynamicTabNavigators';
import actions from "../action";
import {connect} from "react-redux";

type Props = {};

class HomePage extends Component<Props> {
  constructor(props){
    super(props);
    this.backPress=new BackPressComponent({backPress:this.onBackPress()});
  }
  componentDidMount() {
    this.backPress.componentDidMount();
  }

  componentWillUnmount() {
    this.backPress.componentWillUnmount();
  }

  /**
   * 处理 Android 中的物理返回键
   * https://reactnavigation.org/docs/en/redux-integration.html#handling-the-hardware-back-button-in-android
   * @returns {boolean}
   */
  onBackPress = () => {
    const {dispatch, nav} = this.props;
    //if (nav.index === 0) {
    if (nav.routes[1].index === 0) {//如果RootNavigator中的MainNavigator的index为0，则不处理返回事件
      return false;
    }
    dispatch(NavigationActions.back());
    return true;
  };

  render() {
    NavigationUtil.navigation=this.props.navigation;
    return <DynamicTabNavigators />
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
  nav:state.nav
});

export default connect(mapStateToProps)(HomePage)
