<template>
  <Page class="Page">
    <ActionBar title="編輯文章" />
    <StackLayout>
      <Button text='儲存' @tap="save"></Button>
      <Button text='回上一步' @tap="$navigateBack"></Button>
      <TextView v-model="content" hint="Enter text..."></TextView>
    </StackLayout>
  </Page>
  
</template>

<script>
const httpModule = require("http");
const appSettings = require('application-settings');
import Home from './Home'
import axios from 'axios';
export default {
  props: ['diary'],
  created(){
    this.id = this.diary._id
    this.content = this.diary.content
    this.account = this.diary.account
    this.date = this.diary.date
  },
  data() {
    return {
      id: null,
      content: null,
      account: null,
      date: null
    }
  },
  methods: {
    async save(){
      try{
        let res = await axios.post('http://172.104.76.31:5000/api/diary/update', {
          _id: this.id,
          content: this.content,
          account: appSettings.getString('account')
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
