/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {connect} from 'react-redux';
import actions from '../action/index';
import {Platform,DeviceInfo,ActivityIndicator, StyleSheet, Text, View,Button,FlatList,RefreshControl} from 'react-native';
import {createMaterialTopTabNavigator,createAppContainer} from "react-navigation";
import NavigationUtil from '../navigator/NavigationUtil';
import PopularItem from '../common/PopularItem';
import Toast from 'react-native-easy-toast';
import NavigationBar from '../common/NavigationBar';

const URL='https://api.github.com/search/repositories?q=';
const QUERY_STR='&sort=stars';
const THEME_COLOR='#678';
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
        screen:props=><PopularTabPage {...props} tabLabel={item}/>,//形式传参数
        navigationOptions:{
          title:item,
        }
      }
    });
    return tabs;
  }
  componentDidMount(): void {

  }



  render() {
    let statusBar={
      backgroundColor:THEME_COLOR,
      barStyle:'light-content'
    };
    let navigationBar=<NavigationBar
      title={'最热'}
      statusBar={statusBar}
      style={{backgroundColor:THEME_COLOR}}

    />;
    const TabNavigator=createAppContainer(createMaterialTopTabNavigator(
        this._genTabs(),{
          tabBarOptions:{
            tabStyle:styles.tabStyle,
            upperCaseLabel:false,//是否标签进行大写 默认为true
            scrollEnabled:true, //滚动选项卡
            style:{
              backgroundColor:'#678',//改变背景色
              height:30//fix 开启scrollEnabled后在android上初次加载时闪烁问题
            },
            indicatorStyle:styles.indicatorStyle,//指示器样式
            labelStyle:styles.labelStyle,//文字样式
          }
      }
    ));
    return (
      <View style={{flex:1,marginTop:DeviceInfo.isIPhoneX_deprecated?30:0}}>
        {navigationBar}
        <TabNavigator/>
      </View>
    );
  }
}
const pageSize=10;//设置为常量  防止修改
 class PopularTab extends Component<Props> {
  constructor(props){
    super(props);
    console.log(this.props);
    const {tabLabel}=this.props;
    this.storeName=tabLabel;
  }
  componentDidMount(): void {
    this.loadData();
  }
   loadData(loadMore){
    const {onRefreshPopular,onLoadMorePopular}=this.props;
    const store=this._store();
    const url=this.genFetchUrl(this.storeName);
    if(loadMore){
      onLoadMorePopular(this.storeName,++store.pageIndex,pageSize,store.items,(str)=>{
        console.log('没有更多了');
          this.toast.show('没有更多了');
      });
    }else{
      onRefreshPopular(this.storeName,url,pageSize);
    }

   }
   _store(){
    const {popular}=this.props;
    console.log(this.storeName);
    let store=popular[this.storeName];
    console.log(popular);
    console.log(store);
    if(!store){
      store={
        items:[],
        isLoading: false,
        projectModes:[],//要显示的数据
        hideLoadingMore:true,//默认隐藏加载更多
      }
    }
    return store;
   }
   genFetchUrl(key){
    return URL+key+QUERY_STR;
   }
   renderItem(data){
    const item=data.item;
    return <PopularItem item={item} onSelect={()=>{
      NavigationUtil.goPage({
        projectModes: item
      },'DetailPage')
    }
    }/>
   }
   genIndicator(){
      return this._store().hideLoadingMore?null:
        <View style={styles.indicatorContainer}>
          <ActivityIndicator style={styles.indicator}/>
          <Text>正在加载更多</Text>
        </View>
   }
   render() {

    let store=this._store();
    return (
      <View style={styles.container}>
        <FlatList renderItem={(data)=>this.renderItem(data)} data={store.projectModes}  keyExtractor={item=>''+item.id}
          refreshControl={
            <RefreshControl title={'Loading'} titleColor={THEME_COLOR}
                            colors={[THEME_COLOR]}
                            refreshing={store.isLoading}
                            onRefresh={() => this.loadData()}
                            tintColor={THEME_COLOR}
            />
          }
          ListFooterComponent={()=>this.genIndicator()}
          onEndReached={()=>{
            setTimeout(()=>{
              if(this.canLoadMore){
                this.loadData(true);
                this.canLoadMore=false;
              }
            },100)
          }}
          onEndReachedThreshold={0.5}
          onMomentumScrollBegin={()=>{
            this.canLoadMore=true;
          }}
        />
        <Toast ref={toast=>this.toast=toast}
          position={'center'}
        />
      </View>
    );
  }
}
const mapStateToProps=state=>({
  popular:state.popular
});

const mapDispatchToProps=dispatch=>({
  onRefreshPopular: (storeName,url,pageSize)=>dispatch(actions.onRefreshPopular(storeName,url,pageSize)),
    onLoadMorePopular: (storeName,pageIndex,pageSize,item,callBack)=>dispatch(actions.onLoadMorePopular(storeName,pageIndex,pageSize,item,callBack)),
});
const PopularTabPage=connect(mapStateToProps,mapDispatchToProps)(PopularTab);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabStyle:{
    // minWidth: 50
    padding:0
  },
  indicatorStyle:{
    height:2,
    backgroundColor: '#fff'
  },
  labelStyle:{
    fontSize:13,
    margin: 0
  },
  indicatorContainer:{
    alignItems:'center'
  },
  indicator:{
    color:'red',
    margin:10
  }


});
