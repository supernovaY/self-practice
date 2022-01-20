<?php
namespace app2\admin\API;

class GetDataAPI
{
    public function HousekeepingApi()
    {
    // 1. 将AppKey、InvalidTime（按格式yyyyMMddHHmmss格式化为字符串）、RandamStr这些参数，以这些参数的Key按字母顺序进行排序。
            $url = 'http://api.cmgrasp.com/CMGraspApi/GateWay';
            $sign = '';

            $MethodName = 'graspcm.cmapi.getsignstr';
            $AppKey = '31A992688A5C4EB0A12845D68D76BFED';
            $InvalidTime = date('YmdHis',time());
            $RandamStr = '954387';

            $SercretKey ='CEF6A0549DD6461CA2816F14AF03B74D';

            $dataNone =[
                    "AppKey"=>$AppKey,
                    "InvalidTime"=> $InvalidTime,
                    "RandamStr"=>$RandamStr,
              ];
          ksort($dataNone);
          // 2. 按排好的顺序，将对应的Key+Value连接成一个字符串。
         foreach($dataNone as $k=>$v)
            {
                $sign .= $k.$v;
            }
         // 3. 在字符串尾部加上与对应的SercretKey。
             $apisign = $sign.$SercretKey;
         // 4. MD5前的字符串示例：AppKey48B15C891B5247A591B4914A37E5ABCDInvalidTime20200306171800RandamStr12345642B9429E8273412DB
         // 5. 将这个字符串转成32位小写的MD5。
            $api_signkey = strtolower(md5($apisign));
            $data =[
                   "MethodName"     =>  $MethodName,
                    "AppKey"        =>  $AppKey,
                    "InvalidTime"   =>  date('Y-m-d H:i:s',time()),
                    "RandamStr"     =>  $RandamStr,
                    "SignStr"       =>  $api_signkey,
              ];
        $data = json_encode($data);
        $keepRes = http_post_json($url,$data);
        print_r($keepRes);
        $keepRes = json_decode($keepRes['1'],true);
        $keepRes = json_decode($keepRes['RetMsg'],true);
        print_r($data);
        print_r($keepRes);
        return $keepRes['SignKey'];
    }

    public function AppApi(){

        $url          =     'http://api.cmgrasp.com/CMGraspApi/GateWay';
        $sign         =     '';
        $UserId       =     '10460595';
        $MethodName   =     'graspcm.cmapi.getcustomerapiurl';
        $AppKey       =     '31A992688A5C4EB0A12845D68D76BFED';
        $InvalidTime  =     date('YmdHis',time());
        $RandamStr    =     '954387';
        $SercretKey   =     'CEF6A0549DD6461CA2816F14AF03B74D';

        $dataNone =[
            "AppKey"        =>  $AppKey,
            "InvalidTime"   =>  $InvalidTime,
            "RandamStr"     =>  $RandamStr,
            "UserId"        =>  $UserId,
          ];
        print_r($dataNone);
        // 2. 按排好的顺序，将对应的Key+Value连接成一个字符串。
        foreach($dataNone as $k=>$v)
        {
            $sign .= $k.$v;
        }
        // 3. 在字符串尾部加上与对应的SercretKey。
        $apisign        = $sign.$SercretKey;
        print_r($apisign);
        // 4. MD5前的字符串示例：AppKey48B15C891B5247A591B4914A37E5ABCDInvalidTime20200306171800RandamStr12345642B9429E8273412DB
        // 5. 将这个字符串转成32位小写的MD5。
        $api_signkey    = strtolower(md5($apisign));
        $data =[
            "MethodName"    => $MethodName,
            "AppKey"        => $AppKey,
            "UserId"        => $UserId,
            "InvalidTime"   => date('Y-m-d H:i:s',time()),
            "RandamStr"     => $RandamStr,
            "SignStr"       => $api_signkey,
        ];
        $data = json_encode($data);
        print_r($data);
        $appRes  = http_post_json($url,$data);
        $appRes = json_decode($appRes['1'],true);
        $appRes = json_decode($appRes['RetMsg'],true);
        print_r($appRes);
        return $appRes;
    }
    public function PickOrderApi(){
        $AppApi = $this->AppApi();
        $url = $AppApi['ApiServerAddress'];
        $ManageName = 'GraspCMServerApi';
        $DbName = 'mysql';
        $Paramkey = '';
        $ParamJson = json();
        $ApiParam = $AppApi['ApiParam'];
        print_r($ApiParam);
        $Apitype = 'query';
        $Mobile = $AppApi['GraspCloudMobile'];
        $ServiceId = $AppApi['GraspCloudServerId'];

        $sign='';
        $VchType = '';
        $BeginDate = '2020-01-01';
        $EndDate = date('Ymd',time());
        $VchType = '';
        $SignKey = $this->HousekeepingApi();

        $dataNone =[
            "managename"    =>  $ManageName,
            "dbname"        =>  $DbName,
            "paramkey"      =>  $Paramkey,
            "paramjson"     =>  $ParamJson,
            "apiparam"      =>  $ApiParam,
            "apitype"       =>  $Apitype,
            "mobile"        =>  $Mobile,
            "serviceid"     =>  $ServiceId,
        ];
        $dataNone=json($dataNone);
        foreach($dataNone as $k=>$v)
        {
            $sign .= $k.$v;
        }
        $ApiSign        = $sign.$SignKey;
        $date = [
            "apisign"  =>  $ApiSign,
            "enddate"  =>  $EndDate,
            "vchtype"  =>  $VchType,
            "pagesize"  =>  '2',
            "pageindex"  =>  '1',
        ];
        print_r('caonima' .$date .'caonima');
        $data = $ApiSign .$date .$SignKey;
        print_r('caonima' .$data .'caonima');
        $api_signkey    = strtolower(md5($data));
        print_r('caonima' .$api_signkey .'caonima');
        $PickOrderRes =  http_post_json($url,$api_signkey);
        print_r($PickOrderRes);
    }

}
