var app=angular.module("appModule",[]);
app.controller("myCtrl",function ($rootScope,$http) {
    //获取token值；
    $rootScope.symData="";
    $rootScope.url='http://api.huimeicare.com/oauth2/oauth/get_token?client_id=fde7146d3e6b4c15b8e3f9627749e6f7&client_secret=d552b9bc2d0d43c19445c45af5c67f27';
    //解析url
    $rootScope.getSk= function () {
        var url = $rootScope.url;
        var thisParam = new Object();
        // 判断是否存在请求的参数
        if (url.indexOf("?") != -1) {
            var str = url.substr(1);
            // 截取所有请求的参数，以数组方式保存
            strs = str.split("&");
            for(var i = 0; i < strs.length; i ++) {
                // 获取该参数名称，值。其中值以unescape()方法解码，有些参数会加密
                thisParam[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);
            }
        }
        // 返回改参数列表对象
        return thisParam;
    }
    $rootScope.obj=$rootScope.getSk();
    $rootScope.sk=$rootScope.obj.client_secret;
    //获取token
    $http({
        method: 'POST',
        dataType:'json',
        url: $rootScope.url
    }).then(function (response) {
        $rootScope.access_token=response.data.access_token;

    })
})
app.controller("indexCtrl",function ($scope,$http,$rootScope) {
    $scope.accessCode="";
    $scope.flag=true;
    $scope.birth="";
    $scope.login=function () {
        $scope.accessC=$.md5($scope.accessCode+$rootScope.sk);
        $scope.logData={"accessCode":$scope.accessCode,"key":$scope.accessC,"msgId":"1001"}
        ajax({
            url: 'http://api.huimeicare.com/amc/v1/service.do?access_Token='+$scope.access_token,
            type: 'post',
            dataType: 'json',
            async: true,
            cache: true,
            success: function (data) {
                if(data.code==200){
                    $scope.flag=false;
                    $scope.symData=data;
                    localStorage.setItem('symData', JSON.stringify($scope.symData));
                    $scope.accessId=$scope.symData.accessId
                    console.log(console.log(localStorage.getItem('symData')))
                    window.location.href="个人信息.html"

                }else {
                    $scope.message=data.message;
                    $scope.flag=true;
                }
            },
            data:$scope.logData
        })


    }
    console.log($rootScope.symData)

})
app.controller("personCtrl",function ($scope,$rootScope) {
     $scope.symData=JSON.parse(localStorage.getItem('symData'))
    $scope.accessId=$scope.symData.accessId;
    $scope.symptomId=$scope.symData.symptomId;
    console.log($scope.symData)
    $scope.key=$.md5($scope.accessId+"10A02"+$rootScope.sk)

    $scope.whos=[{id:"1","name":"本人"},{id:"2","name":"其他人"}];
    $scope.sexes=[{id:"89","name":"女"},{id:"88","name":"男"}];
    $scope.myOption="";
    $scope.mySex="";
    $scope.birth='';


    $scope.outInfor=function () {
        $scope.date= function () {
            var date = $scope.birth;
            var seperator1 = "";
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var strDate = date.getDate();
            if (month >= 1 && month <= 9) {
                month = "0" + month;
            }
            if (strDate >= 0 && strDate <= 9) {
                strDate = "0" + strDate;
            }
            var currentdate = year + seperator1 + month + seperator1 + strDate;
            return currentdate;
        }
        $scope.myBirth=$scope.date()
        $scope.who=$scope.myOption.id;
        $scope.sex=$scope.mySex.id;
        $scope.data={"msgId":"1002","nurse":"1","accessId":$scope.accessId,"birth":$scope.myBirth,"who":$scope.who,"sex":$scope.sex,"symptomId":"10A02","key":$scope.key};
        console.log($scope.data)
        ajax({
            url: 'http://api.huimeicare.com/amc/v1/service.do?access_Token='+$scope.access_token,
            type: 'post',
            dataType: 'json',
            async: true,
            cache: true,
            data:$scope.data,
            success: function (data) {
                console.log(data)
                if(data.code==200){


                }else {

                }
            },

        })
    }

})
