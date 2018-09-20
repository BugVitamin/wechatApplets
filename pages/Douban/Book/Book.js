/*
 * @Author: Yulin zhao 
 * @Last Modified by: Yulin zhao
 * @Last Modified time: 2018-09-14 14:16:04
 */
var app = getApp();
// Book.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
	  //需要获取的id，豆瓣没有提供图书排行榜Api
    newbookid: [27091466, 27043711, 27068946, 27030788, 27057490, 27096421, 26974896, 26986509],
    fictionbookdataid: [5431784, 27028847, 26998358, 26969582, 27045888, 27044089, 26981446, 27042344],
    unfictionbookdataid: [27056409, 27026379, 27001119, 27052521, 27037167, 27029463, 27009503, 27044783],
    newbookdatas: [],
    fictionbookdata: [],
    unfictionbookdata: [],
    golistbo: false//是否跳转
  },

  golistbo: function (opations) {
    var that = this;
    //阻止第一次误跳转
    if (that.data.golistbo) {
      var topname = opations.currentTarget.dataset.topname;
      var url = "";
      wx.navigateTo({
        url: '../movie/toplist/toplist?colors=#42bd56&types=book&topname=' + topname + '&url=' + url + "&bl=" + opations.currentTarget.dataset.topbar,
      });
      setTimeout(function () {
        that.data.golistbo = false
      }, 100)
    } else {
      setTimeout(function () {
        that.data.golistbo = true
      }, 100)
    }
  },
  golist: function (opations) {
    var topname = opations.currentTarget.dataset.topname;
    var url = "";
    wx.navigateTo({
      url: '../movie/toplist/toplist?colors=#42bd56&types=book&topname=' + topname + '&url=' + url + "&bl=" + opations.currentTarget.dataset.topbar,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    setTimeout(function () {
      wx.showNavigationBarLoading()
    }, -1000)
    var date = new Date().getHours();
    wx.setStorageSync("apphour", date)
    this.news(this.data.newbookid, "inewbookdatas");
    this.news(this.data.fictionbookdataid, "ifictionbookdata");
    this.news(this.data.unfictionbookdataid, "iunfictionbookdata");
  },
  news: function (id, dataname) {
    var tnewbookdatas = [];
    var tictionbookdata = [];
    var tunfictionbookdata = [];
    var tn = 0;
    var ti = 0;
    var tu = 0;
    var that = this;
    // that.setData({
    //   newbookdatas: wx.getStorageSync("newbookdatas")
    // })
    // setTimeout(function () { wx.hideNavigationBarLoading() }, 500)
    // that.setData({
    //   fictionbookdata: wx.getStorageSync("fictionbookdata")
    // })
    // setTimeout(function () { wx.hideNavigationBarLoading() }, 500)
    // that.setData({
    //   unfictionbookdata: wx.getStorageSync("unfictionbookdata")
    // })
    // setTimeout(function () { wx.hideNavigationBarLoading() }, 500)
    // id=[]
    if (wx.getStorageSync("newbookdatas")) {
      that.setData({
        newbookdatas: wx.getStorageSync("newbookdatas")
      })
      setTimeout(function () {
        wx.hideNavigationBarLoading()
      }, 500)

      id = []
    }
    if (wx.getStorageSync("fictionbookdata")) {
      that.setData({
        fictionbookdata: wx.getStorageSync("fictionbookdata")
      })
      setTimeout(function () {
        wx.hideNavigationBarLoading()
      }, 500)
      id = []
    }
    if (wx.getStorageSync("unfictionbookdata")) {
      that.setData({
        unfictionbookdata: wx.getStorageSync("unfictionbookdata")
      })
      setTimeout(function () {
        wx.hideNavigationBarLoading()
      }, 500)
      id = []
    }
    for (var index in id) {
      var url = app.globalData.doubanapi + "v2/book/" + id[index];
      wx.request({
        url: url,
        method: 'GET',
        header: {
          "Content-Type": "json"
        },
        success: function (res) {
          var titlesimple;
          var summarysimpe;
          if (res.data.title.length > 7) {
            res.data.title = res.data.title.substring(0, 6) + "..";
          };
          if (res.data.summary.length >= 38) {
            res.data.summary = res.data.summary.substring(0, 38) + "...";
          };
          console.log(res);
          var datas = {
            id: res.data.id,
            title: res.data.title,
            average: res.data.rating.average,
            image: res.data.image,
            author: res.data.author[0],
            bues: res.data.publisher,
            Introduction: res.data.summary
          }
          switch (dataname) {
            case "inewbookdatas":
              tnewbookdatas.push(datas);
              that.setData({
                newbookdatas: tnewbookdatas,
              })
              tn++;
              if (tn == that.data.newbookid.length) {
                wx.setStorageSync("newbookdatas", that.data.newbookdatas)
              }

              break;
            case "ifictionbookdata":
              tictionbookdata.push(datas);
              that.setData({
                fictionbookdata: tictionbookdata,
              })
              ti++;
              if (ti == that.data.fictionbookdataid.length) {
                wx.setStorageSync("fictionbookdata", that.data.fictionbookdata)
              }
              break;
            case "iunfictionbookdata":
              tunfictionbookdata.push(datas);

              // --
              that.setData({
                unfictionbookdata: tunfictionbookdata,
              })
              tu++;
              if (tu == that.data.unfictionbookdataid.length) {
                wx.setStorageSync("unfictionbookdata", that.data.unfictionbookdata)
              }
              break;
            default:

          };
          setTimeout(function () {
            wx.hideNavigationBarLoading()
          }, 500)
        }
      })
    }

  },
  // newdatas: function (res, ind, dataname) {
  //   var datas = [];
  //   var resdata = {
  //     id: res.data.id,
  //     title: res.data.title,
  //     rating: {
  //       average: res.data.rating.average
  //     },
  //     image: res.data.image
  //   };
  //   datas.push(resdata);
  //   if (this.data.isempty) {
  //     this.setData({
  //       dataname: datas,
  //       isempty: false
  //     })
  //   } else {
  //     datas = this.data.dataname.concat(datas)
  //     if (ind) {
  //       wx.setStorageSync(dataname, datas)
  //     }
  //     this.setData({
  //       dataname: datas
  //     })
  //   }

  // },
  // news: function (id, dataname) {
  //   var that = this;
  //   if (!wx.getStorageSync(dataname)) {
  //     for (var ind in id) {
  //       var newsto = false;
  //       var urls = app.globalData.doubanapi + "v2/book/"
  //       if (ind == that.data.newbookid.length - 1) {
  //         newsto = true;
  //       }
  //       wx.request({
  //         url: urls,
  //         method: 'GET',
  //         header: {
  //           "Content-Type": "json"
  //         },
  //         success: function (res) {
  //           console.log("请求一次")
  //           var datas = [];
  //           var resdata = {
  //             id: res.data.id,
  //             title: res.data.title,
  //             rating: {
  //               average: res.data.rating.average
  //             },
  //             image: res.data.image
  //           };
  //           datas.push(resdata);
  //           if (that.data.isempty) {
  //             that.setData({
  //               dataname: datas,
  //               isempty: false
  //             })
  //           } else {
  //             datas = that.data.dataname.concat(datas)
  //             if (ind) {
  //               wx.setStorageSync(dataname, datas)
  //             }
  //             that.setData({
  //               dataname: datas
  //             })
  //           }

  //         }
  //       })
  //     }
  //   } else {
  //     that.setData({
  //       dataname: wx.getStorageSync(dataname)
  //     })
  //   }
  // },
  // wxreq: function (url, ind, dataname) {
  //   var that = this;
  //   wx.request({
  //     url: url,
  //     method: 'GET',
  //     header: {
  //       "Content-Type": "json"
  //     },
  //     success: function (res) {
  //       console.log("请求一次")
  //       console.log(res);
  //       that.newdatas(res, ind, dataname);

  //     }
  //   })
  // },
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
  onatitle: function (res) {

    wx.navigateTo({
      url: 'bookdetails/bookdetails?titleid=' + res.currentTarget.dataset.titleid,
    })
  },
  onShareAppMessage: function () {

  },
  gototitl: function (opation) {
    wx.navigateTo({
      url: 'bookdetails/bookdetails?titleid=27029463'
    })
  }
})