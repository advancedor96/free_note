<template>
  <ActionBar class="action-bar" :title="mtitle">
    <ActionItem @tap="refresh"
      android.position="actionBar">
      <Label class="p-b-10">
        <FormattedString ios.fontFamily="system">
          <!-- <Sapn text.decode="&#xf021;" /> -->
        </FormattedString>
      </Label>
    </ActionItem>
    <ActionItem @tap="goLogin"
      text="登入" android.position="popup" />   
    <ActionItem @tap="logout"
      text="登出" android.position="popup" />    
    <ActionItem @tap="goRegister"
      text="註冊" android.position="popup" />    
  </ActionBar>
</template>

<script>
const appSettings = require('application-settings');
const httpModule = require("http");
import Register from './Register'
import Login from './Login'
import Home from './Home'
import axios from 'axios';
import { TNSFancyAlert, TNSFancyAlertButton } from "nativescript-fancyalert";

export default {
  computed: {
    mtitle(){
      return `Hi, ${appSettings.getString('account')}`
    },
  },
  methods: {
    refresh(){
      this.$emit('refresh', 1);
    },
    goRegister(){
      this.$navigateTo(Register)
    },
    goLogin(){
      this.$navigateTo(Login)
    },
    logout(){
      axios.get('http://172.104.76.31:5000/api/users/logout', {
        headers: { Authorization: appSettings.getString('token')}
      }).then(res => {
        if(res.status === null){
          throw Error('伺服器沒有回應');
        } else{
          appSettings.setString('account', '')
          appSettings.setString('token', '')

          TNSFancyAlert.showSuccess("已登出").then(() => {
            this.$navigateTo(Home)
          });
        }
      }).catch(e =>{
        alert('發生錯誤:' + e.message);
      })
    }
  }
}
</script>

<style>

</style>
