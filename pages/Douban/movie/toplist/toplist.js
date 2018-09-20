var app = getApp();
// toplist.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    resdata: [],
    tabbar: ["444", "999", "999", "999", "999"],
    count: 0,
    bls: false,
    isEmpty: true,
    isbook: false,
    topname: "",
    date: 0,
    morelist: true,
    start:0
  },

  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {
   // setTimeout(function () { wx.showNavigationBarLoading() }, -1000) 
   wx.showLoading({
     title: '加载中',
   })
    this.loads(options);
    setTimeout(function () { wx.hideNavigationBarLoading() }, 500)
  },
  detail: function (options) {
    var isbook = this.data.isbook;
    var id = options.currentTarget.dataset.id;
    if (isbook) {
      wx.navigateTo({
        url: '../../Book/bookdetails/bookdetails?titleid=' + id,
      })
    } else {
      wx.navigateTo({
        url: '../moviedetail/moviedetail?titleid=' + id,
      })
    }
  },
  tabbar:function(options){
    var ids = options.currentTarget.dataset.barname;
    var tabbar=[];
    var start=0;
    for(var ind in this.data.tabbar){
      var tabbarempt=["999"]
      var tabbaremptse=["444"]
      ids == ind ? tabbar = tabbar.concat(tabbaremptse) : tabbar= tabbar.concat(tabbarempt)
      ids == ind ? start = ind * 50 : start = start
    }
    this.setData({ tabbar: tabbar});
    this.setData({ start: start,count: 0, resdata:[]})
    setTimeout(function () { that.setData({ morelist: true })},1000)
    this.newloads()
  },
  loads: function (options) {
    this.setData({ topname: options.topname, morelist: false })
    var url = options.url;
    var types = options.types;
    var issc = options.issc;
    if (options.bl == "false") {
      this.setData({ bls: false })
    } else {
      this.setData({ bls: true })
    }
    if (types == "movie") {
      var start = this.data.count + this.data.start;
      url = url + "?count=10&&start=" + start;
      this.request(url, types, issc)
      setTimeout(function () { wx.hideNavigationBarLoading() }, 500)
    } else if (types == "book") {
      this.setData({ isbook: true })
      var topname = options.topname;
      this.bookdata(topname)
      setTimeout(function () { wx.hideNavigationBarLoading() }, 500)
      setTimeout(function () { wx.setNavigationBarTitle({ title: '全部' }) }, 500)
    }
  },
  newloads: function (isnews) {
    if (isnews.currentTarget.dataset.isbook==true){
return false
    }
    wx.showLoading({
      title: '加载中',
    })
    wx.showNavigationBarLoading()
    wx.setNavigationBarTitle({
      title: '加载更多中'
    })
    if(this.data.count>=50){
      this.setData({morelist:false})
    }
    if (!this.data.morelist) {
      wx.setNavigationBarTitle({
        title: '全部'
      })
      return false
    }
    console.log("加载一次");
    if (this.data.count < 50 && !this.data.isbook) {
      var url;
      var issc = false;
      var bl;
      switch (this.data.topname) {
        case "top250":
          url = "https://douban.uieee.com/v2/movie/top250";
          bl = "true";
          break;
        case "week":
          url = "https://douban.uieee.com/v2/movie/us_box";
          bl = "false";
          issc = true;
          break;
        case "newmv":
          url = "https://douban.uieee.com/v2/movie/top250";
          bl = "false";
          break;
        case "score":
          url = "https://douban.uieee.com/v2/movie/us_box";
          bl = "false";
          issc = true;
          break;
        case "mving":
          url = "https://douban.uieee.com/v2/movie/in_theaters";
          bl = "false";
          break;
        case "coming":
          url = "https://douban.uieee.com/v2/movie/coming_soon";
          break;
      };
      var topnames = this.data.topname;
      var options = {
        url: url,
        topname: topnames,
        types: 'movie',
        issc: issc,
        bl: bl
      }
    }
    this.loads(options);
    
    },
  bookdata: function (topname) {
    var data = [];
    var countid = this.data.start;
    switch (topname) {
      case "xinshu":
        data = wx.getStorageSync("newbookdatas")
        break;
      case "xugou":
        data = wx.getStorageSync("fictionbookdata")
        break;
      case "feixugou":
        data = wx.getStorageSync("unfictionbookdata")
        break;
    }
    var tempdata = [];

    for (var ind in data) {
      countid++;
      var tempres = {
        id: data[ind].id,
        countid: countid,
        title: data[ind].title,
        image: data[ind].image,
        directors: data[ind].author,
        casts: data[ind].bues,
        average: data[ind].average,
        original_title: data[ind].Introduction,
      }
      tempdata.push(tempres);
    }
    wx.hideLoading()
    this.setData({ resdata: tempdata })
    setTimeout(function () { wx.hideNavigationBarLoading() }, 500)
  },
  // 请求数据
  request: function (url, types, issc) {
    var that = this;
    wx.request({
      url: url,
      method: 'GET',
      header: {
        "Content-Type": "json"
      },
      success: function (res) {
        console.log(res)
        that.dataprocessing(res.data, types, issc);
        setTimeout(function () { that.setData({ morelist: true })},1000)
        
      }
    })
  },
  dataprocessing: function (res, types, issc) {
    var that=this
    if (types == "movie") {
      var tempdata = [];
      var countid = that.data.start + that.data.count;
      for (var ind in res.subjects) {
        countid++;
        var casts = "";
        var directors = "";

        if (casts.length >= 15) {
          casts = casts.substring(0, 15) + ".."
        }
        if (directors.length >= 15) {
          directors = directors.substring(0, 15) + ".."
        }
        var tempres
        if (issc == "true") {
          for (var inds in res.subjects[ind].subject.casts) {
            casts = casts + " " + res.subjects[ind].subject.casts[inds].name;
          }
          for (var indss in res.subjects[ind].subject.directors) {
            directors = directors + " " + res.subjects[ind].subject.directors[indss].name;
          }
          tempres = {
            id: res.subjects[ind].subject.id,
            countid: countid,
            title: res.subjects[ind].subject.title,
            image: res.subjects[ind].subject.images.large,
            directors: directors,
            casts: casts,
            average: res.subjects[ind].subject.rating.average,
            original_title: res.subjects[ind].subject.original_title,
          }
        } else {
          for (var inds in res.subjects[ind].casts) {
            casts = casts + " " + res.subjects[ind].casts[inds].name;
          }
          for (var indss in res.subjects[ind].directors) {
            directors = directors + " " + res.subjects[ind].directors[indss].name;
          }
          tempres = {
            id: res.subjects[ind].id,
            countid: countid,
            title: res.subjects[ind].title,
            image: res.subjects[ind].images.large,
            directors: directors,
            casts: casts,
            average: res.subjects[ind].rating.average,
            original_title: res.subjects[ind].original_title,

          }
        }

        tempdata.push(tempres);
      }
      wx.hideLoading();
      var counts = this.data.count + 10;
      if (this.data.isEmpty) {
        tempdata = this.data.resdata.concat(tempdata)
        this.setData({ count: counts, resdata: tempdata })
      } else {
        this.setData({ count: counts, resdata: tempdata, isEmpty: false })
      }
    }
    setTimeout(function () { wx.setNavigationBarTitle({ title: '全部' }), wx.hideNavigationBarLoading()  }, 500)
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
  goback: function (options) {
    wx.navigateBack({
      delta: 1
    })
  }
})