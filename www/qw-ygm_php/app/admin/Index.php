<?php
namespace app2\admin;

use app2\BaseController;

class Index extends BaseController
{
    public function index()
    {
    $date = '';
    $data = ['a','b','c'];
      foreach($data as $k=>$v)
      {
         $date .= $k.$v;

      }
      var_dump($date);
      echo strtotime('now');
    }

}
