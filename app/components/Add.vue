<template>
  <Page class="Page">
    <ActionBar title="新增" class="action-bar">
      <NavigationButton android.systemIcon="ic_menu_back" text="Back to ActionBar" @tap="$navigateBack"></NavigationButton>
    </ActionBar>
    <StackLayout>
      <Button text='新增' @tap="add" class="btn btn-secondary"></Button>
      <TextView 
        v-model="content" 
        hint="Enter text..." 
        class="input input-border"
        autocorrect="false"
        height="50%"
      ></TextView>
    </StackLayout>
  </Page>
  
</template>

<script>
const httpModule = require("http");
const appSettings = require('application-settings');
import Home from './Home'
import axios from 'axios';
export default {

  data() {
    return {
      content: '',
    }
  },
  methods: {
    async add(){
      try{
        let res = await axios.post('http://172.104.76.31:5000/api/diary/add', {
          content: this.content,
          email: appSettings.getString('account')
        },{
          headers: { Authorization: appSettings.getString('token')}
        })
        if(res.status === null){
          throw Error('伺服器沒有回應');
        } else if(res.status === 200){
          alert('成功')
          this.$navigateTo(Home)
        } else{
          throw Error()
        }
      } catch(e){
        alert('發生錯誤:' + e);
      }
    }
  }

}
</script>

<style>

</style>
