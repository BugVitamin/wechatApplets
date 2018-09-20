var app = getApp();
// Book.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    titleid: "",
    data: {},
    animationdatawreadin: {},
    animationdatarreadin: {},
    isanimationdatawreadin: true,
    isanimationdatarreadin: false,
    datasum:'',
    datasumbl:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    setTimeout(function () { wx.showNavigationBarLoading()},-1000) 
    this.setData({
      titleid: options.titleid
     //  titleid: "27043711"
    })
    if (wx.getStorageSync(this.data.titleid)) {
      this.setData({ isanimationdatawreadin: wx.getStorageSync(this.data.titleid).wread, isanimationdatarreadin: wx.getStorageSync(this.data.titleid).rread })
      this.setData({ isanimationdatawreadins: wx.getStorageSync(this.data.titleid).wread, isanimationdatarreadins: wx.getStorageSync(this.data.titleid).rread })
      
    }
    var that = this;
    wx.request({
      url: app.globalData.doubanapi + "v2/movie/subject/" + that.data.titleid,
      // url: app.globalData.doubanapi + "v2/movie/subject/26363254",
      method: 'GET',
      header: {
        "Content-Type": "json"
      },
      success: function (res) {
        var datasum='';
        if (res.data.original_title.length > 7) {
          res.data.original_title = res.data.original_title.substring(0, 6) + "..";
        };
        if (res.data.summary.length >= 38) {
          datasum = res.data.summary.substring(0, 38) + "...";
        };
        console.log(res);
        var genres = "";
        for (var index in res.data.genres) {
          genres = "/" + res.data.genres[index]
        }
        res.data.genres = genres;
        that.setData({
          data: res.data,
          datasum:datasum
        });
        setTimeout(function () { wx.hideNavigationBarLoading() }, 500)
      }
    })
     
  },
  readsin: function (options) {
    var temp;
    wx.getStorageSync(this.data.titleid) ? temp = wx.getStorageSync(this.data.titleid) : temp = { wread: false, rread: false }
    switch (options.currentTarget.dataset.bindtapname) {
      case "wreadin":
        if (!this.data.isanimationdatawreadin) {
          this.setData({ isanimationdatawreadin:true})
          temp.wread = true;
        } else {
          this.setData({ isanimationdatawreadin: false })
          temp.wread = false;
        }
        break;
      case "rreadin":
        if (!this.data.isanimationdatarreadin) {
          this.setData({ isanimationdatarreadin: true })
          temp.rread = true
        } else {
          this.setData({ isanimationdatarreadin: false })
          temp.rread = false
        }
        break;
    }
    wx.setStorage({
      key: this.data.titleid,
      data: temp,
    })
    // this.animation = animation
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  gotitles:function(ips){
    this.setData({datasumbl:false})
  },
  goback: function (options) {
    wx.navigateBack({
      delta: 1
    })
  }
})