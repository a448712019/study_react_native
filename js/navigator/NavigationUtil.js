/**
 * 全局导航跳转工具
 */
export default class NavigationUtil {
  /**
   * 跳转到指定页面
   * @param params 要专递的参数
   * @param page   要跳转的页面
   */
  static goPage(params,page){
    const navigation=NavigationUtil.navigation;
    if(!navigation){
      console.log('NavigationUtil.navigation can not be null');
      return;
    }
    navigation.navigate(page,{...params});
  }

  /**
   * 返回上一页
   * @param params
   */
  static goBack(params){
    const {navigation}=params;
    navigation.goBack();
  }

  /**
   * 返回首页
   * @param params
   */
  static resetToHomePage(params){
    const {navigation}=params;
    navigation.navigate("MainNavigator");
  }
}