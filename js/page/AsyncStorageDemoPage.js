/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Button, Platform, StyleSheet, Text, View,TextInput,AsyncStorage} from 'react-native';
import actions from "../action";
import {connect} from "react-redux";



type Props = {};
const KEY='save_key';
class AsyncStorageDemoPage extends Component<Props> {
  constructor(props){
    super(props);
    this.state={
      showText:'1'
    }
  }
  componentDidMount(): void {

  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>AsyncStorageDemoPage</Text>
        <TextInput
          style={styles.input}
          onChangeText={text=>{
            this.value=text
          }}
        />
        <View style={styles.inputContainer}>
          <Text onPress={()=>{
            this.doSave()
          }}>存储</Text>
          <Text onPress={()=>{
            this.doRemove()
          }}>删除</Text>
          <Text onPress={()=>{
            this.getData()
          }}>获取</Text>
        </View>
        <Text>{this.state.showText}</Text>
      </View>
    );
  }
  async doSave(){
    //用法一
    AsyncStorage.setItem(KEY,this.value,error => {
      error &&console.log(error.toString());
    });

    //用法二
    AsyncStorage.setItem(KEY,this.value)
      .catch(error => {
        error &&console.log(error.toString());
      });
    // 用法三
    try {
      await  AsyncStorage.setItem(KEY,this.value);
    }catch (error) {
      error &&console.log(error.toString());
    }
  }
  doRemove(){
    //也有三个方法
    AsyncStorage.removeItem(KEY,error => {
      error &&console.log(error.toString());
    })
  }
  getData(){
    AsyncStorage.getItem(KEY,error => {
      error &&console.log(error.toString());
    })
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  input:{
    height:30,
    borderColor:'black',
    borderWidth:1,
    marginRight:10
  },
  inputContainer:{
    flexDirection:'row',
    alignItems: 'center',
    justifyContent:'space-around'
  }

});

const mapStateToProps=state=>({

});
const mapDispatchToProps=dispatch=>({
  onThemeChange:theme=>dispatch(actions.onThemeChange(theme))
});
export default connect(mapStateToProps,mapDispatchToProps)(AsyncStorageDemoPage)
