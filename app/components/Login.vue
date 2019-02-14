<template>
  <Page class="Page">
    <ActionBar title="登入" class="action-bar">
      <NavigationButton text="Go back" android.systemIcon="ic_menu_back" @tap="$navigateBack" />
    </ActionBar>
    <FlexboxLayout flexDirection="column" class="login">
      <TextField v-model="account" hint="account" />
      <WrapLayout>
        <TextField v-model="password" width="80%" hint="password" :secure="hidePwd"/>
        <Label class="fa slash" :text="eyeIcon | fonticon" width="20%" @tap="hidePwd = !hidePwd"></Label>
      </WrapLayout>
      <Button text='登入' @tap="login" class="btn btn-primary"></Button>
      <Button text='註冊' @tap="register" class="btn btn-secondary"></Button>
    </FlexboxLayout>
  </Page>
  
</template>

<script>
const httpModule = require("http");
const appSettings = require('application-settings');
import Home from './Home'
import Register from './Register'
import { TNSFancyAlert, TNSFancyAlertButton } from "nativescript-fancyalert";

import axios from 'axios';

export default {
  created (){

  },
  data() {
    return {
      account: appSettings.getString('account'),
      password: '',
      hidePwd: true
    }
  },
  computed: {
    eyeIcon: function(){ return this.hidePwd ? 'fa-eye-slash' : 'fa-eye' }
  },
  methods: {
    login(){
      axios.post('http://172.104.76.31:5000/api/users/login', {
        email: this.account,
        password: this.password
      }).then(res => {
        if(res.status === null){
          throw Error('伺服器沒有回應');
        } else if(res.data){
          let token = res.data.token
          alert('登入成功')
          appSettings.setString('token', token);
          appSettings.setString('account', this.account);
          this.$navigateTo(Home)
        } 
      }).catch(e => {
        alert('發生錯誤:' + e.message);
      })

    },
    register(){
      this.$navigateTo(Register)
    }
  }

}
</script>

<style lang="scss" scoped>
.login{
  padding: 10;
  .slash{
    font-size: 40;
    line-height: 40;
  }
}
</style>
