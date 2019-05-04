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
import {
  Platform,
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Button,
  //发送事件 和接收事件
  DeviceEventEmitter,
  FlatList,
  RefreshControl,
  DeviceInfo
} from 'react-native';
import {createMaterialTopTabNavigator,createAppContainer} from "react-navigation";
import NavigationUtil from '../navigator/NavigationUtil';
import TrendingItem from '../common/TrendingItem';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Toast from 'react-native-easy-toast';
import NavigationBar from '../common/NavigationBar';
import TrendingDialog, {TimeSpans} from '../common/TrendingDialog';

const EVENT_TYPE_TIME_SPAN_CHANGE='EVENT_TYPE_TIME_SPAN_CHANGE';
const URL='https://github.com/trending/';
const QUERY_STR='&sort=stars';
const THEME_COLOR='#678';
type Props = {};
export default class TrendingPage extends Component<Props> {
  constructor(props){
    super(props);
    this.tabNames=['All','C','C#','PHP','JavaScript'];
    this.state={
      timeSpan:TimeSpans[0],
    }

  }
  _genTabs(){
    const tabs={};
    this.tabNames.forEach((item,index)=>{
      tabs[`tab${index}`]={
        screen:props=><TrendingTabPage {...props} timeSpan={this.state.timeSpan} tabLabel={item}/>,//形式传参数
        navigationOptions:{
          title:item,
        }
      }
    });
    return tabs;
  }

  renderTitleView(){
    return <View>
      <TouchableOpacity
        underlayColor='transparent'
        onPress={()=>this.dialog.show()}
      >
        <View style={{flexDirection:'row',alignItems: 'center'}}>
          <Text style={{fontSize: 18,color:'#FFFFFF',fontWeight: '400'}}>
            趋势 {this.state.timeSpan.showText}
          </Text>
          <MaterialIcons
            name={'arrow-drop-down'}
            size={22}
            style={{color:'white'}}
          />
        </View>

      </TouchableOpacity>
    </View>
  }
  onSelectTimeSpan(tab){
    this.dialog.dismiss();
    this.setState({
      timeSpan:tab
    });
    DeviceEventEmitter.emit(EVENT_TYPE_TIME_SPAN_CHANGE,tab);
  }
  renderTrendingDialog(){
    return <TrendingDialog
      ref={dialog=>this.dialog=dialog}
      onSelect={tab=>this.onSelectTimeSpan(tab)}
    />
  }
_tabNav(){
    if(!this.tabNav){//优化
      this.tabNav=createAppContainer(createMaterialTopTabNavigator(
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
    }
    return this.tabNav;

}

  render() {
    let statusBar={
      backgroundColor:THEME_COLOR,
      barStyle:'light-content'
    };
    let navigationBar=<NavigationBar
      titleView={this.renderTitleView()}
      statusBar={statusBar}
      style={{backgroundColor:THEME_COLOR}}
    />;
    const TabNavigator=this._tabNav();

    return (
      <View style={{flex:1,marginTop:DeviceInfo.isIPhoneX_deprecated?30:0}}>
        {navigationBar}
        <TabNavigator/>
        {this.renderTrendingDialog()}
      </View>
    );
  }
}
const pageSize=10;//设置为常量  防止修改
class TrendingTab extends Component<Props> {
  constructor(props){
    super(props);
    console.log(this.props);
    const {tabLabel,timeSpan}=this.props;
    this.storeName=tabLabel;
    this.timeSpan=timeSpan;
  }
  componentDidMount(): void {
    this.loadData();
    this.timeSpanChangeListener=DeviceEventEmitter.addListener(EVENT_TYPE_TIME_SPAN_CHANGE,(timeSpan)=>{
      this.timeSpan=timeSpan;
      this.loadData();
    })
  }
  componentWillUnmount(): void {
    if(!this.timeSpanChangeListener){
      this.timeSpanChangeListener.remove();
    }
  }

  loadData(loadMore){
    const {onRefreshTrending,onLoadMoreTrending}=this.props;
    const store=this._store();
    const url=this.genFetchUrl(this.storeName);
    if(loadMore){
      onLoadMoreTrending(this.storeName,++store.pageIndex,pageSize,store.items,(str)=>{
        console.log('没有更多了');
        this.toast.show('没有更多了');
      });
    }else{
      onRefreshTrending(this.storeName,url,pageSize);
    }

  }
  _store(){
    const {trending}=this.props;
    console.log(this.storeName);
    let store=trending[this.storeName];
    console.log(trending);
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
    return URL+key+'?'+this.timeSpan.searchText;
  }
  renderItem(data){
    const item=data.item;
    return <TrendingItem item={item} onSelect={()=>{
      NavigationUtil.goPage({
        projectMode: item
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
        <FlatList renderItem={(data)=>this.renderItem(data)} data={store.projectModes}  keyExtractor={item=>''+(item.id||item.fullName)}
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
  trending:state.trending
});

const mapDispatchToProps=dispatch=>({
  onRefreshTrending: (storeName,url,pageSize)=>dispatch(actions.onRefreshTrending(storeName,url,pageSize)),
  onLoadMoreTrending: (storeName,pageIndex,pageSize,item,callBack)=>dispatch(actions.onLoadMoreTrending(storeName,pageIndex,pageSize,item,callBack)),
});
const TrendingTabPage=connect(mapStateToProps,mapDispatchToProps)(TrendingTab);

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
