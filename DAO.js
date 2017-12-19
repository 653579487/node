


const MongoClient =  require('mongodb').MongoClient;
const DBurl = require('./config_DB');

//====================链接数据库函数===========================//
function _connect(callback) {
    var url = DBurl.dburl;  
    // 链接数据库
    MongoClient.connect(url,function (err, db) {
        callback(err,db)
    })

}

//====================添加数据===========================//
exports.insertOne = function (collectionName,json,callback) {
    _connect(function (err, db) {
        db.collection(collectionName).insertOne(json,function (err, result) {
            if(err){
                throw err
            }
            callback(err,result);
            db.close();
        })
    })
};


//======================查找数据============================//
// 参数为3时查找全部  参数为4可做分页哈 （ pagemount ： 每页多少条 ， pages ： 第几页   ）
exports.find = function (collectionName,json,c,d) {
   var result = [];
    if(arguments.length == 3){
        var callback = c;
        // 应该省略的数据
        var skipNumber = 0;
        //跳跃的数据
        var limitNumer = 0;

    }else if(arguments.length == 4){
        var callback = d;
        var args = c;
        // 应该省略的数据
        var skipNumber = args.pagemount * args.pages;
        //跳跃的数据
        var limitNumer = args.pagemount;

    }else{
        console.log('参数错误')
    }

   // 链接数据库 之后干点什么
    _connect(function (err, db) {
        var cursor = db.collection(collectionName).find(json).skip(skipNumber).limit(limitNumer);
        cursor.each(function (err, doc) {
            if(err){
                callback(err,null);
                db.close();
                return
            }
            if(doc != null){
                result.push(doc) //放入结果数组
            }else{
                callback(null,result);
                db.close()
            }

        })
    })
};


//======================删除数据============================//
exports.deleteMany = function (collectionName, json, callback) {
    _connect(function (err, db) {
        db.collection(collectionName).deleteMany(json,function (err, result) {
            if (err){
                throw err
                db.close()
            }
            callback(err,result)
            db.close()
        })
    })
};



//======================更改数据============================//
exports.updateMany = function (collectionName, json1, json2, callback) {
  _connect(function (err, db) {
      db.collection(collectionName).updateMany(json1,json2,function (err, result) {
          if (err){
              throw err;
              db.close();
          }
          callback(err,result);
          db.close();
      })
  })
};