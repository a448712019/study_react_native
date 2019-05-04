import {AsyncStorage} from 'react-native';
import Trending from 'GitHubTrending';
export const FLAG_STORAGE={flag_popular:'popular',flag_trending:'trending'};

export default  class DataStore {
  /**
   *  检查时间有效期
   * @param timestamp
   * @returns {boolean}
   */
  static checkTimestampValid(timestamp) {
    const currentDate = new Date();
    const targetDate = new Date();
    targetDate.setTime(timestamp);
    if (currentDate.getMonth() !== targetDate.getMonth()) return false;
    if (currentDate.getDate() !== targetDate.getDate()) return false;
    if (currentDate.getHours() - targetDate.getHours() > 4) return false;//有效期4个小时
    // if (currentDate.getMinutes() - targetDate.getMinutes() > 1)return false;
    return true;
  }

  fetchData(url,flag){
    console.log(url);
    return new Promise((resolve,reject)=>{
      this.fetchLocalData(url).then((wrapData)=>{
        console.log(wrapData);
        if(wrapData&&DataStore.checkTimestampValid(wrapData.timestamp)){
          resolve(wrapData);
        }else{
          this.fetchNetData(url,flag).then((data)=>{
            resolve(this._wrapData(data));
          }).catch((error)=>{
            reject(error)
          })
        }
      }).catch((error)=>{
        // console.log(error);
        this.fetchNetData(url,flag).then((data)=>{
          resolve(this._wrapData(data));
        }).catch((error)=>{
          reject(error);
        })
      })
    })
  }
  saveData(url,data,callback){
    if(!data||!url) return;
    AsyncStorage.setItem(url,JSON.stringify(this._wrapData(data)),callback);
  }

  /**
   *  获取时间
   * @returns {{data: *, timestamp: number}}
   * @private
   */
  _wrapData(data) {
            return {data: data, timestamp: new Date().getTime()};
  }

  /**
   * 获取本地数据
   * @param url
   * @returns {Promise<any> | Promise<*>}
   */
  fetchLocalData(url){
    return new Promise((resolve,reject)=>{
      AsyncStorage.getItem(url,(error,result)=>{
        if(!error){
          try {
            resolve(JSON.parse(result))
          }catch (e) {
            reject(e);
            console.log(e);
          }
        }else{
          reject(error);
          console.error(error);
        }
      })
    })
  }

  /**
   * 网络获取数据
   * @param flag
   * @param url
   * @returns {Promise<any> | Promise<*>}
   */
  fetchNetData(url,flag){
    return new Promise((resolve,reject)=>{
      if(flag!==FLAG_STORAGE.flag_trending){
        fetch(url)
          .then((response)=>{
            if(response.ok){
              return response.json();
            }
            throw new Error('Network response was not ok');
          })
          .then((responseData)=>{
            this.saveData(url,responseData);
            resolve(responseData);
          })
      }else{
        new Trending().fetchTrending(url)
          .then(items=>{
            if(!items){
              throw new Error('responseData is null');
            }
            this.saveData(url,items);
            resolve(items);
          })
          .catch(error=>{
            reject(error);
          })
      }

    })
  }


}


