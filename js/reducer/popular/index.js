import Types from '../../action/types';

const defaultState={
  
};
/**
 *  popular:{
 *    java:{
 *      items:[],
 *      isLoading:false
 *    },
 *    ios{
 *      items:[],
 *      isLoading:false
 *    }
 *  }
 * @param state
 * @param action
 */
export default  function onAction(state=defaultState,action) {
  switch (action.type) {
    case Types.POPULAR_REFRESH_SUCCESS: //下啦刷新成功
      console.log(action,'结果1');
      console.log(state,'结果');
      return {
        ...state,
        [action.storeName]:{
          ...state[action.storeName],
          items:action.items,//原始数据
          projectModes:action.projectModes,//此次要展示的数据
          isLoading:false,
          hideLoadingMore:false,
          pageIndex:action.pageIndex,
        }
      };
    case   Types.POPULAR_REFRESH: //下啦刷新
      return {
        ...state,
        [action.storeName]:{
          ...state[action.storeName],
          isLoading:true,
          hideLoadingMore:true,
        }
      };
    case   Types.POPULAR_REFRESH_FAIL://下啦刷新失败
      return {
        ...state,
        [action.storeName]:{
          ...state[action.storeName],
          isLoading:false
        }
      };
    case Types.POPULAR_LOAD_MORE_SUCCESS: //上啦加载更多成功
      return {
        ...state,
        [action.storeName]:{
          ...state[action.storeName],
          projectModes:action.projectModes,
          hideLoadingMore:false,
          pageIndex:action.pageIndex
        }
      };
    case Types.POPULAR_LOAD_MORE_FAIL: //上啦加载sb
      return {
        ...state,
        [action.storeName]:{
          ...state[action.storeName],
          hideLoadingMore:true,
          pageIndex:action.pageIndex
        }
      };
    default:
      return state
    
  }
}