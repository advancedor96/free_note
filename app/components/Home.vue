<template>
  <Page class="Page">
    <MyActionBar v-on:refresh="getPost"/>
    <StackLayout>
      <FlexboxLayout class="title">
        <Button class="btn btn-primary" text='新增文章' @tap="goToAdd"></Button>
        <Label text="長按文章有功能" class="h3 m-r-10"></Label>
      </FlexboxLayout>
      <Label text="下拉以重新整理" v-if="posts.length===0"></Label>
      <PullToRefresh @refresh="refreshList">
        <ListView for="item in posts" class="list-group">
          <v-template>
            <GridLayout class="list-group-item" rows="auto, *" columns="45, *" @longPress="onLongPress(item)">
              <Label class="fa" row="0" col="0" rowSpan="2" text.decode="&#xf0f6;" style="font-size:28; color: black;"/>
              <Label row="0" col="1" :text="item.content" class="list-group-item-heading"  />
              <Label row="1" col="1" :text="item.date" class="list-group-item-text" />
            </GridLayout>
          </v-template>
        </ListView>
      </PullToRefresh>
    </StackLayout>
  </Page>


</template>

<script>
const Geolocation = require("nativescript-geolocation");
const Accuracy = require("tns-core-modules/ui/enums");
const httpModule = require("http");
const appSettings = require('application-settings');
import MyActionBar from './MyActionBar'
import Login from './Login'
import Add from './Add'
import Edit from './Edit'
import Register from './Register'
var Toast = require("nativescript-toast");
import dayjs from 'dayjs';
import axios from 'axios';
export default {
  components: {MyActionBar},
  created(){ 
    this.getPost();
  },
  data () {
    return {
      posts: []
    };
  },
  methods: {
    onLongPress(diary){
      let options = {
          title: "選擇動作",
          cancelButtonText: "取消",
          actions: ["編輯", "刪除"]
      };

      action(options).then((result) => {
        if(result === '編輯'){
          this.$navigateTo(Edit, {
            props: {
              diary: diary
            }
          });
        } else if(result === "刪除"){
          console.log('確定刪了')
          this.deleteDiaryBy(diary._id);
        }
      });
    },
    async deleteDiaryBy(id){
      try{
        let res = await axios.post('http://172.104.76.31:5000/api/diary/delete', {
          id: id
        },{
          headers: { Authorization: appSettings.getString('token')}
        })

        if(res.status === null){
          throw Error('伺服器沒有回應');
        } else if(res.status === 200){
          alert('成功')
          this.getPost();
        } else{
          throw Error()
        }
      } catch(e){
        alert('發生錯誤:' + e);
      }
    },
    refreshList(args) {
      var pullRefresh = args.object;
      this.getPost();
      setTimeout(function() {
        pullRefresh.refreshing = false;
      }, 1000);
    },
    goToAdd(){
      this.$navigateTo(Add);
    },
    getPost(){
      // console.log('讀取 post list.. 使用 token:', appSettings.getString('token'))
      axios.get('http://172.104.76.31:5000/api/diary', {
        headers: { Authorization: appSettings.getString('token')}
      }).then(res => {
        if(res.status === null){
          throw Error('伺服器沒有回應');
        }
        else if(res.data){
          this.posts = res.data
          .map(el => {
            return {
              _id: el._id,
              content: el.content,
              account: el.email,
              date: dayjs(el.date).format('YYYY-MM-DD HH:mm')
            }
          })
        }

      }).catch(e =>{
        if(e.response){
          if(e.response.status === 401){
            alert('尚未登入，請先登入')
            this.$navigateTo(Login);
          }
        } else{
          alert('發生錯誤:' + e.message);
        }
      })

    }
  }
};
</script>

<style scoped lang="scss">
    // Start custom common variables
    @import '../app-variables';
    // End custom common variables

    // Custom styles
    .fa {
        color: $accent-dark;
    }
    .title{
      justify-content: space-between;
      align-items: center;
    }
</style>
