import Types from '../types';
import DataStore from '../../expand/dao/DataStore';
import {FLAG_STORAGE} from "../../expand/dao/DataStore";
import {handleData} from '../ActionUtil';

/**
 * 获取最热数据的异步action
 * @param theme
 * @returns {{type: *}}
 */
export function onRefreshPopular(storeName,url,pageSize) {
  return dispatch=>{
    dispatch({type:Types.POPULAR_REFRESH,storeName:storeName});
    let dataStore=new DataStore();
    dataStore.fetchData(url,FLAG_STORAGE.flag_popular)//异步action与数据流
      .then(data=>{
          handleData(Types.POPULAR_REFRESH_SUCCESS,dispatch,storeName,data,pageSize)
      })
      .catch(error=>{
        console.log(error);
        dispatch({type:Types.POPULAR_REFRESH_FAIL,storeName:storeName,error,})
      })
  }
}

/**
 * 加载更多
 * @param storeName
 * @param pageIndex
 * @param pageSize
 * @param dataArray
 */
export  function onLoadMorePopular(storeName,pageIndex,pageSize,dataArray=[],callBack) {
  return dispatch=>{
    setTimeout(()=>{//模拟网络请求
      if((pageIndex-1)*pageSize>=dataArray.length){//已加载完全部数据
        if(typeof callBack ==='function'){
          callBack('no more');
        }
        dispatch({
          type:Types.POPULAR_LOAD_MORE_FAIL,
          error:'no more',
          storeName:storeName,
          pageIndex:--pageIndex,
          projectModes:dataArray
        })
      }else{
        //本次和载入的最大数量
        let max=pageSize*pageIndex>dataArray.length?dataArray.length:pageSize*pageIndex;
        dispatch({
          type:Types.POPULAR_REFRESH_SUCCESS,
          storeName,
          pageIndex,
          projectModes: dataArray.slice(0,max),
        })
      }

    },500)
  }
}

