<template>
<div id="table" class="app-container calendar-list-container">
	    <!-- 查询和其他操作 -->
	    <div class="filter-container" style="margin: 10px 0 10px 0;">
	      <el-input clearable class="filter-item" style="width: 200px;" v-model="keyword" placeholder="请输入分类名称"></el-input>
	      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFind">查找</el-button>
	      <el-button class="filter-item" type="primary" @click="handleAdd" icon="el-icon-edit">添加</el-button>	      
	    </div>

    <el-table :data="tableData"  style="width: 100%"> 
      <el-table-column type="selection"></el-table-column>
  		
      <el-table-column label="序号" width="60">
	      <template slot-scope="scope">
	        <span >{{scope.$index + 1}}</span>
	      </template>
	    </el-table-column>
	    
	   	<el-table-column label="标题图" width="160">
	      <template slot-scope="scope">
	      	<img  v-if="scope.row.photoList" :src="BASE_IMAGE_URL + scope.row.photoList[0]" style="width: 100px;height: 100px;"/>
	      </template>
	    </el-table-column>
		  
      <el-table-column label="分类名" width="160">
	      <template slot-scope="scope">
	        <span>{{ scope.row.resourceSort.sortName }}</span>
	      </template>
	    </el-table-column>

	    <el-table-column label="名称" width="160">
	      <template slot-scope="scope">
	        <span>{{ scope.row.name }}</span>
	      </template>
	    </el-table-column>

      <el-table-column label="简介" width="160">
	      <template slot-scope="scope">
	        <span>{{ scope.row.summary }}</span>
	      </template>
	    </el-table-column>

      <el-table-column label="点击数" width="100">
	      <template slot-scope="scope">
	        <span>{{ scope.row.clickCount }}</span>
	      </template>
	    </el-table-column>

      <el-table-column label="百度云路径" width="200">
	      <template slot-scope="scope">
	        <span>{{ scope.row.baiduPath }}</span>
	      </template>
	    </el-table-column>
	    
	    <el-table-column label="创建时间" width="160">
	      <template slot-scope="scope">
	        <span >{{ scope.row.createTime }}</span>
	      </template>
	    </el-table-column>
	    
	   	<el-table-column label="状态" width="100">
	   	  <template slot-scope="scope">
		   	  <template v-if="scope.row.status == 1">
		        <span>正常</span>
		      </template>
		      <template v-if="scope.row.status == 2">
		        <span>推荐</span>
		      </template>
		      <template v-if="scope.row.status == 0">
		        <span>已删除</span>
		      </template>
	   	  </template>
	    </el-table-column>
	    
	    <el-table-column label="操作" fixed="right" min-width="150"> 
	      <template slot-scope="scope" >          
	      	<el-button @click="handleEdit(scope.row)" type="primary" size="small">编辑</el-button>
	        <el-button @click="handleDelete(scope.row)" type="danger" size="small">删除</el-button>
	      </template>
	    </el-table-column>     	    
	  </el-table>

		<!--分页-->
    <div class="block">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-size="pageSize"
          layout="total, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
    </div>

	  <!-- 添加或修改对话框 -->
		<el-dialog :title="title" :visible.sync="dialogFormVisible">
		  <el-form :model="form">
		  	
				<el-form-item label="图片" :label-width="formLabelWidth">
	    		<div class="imgBody" v-if="form.photoList">
	    		  	<i class="el-icon-error inputClass" v-show="icon" @click="deletePhoto()" @mouseover="icon = true"></i>
	    			<img @mouseover="icon = true" @mouseout="icon = false" v-bind:src="BASE_IMAGE_URL + form.photoList[0]" style="display:inline; width: 150px;height: 150px;"/>	    		 
	    		</div>
	    		<div v-else class="uploadImgBody" @click="checkPhoto">
 		 			<i class="el-icon-plus avatar-uploader-icon"></i>
		    	</div>				
		    </el-form-item>
		    
		    <el-form-item label="分类名" :label-width="formLabelWidth" required>
		      <el-select
            v-model="form.resourceSortUid"
            filterable
            clearable
            remote
            reserve-keyword
            placeholder="请输入分类名"
            :remote-method="sortRemoteMethod"
            :loading="loading">
            <el-option
              v-for="item in sortOptions"
              :key="item.uid"
              :label="item.sortName"
              :value="item.uid">
            </el-option>
          </el-select>
		    </el-form-item>
		    
		    <el-form-item label="名称" :label-width="formLabelWidth">
		      <el-input v-model="form.name" auto-complete="off"></el-input>
		    </el-form-item>

        <el-form-item label="简介" :label-width="formLabelWidth">
		      <el-input type="textarea" v-model="form.summary" auto-complete="off"></el-input>
		    </el-form-item>

        <!-- <el-form-item label="点击数" :label-width="formLabelWidth">
		      <el-input  v-model="form.clickCount" auto-complete="off"></el-input>
		    </el-form-item> -->

        <el-form-item label="百度云路径" :label-width="formLabelWidth">
		      <el-input type="textarea" v-model="form.baiduPath" auto-complete="off"></el-input>
		    </el-form-item>

        <el-form-item label="正文" :label-width="formLabelWidth">
		      <CKEditor ref="ckeditor" :content="form.content"></CKEditor>
		    </el-form-item>
        
		  </el-form>
		  <div slot="footer" class="dialog-footer">
		    <el-button @click="dialogFormVisible = false">取 消</el-button>
		    <el-button type="primary" @click="submitForm">确 定</el-button>
		  </div>
		</el-dialog>
    		<!--
        	作者：xzx19950624@qq.com
        	时间：2018年9月23日16:16:09
         描述：图片选择器
        -->
		<CheckPhoto @choose_data="getChooseData" @cancelModel="cancelModel" :photoVisible="photoVisible" :photos="photoList" :files="fileIds" :limit="1"></CheckPhoto>

  </div>
