<?php
namespace app2\model;
use think\Model;

/**
 * Class User
 * @package app2\model
 */
class User extends Model
{
    /**
     * @return \think\model\relation\HasMany
     */
    public function hobby()
    {
        return $this->hasMany(Hobby::class, 'user_id', 'id');
    }
}