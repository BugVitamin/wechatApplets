/*
 * @Author: Yulin zhao 
 * @Last Modified by: Yulin zhao
 * @Last Modified time: 2018-09-14 14:08:55
 */
var app = getApp();
// movies.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
	  //待获取的排行榜资源
    mvrisbeing: [],
    mvcoming: [],
    listtop250: [],
    listweek: [],
    listnewmv: [],
    listscore: [],
    onnew: false,//是否需要获取新资源
    golisbo:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    setTimeout(function () { wx.showNavigationBarLoading() }, -1000) 
    var date =new Date().getHours();
    var dataurl=app.globalData.doubanapi;
    wx.setStorageSync("apphour", date)
    this.onnewload();//通过缓存中的时间判断是否需要重新获取资源
    // 读缓存,存在直接加载，不存在从服务器获取
    wx.getStorageSync("mvrisbeing") && this.data.onnew ? this.setData({ mvrisbeing: wx.getStorageSync("mvrisbeing") }) : this.douban(dataurl+"v2/movie/in_theaters?count=10", "mvrisbeing", false);
    wx.getStorageSync("mvcoming") && this.data.onnew ? this.setData({ mvcoming: wx.getStorageSync("mvcoming") }) : this.douban(dataurl+"v2/movie/coming_soon?count=10", "mvcoming", false);
    wx.getStorageSync("listtop250") && this.data.onnew ? this.setData({ listtop250: wx.getStorageSync("listtop250") }) : this.douban(dataurl+"v2/movie/top250?count=3", "listtop250", false);
    wx.getStorageSync("listweek") && this.data.onnew ? this.setData({ listweek: wx.getStorageSync("listweek") }) : this.douban(dataurl+"v2/movie/us_box", "listweek", true);
    wx.getStorageSync("listnewmv") && this.data.onnew ? this.setData({ listnewmv: wx.getStorageSync("listnewmv") }) : this.douban(dataurl+"v2/movie/top250?count=3", "listnewmv", false);
    wx.getStorageSync("listscore") && this.data.onnew ? this.setData({ listscore: wx.getStorageSync("listscore") }) : this.douban(dataurl+"v2/movie/us_box", "listscore", true);
    setTimeout(function () { wx.hideNavigationBarLoading() }, 1000)
  },
  golistbo: function (opations) {
    if(this.data.golisbo){
      var url = "";
      var issc = false;
      this.data.golisbo=false;
      switch (opations.currentTarget.dataset.topname) {
        case "top250":
          url = dataurl+"v2/movie/top250";
          break;
        case "week":
          url = dataurl+"v2/movie/us_box";
          issc = true;
          break;
        case "newmv":
          url = dataurl+"v2/movie/top250";
          break;
        case "score":
          url = dataurl+"v2/movie/us_box";
          issc = true;
          break;
        case "mving":
          url = dataurl+"v2/movie/in_theaters";
          break;
        case "coming":
          url = dataurl+"v2/movie/coming_soon";
          break;
      };
      wx.navigateTo({
        url: '../movie/toplist/toplist?colors=#12a6b7&topname=' + opations.currentTarget.dataset.topname + '&issc=' + issc + '&types=movie&url=' + url + "&bl=" + opations.currentTarget.dataset.topbar,
      })
    }else{
      var that=this;
setTimeout(function(){that.data.golisbo=true},200)
    }

  },
  golist: function (opations) {
      var url = "";
      var issc = false;
      switch (opations.currentTarget.dataset.topname) {
        case "top250":
          url = dataurl+"v2/movie/top250";
          break;
        case "week":
          url = dataurl+"v2/movie/us_box";
          issc = true;
          break;
        case "newmv":
          url = dataurl+"v2/movie/top250";
          break;
        case "score":
          url = dataurl+"v2/movie/us_box";
          issc = true;
          break;
        case "mving":
          url = dataurl+"v2/movie/in_theaters";
          break;
        case "coming":
          url = dataurl+"v2/movie/coming_soon";
          break;
      };
      wx.navigateTo({
        url: '../movie/toplist/toplist?colors=#12a6b7&topname=' + opations.currentTarget.dataset.topname + '&issc=' + issc + '&types=movie&url=' + url + "&bl=" + opations.currentTarget.dataset.topbar,
      })


  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  onnewload: function () {
    //判断缓存是否存在 并通过 获取的时间判断是否需要重新获取资源
    var hour = new Date().getHours();
    !wx.getStorageSync("datehour") ? wx.setStorageSync("datehour", hour) : wx.getStorageSync("datehour") != hour ? this.setData({ onnew: false }) : this.setData({ onnew: true });
  },
  douban: function (url, data, bol) {
    wx.setStorageSync("datehour", new Date().getHours());
    var that = this;
    wx.request({
      url: url,
      method: "GET",
      header: {
        "Content-Type": "json"
      },
      success: function (res) {
        console.log(res),
        that.dataprocess(res, data, bol)
       
      }
    })
  },
  //写数据和写缓存
  dataprocess: function (res, data, bol) {
    var idata = this.datachuli(res, data, bol);//处理数据
    switch (data) {
      case "mvrisbeing":
        this.setData({
          mvrisbeing: idata
        });
        wx.setStorage({
          key: 'mvrisbeing',
          data: idata,
        })
        break;
      case "mvcoming":
        this.setData({
          mvcoming: idata
        });
        wx.setStorage({
          key: 'mvcoming',
          data: idata,
        })
        break;
      case "listtop250":
        this.setData({
          listtop250: idata
        });
        wx.setStorage({
          key: 'listtop250',
          data: idata,
        })
        break;
      case "listweek":
        this.setData({
          listweek: idata
        });
        wx.setStorage({
          key: 'listweek',
          data: idata,
        })
        break;
      case "listnewmv":
        this.setData({
          listnewmv: idata
        });
        wx.setStorage({
          key: 'listnewmv',
          data: idata,
        })
        break;
      case "listscore":
        this.setData({
          listscore: idata
        });
        wx.setStorage({
          key: 'listscore',
          data: idata,
        })
        break;
    };

  },
  //处理
  datachuli: function (res, data, bol) {
    var idata = [];
    if (bol) {
      for (var index in res.data.subjects) {
        var ins = {
          id: res.data.subjects[index].subject.id,
          title: res.data.subjects[index].subject.title,
          image: res.data.subjects[index].subject.images.large,
          average: res.data.subjects[index].subject.rating.average,
        };
        idata.push(ins);
      }
      return idata;
    } else {
      if (data == "mvcoming") {
        for (var index in res.data.subjects) {
          var ins = {
            id: res.data.subjects[index].id,
            title: res.data.subjects[index].title,
            average: res.data.subjects[index].rating.average,
            image: res.data.subjects[index].images.large,
            wantsnew: res.data.subjects[index].collect_count
          };
          idata.push(ins);
        }
        return idata;
      } else {
        for (var index in res.data.subjects) {
          var ins = {
            id: res.data.subjects[index].id,
            title: res.data.subjects[index].title,
            average: res.data.subjects[index].rating.average,
            image: res.data.subjects[index].images.large
          };
          idata.push(ins);
        }
        return idata;
      }

    }
    return "error"

  },
  onatitle: function (res) {
    wx.navigateTo({
      url: 'moviedetail/moviedetail?titleid=' + res.currentTarget.dataset.titleid
    })
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

  }
})