</template>

<script>
import {
  getStudyVideoList,
  addStudyVideo,
  editStudyVideo,
  deleteStudyVideo
} from "@/api/studyVideo";

import { getResourceSortList } from "@/api/resourceSort";
import CKEditor from "../../components/CKEditor";
import { formatData } from "@/utils/webUtils";
import CheckPhoto from "../../components/CheckPhoto";
import { Loading } from "element-ui";

export default {
  components: {
    CheckPhoto,
    CKEditor
  },
  created() {
    this.studyVideoList();
  },
  data() {
    return {
      BASE_IMAGE_URL: process.env.BASE_IMAGE_URL,
      tableData: [],
      form: {
        uid: null,
        name: null,
        fileUid: null
      },
      sortKeyword: "",
      sortOptions: [], //分类候选项
      loading: false,
      dialogVisible: false, //控制增加框和修改框的显示
      currentPage: 1,
      total: null,
      pageSize: 10,
      keyword: "",
      title: "增加分类",
      formLabelWidth: "120px", //弹框的label边框
      dialogFormVisible: false,
      isEditForm: false,
      photoVisible: false, //控制图片选择器的显示
      photoList: [],
      fileIds: "",
      icon: false //控制删除图标的显示
    };
  },
  methods: {
    studyVideoList: function() {
      var params = new URLSearchParams();
      params.append("keyword", this.keyword);
      params.append("currentPage", this.currentPage);
      params.append("pageSize", this.pageSize);
      getStudyVideoList(params).then(response => {
        console.log("获取的响应", response);
        this.tableData = response.data.records;
        this.currentPage = response.data.current;
        this.pageSize = response.data.size;
        this.total = response.data.total;

        //给每个评分参考增加指标 和专业
        for (let a = 0; a < response.data.records.length; a++) {
          let tag1 = false;
          this.sortOptions.forEach(element => {
            if (element.uid == response.data.records[a].resourceSort.uid) {
              tag1 = true;
            }
          });
          if (!tag1) {
            this.sortOptions.push(response.data.records[a].resourceSort);
          }
        }
      });
    },
    handleFind: function() {
      console.log(this.keyword);
      this.studyVideoList();
    },
    getFormObject: function() {
      var formObject = {
        uid: null,
        resourceSortUid: null,
        name: null,
        summary: null,
        content: null,
        fileUid: null,
        clickCount: 0
      };
      return formObject;
    },
    //分类远程搜索函数
    sortRemoteMethod: function(query) {
      if (query !== "") {
        var params = new URLSearchParams();
        params.append("keyword", query);
        getResourceSortList(params).then(response => {
          console.log(response);
          this.sortOptions = response.data.records;
        });
      } else {
        this.sortOptions = [];
      }
    },
    //弹出选择图片框
    checkPhoto: function() {
      this.photoList = [];
      this.fileIds = "";
      this.photoVisible = true;
    },
    getChooseData(data) {
      var that = this;
      this.photoVisible = false;
      this.photoList = data.photoList;
      this.fileIds = data.fileIds;
      var fileId = this.fileIds.replace(",", "");
      if (this.photoList.length >= 1) {
        this.form.fileUid = fileId;
        this.form.photoList = this.photoList;
      }
    },
    //关闭模态框
    cancelModel() {
      this.photoVisible = false;
    },
    deletePhoto: function() {
      console.log("点击了删除图片");

      this.form.photoList = null;
      this.form.fileUid = "";
    },
    checkPhoto() {
      this.photoVisible = true;
    },
    //改变页码
    handleCurrentChange(val) {
      var that = this;
      console.log(`当前页: ${val}`);
      this.currentPage = val; //改变当前所指向的页数
      this.studyVideoList();
    },
    //点击新增
    handleAdd: function() {
      var that = this;
      try {
        that.$refs.ckeditor.initData(); //清空CKEditor中内容
      } catch (error) {
        // 第一次还未加载的时候，可能会报错，不过不影响使用
        // 暂时还没有想到可能解决的方法
      }
      console.log("点击了添加");
      this.dialogFormVisible = true;
      this.form = this.getFormObject();
      this.isEditForm = false;
    },
    //点击编辑
    handleEdit: function(row) {
      this.dialogFormVisible = true;
      this.isEditForm = true;
      console.log(row);
      this.form = row;
      var that = this;
      try {
        that.$refs.ckeditor.setData(this.form.content); //设置富文本内容
      } catch (error) {
        // 第一次还未加载的时候，可能会报错，不过不影响使用
        // 暂时还没有想到可能解决的方法
      }
      console.log("点击编辑", this.form);
    },
    handleDelete: function(row) {
      this.$confirm("此操作将会把分类下全部图片删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let params = new URLSearchParams();
          params.append("uid", row.uid);
          deleteStudyVideo(params).then(response => {
            console.log(response);
            if (response.code == "success") {
              this.$message({
                type: "success",
                message: response.data
              });
              this.studyVideoList();
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    submitForm: function() {
      this.form.content = this.$refs.ckeditor.getData(); //获取CKEditor中的内容
      if (this.isEditForm) {
        editStudyVideo(this.form).then(response => {
          console.log(response);
          this.$message({
            type: "success",
            message: response.data
          });
          this.dialogFormVisible = false;
          this.studyVideoList();
        });
      } else {
        addStudyVideo(this.form).then(response => {
          console.log(response);
          if (response.code == "success") {
            this.$message({
              type: "success",
              message: response.data
            });
          } else {
            this.$message({
              type: "error",
              message: response.data
            });
          }

          this.dialogFormVisible = false;
          this.studyVideoList();
        });
      }
    }
  }
};
</script>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  margin: 0, 0, 0, 10px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 150px;
  height: 150px;
  line-height: 150px;
  text-align: center;
}
.imgBody {
  width: 150px;
  height: 150px;
  border: solid 2px #ffffff;
  float: left;
  position: relative;
}
.uploadImgBody {
  margin-left: 5px;
  width: 150px;
  height: 150px;
  border: dashed 1px #c0c0c0;
  float: left;
  position: relative;
}
.uploadImgBody :hover {
  border: dashed 1px #00ccff;
}
.inputClass {
  position: absolute;
}
.img {
  width: 100%;
  height: 100%;
}
</style>