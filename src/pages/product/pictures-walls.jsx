import { Upload, Icon, Modal, message } from 'antd';
import React from 'react'
import PropTypes from "prop-types"
import {reqDeletePicture} from '../../api'
import {IMG_BASE_URL}  from '../../utils/constant'

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

export default class PicturesWall extends React.Component {

    static propTypes = {
        imgs: PropTypes.array
      }


  state = {
    previewVisible: false,
    previewImage: '',
    fileList: [],
  };
  getImgs=()=>{
      return this.state.fileList.map((item)=>item.name)
  }
  componentWillMount() {
      // 根据传入的imgs生成fileList并更新
      const imgs=this.props.imgs
      //如果img存在，就遍历生成图片
      if(imgs && imgs.length>0){
          const fileList=imgs.map((item,index)=>({
            uid: -index, // 唯一标识
            name: item, // 文件名
            status: 'done', // 状态有：uploading done error removed
            url: IMG_BASE_URL + item
          }))
        this.setState({
            fileList

        })
      }
      
  }
  

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };
/*
当文件进行上传/删除时，文件状态发生改变时调用
*/
  handleChange =async ({ file,fileList }) =>{
    console.log(file.status)
        if (file.status==='done') {
           
            // 将数组最后一个file保存到file变量
            file = fileList[fileList.length - 1]
            // 取出响应数据中的图片文件名和url
            const {name, url} = file.response.data
            // 保存到上传的file对象,更换为响应数据中自己的name和URL
            file.name = name
            file.url = url
        }else if(file.status==='removed'){ //删除
            //发送删除的请求
            const result=await reqDeletePicture(file.name)
            if(result.status===0){
                message.success('图片删除成功。')
            }
        }
        //更新状态显示
        this.setState({ fileList })
  }
        

     

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div >
        <Upload
          action="/manage/img/upload"
          listType="picture-card"
          name='image' //发到后台的参数名
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
            {/* 规定上传几张图片 */}
          {fileList.length >= 4 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}
