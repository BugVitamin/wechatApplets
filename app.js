/*测试新上传123456789
 * @Author: Yulin zhao 
 * @Date: 2018-08-10 22:59:48 
 * @Last Modified by: Yulin zhao
 * @Last Modified time: 2018-10-04 21:50:53
 */
//app.js
App({
  onLaunch: function () {
    var stor = ["newbookdatas", "fictionbookdata", "unfictionbookdata"]
    var datehour = new Date().getHours();
    if (wx.getStorageSync("apphour")) {
      if (wx.getStorageSync("apphour") != datehour) {
        // for (var ind in stor){
        // wx.removeStorageSync(stor[ind])
        // }
      }
    } else {
      // for (var ind in stor) {
      //   wx.removeStorageSync(stor[ind])
      // }
      wx.setStorageSync("apphour", datehour);
    }
  },

  globalData: {
    doubanapi: "https://douban.uieee.com/",
    datehour: 0
  }
})