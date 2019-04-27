/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Button, Platform, StyleSheet, Text, View,TextInput} from 'react-native';
import actions from "../action";
import {connect} from "react-redux";



type Props = {};
class FetchDemoPage extends Component<Props> {
  constructor(props){
    super(props);
    this.state={
      showText:'1'
    }
  }
  componentDidMount(): void {

  }
  loadData(){
            let url = `https://api.github.com/search/repositories?q=${this.value}`;
            console.log(url);
            this.dataStore.fetchData(url)
                .then(data => {
                      let showData = `初次数据加载时间：${new Date(data.timestamp)}\n${JSON.stringify(data.data)}`;
                      this.setState({
                            showText: showData
                      })
                  })
                .catch(error => {
                      error && console.log(error.toString());
                  })
  }


  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>FetchDemoPage</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            onChangeText={text=>{
              this.searchKey=text
            }}
          />
          <Button title={'获取'} onPress={()=>{
            this.loadData();
          }}/>
        </View>
        <Text>{this.state.showText}</Text>
      </View>
    );
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
    flex:1,
    borderColor:'black',
    borderWidth:1,
    marginRight:10
  },
  inputContainer:{
    flexDirection:'row',
    alignItems: 'center',
  }

});

const mapStateToProps=state=>({

});
const mapDispatchToProps=dispatch=>({
  onThemeChange:theme=>dispatch(actions.onThemeChange(theme))
});
export default connect(mapStateToProps,mapDispatchToProps)(FetchDemoPage)
