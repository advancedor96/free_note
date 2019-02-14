<template>
  <Page class="Page">
    <ActionBar title="註冊" class="action-bar">
      <NavigationButton text="Go back" android.systemIcon="ic_menu_back" @tap="$navigateBack" />
    </ActionBar>
    <StackLayout class="register">
      <TextField v-model="name" hint="name" />
      <TextField v-model="account" hint="account" />
      <WrapLayout>
        <TextField v-model="password" width="80%" hint="password" :secure="hidePwd" />
        <Label class="fa slash" :text="eyeIcon | fonticon" width="20%" @tap="toggleHidePwd"></Label>
      </WrapLayout>

      <Button text='註冊' @tap="register" class="btn btn-primary"></Button>
      <Button text='取消' @tap="$navigateBack" class="btn btn-secondary"></Button>
    </StackLayout>
  </Page>
  
</template>

<script>
const httpModule = require("http");
const appSettings = require('application-settings');
import { TNSFancyAlert, TNSFancyAlertButton } from "nativescript-fancyalert";
import Login from './Login'
import axios from 'axios';
export default {
  data() {
    return {
      name: '',
      account: '',
      password: '',
      hidePwd: true
    }
  },
  computed: {
    eyeIcon: function(){ return this.hidePwd ? 'fa-eye-slash' : 'fa-eye' }
  },
  methods: {
    toggleHidePwd(){
      this.hidePwd = !this.hidePwd
    },
    register(){
      axios.post('http://172.104.76.31:5000/api/users/register', {
        email: this.account,
        password: this.password,
        name: this.name
      }).then(res => {
        if(res.status === null){
          throw Error('伺服器沒有回應');
        } else if(res.data){
          let account = res.data.email
          appSettings.setString('account', account);

          TNSFancyAlert.showSuccess(
            "註冊成功",
            "請使用剛註冊的帳號密碼登入",
            "OK"
          ).then(() => {
            this.$navigateTo(Login);
          });
        } 
      }).catch(e => {
        console.log('e',e)
        if(e.response && e.response.status === 400){
          alert('註冊失敗。原因：email 已被使用');
        } else{
          TNSFancyAlert.showError("註冊失敗", e.message).then(() => {
            this.$navigateBack()
          });
        }
      })
    }
  }
}
</script>

<style lang="scss">
.register{
  padding: 10;
  .slash{
    font-size: 40;
    line-height: 40;
  }
}
</style>
