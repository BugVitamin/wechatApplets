var app = getApp();
// Book.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    titleid: "",
    titledata: {},
    iswread: true,
    isiread: false,
    isrread: false,
    titleheight:"60px",
    summaryrl:'',
    author_introrl:'',
    summaryrlbo:true,
    author_introrlbo:true,
    zhankaibl:true,
    zhankai1bl:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    setTimeout(function () { wx.showNavigationBarLoading() }, -1000)

    this.setData({
      titleid: options.titleid,
    //  titleid:"27043711"
    })
    if (wx.getStorageSync(this.data.titleid)) {
      var re = wx.getStorageSync(this.data.titleid)
      this.setData({ iswread: re.wread, isiread: re.iread, isrread: re.rread })
    }
    var that = this;
    wx.request({
      url: app.globalData.doubanapi + "v2/book/" + that.data.titleid,
      method: 'GET',
      header: {
        "Content-Type": "json"
      },
      success: function (res) {
        console.log(res);
        var summaryrl=res.data.summary.substring(0,60);
        var author_intro=res.data.author_intro.substring(0,60);
        that.setData({
          titledata: res.data,
          summaryrl:summaryrl,
          author_intro:author_intro
        });
        setTimeout(function () { wx.hideNavigationBarLoading() }, 500)
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  onread: function (options) {
    var temp;
    wx.getStorageSync(this.data.titleid) ? temp = wx.getStorageSync(this.data.titleid) : temp = { wread: false, iread: false, rread:false}
    switch (options.currentTarget.dataset.name) {
      case "wread":
        if(this.data.iswread){
          temp.wread=false
          this.setData({iswread:false})
        }else{
          temp.wread = true
          this.setData({ iswread: true })
        }
        break;
      case "iread":
        if (this.data.isiread) {
          temp.iread = false
          this.setData({ isiread: false })
        } else {
          temp.iread = true
          this.setData({ isiread: true })
        }
        break;
      case "rread":
        if (this.data.isrread) {
          temp.rread = false
          this.setData({ isrread: false })
        } else {
          temp.rread = true
          this.setData({ isrread: true })
        }
        break;
    }
    wx.setStorageSync(this.data.titleid, temp)
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
  zhankai:function (options) {
    this.setData({
      author_introrlbo:false,
      zhankaibl:false
    })
  },
  zhankai1:function (options) {
    this.setData({
      summaryrlbo:false,
    })
  },
  goback:function(options){
    wx.navigateBack({
      delta:1
    })
  }
})