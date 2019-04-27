import {AsyncStorage} from 'react-native';

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

  fetchData(url){
    console.log(url);
    return new Promise((resolve,reject)=>{
      this.fetchLocalData(url).then((wrapData)=>{
        console.log(wrapData);
        if(wrapData&&DataStore.checkTimestampValid(wrapData.timestamp)){
          resolve(wrapData);
        }else{
          this.fetchNetData(url).then((data)=>{
            resolve(this._wrapData(data));
          }).catch((error)=>{
            reject(error)
          })
        }
      }).catch((error)=>{
        // console.log(error);
        this.fetchNetData(url).then((data)=>{
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
   * @param url
   * @returns {Promise<any> | Promise<*>}
   */
  fetchNetData(url){
    return new Promise((resolve,reject)=>{
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
    })
  }


}


