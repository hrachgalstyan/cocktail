import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import image from '../assets/cocktail.svg';
import axios from 'axios';
import {Modal, Input, Upload, Progress, message} from 'antd';
import {storage} from './firebase';
import { withRouter } from "react-router";
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import ImgCrop from 'antd-img-crop';

const {TextArea} = Input;

// {
//   title: "Մոհիտո",
//   description: "Կուբայի մայրաքաղաք Հավանան մոհիտոյի ծննդավայրն է, չնայած որ այս դասական կոկտեյլի ճշգրիտ ծագումը վիճաբանությունների առարկա է հանդիսանում: Մի պատմության մեջ Մոհիտոն նմանեցվում է 16-րդ դարի Ֆրենսիս Դրեյքի El Draque խմիչքին:",
//   price: 1200,
//   image_path: "https://storage.googleapis.com/vfruits-293408.appspot.com/cocktails/cocktail.webp",
//   ingredients: ["Սպիտակ ռոմ", "Շաքարավազ", "Կիտրոնի հյութ", "Հանքային ջուր", "Դաղձ"]
// }

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}
class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      confirmLoading: false,
      loading: false,
      image: null,
      progress: 0,
      data: {
        title: "",
        description: "",
        price: null,
        image_path: null,
        ingredients: []
      }
    }
  }

  onSubmit = async () => {
    this.setState({
      confirmLoading: true
    });
    const {data} = this.state;
    await axios.post(`/api/cocktails`, data)
    .then(res => {
      console.log(res);
      const modal = Modal.success({
        content: 'Product Created!',
      });
      setTimeout(() => {
        modal.destroy();
        window.location.href = '/';
      }, 2000);
    })
    .catch(err => console.log(err.message));
    this.setState({
      confirmLoading: false,
      visible: false
    })
  }

  handleCancel = () => {
    this.setState({
      visible: false
    })
  }

  selectIngredients = (e) => {
    const {data} = this.state;
    const re = /,[ ]*/g
    let arr = (e.target.value).split(re);
    this.setState({
      data: {
        ...data,
        ingredients: arr
      }
    })
  }

  beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/webp';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG/Webp file!');
    }
    const isLt2M = file.size < 819021724;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  }

  customUpload = async (file) => {
    const image = file.file;
    const date = (Date.now() + 14400000).toString();
    const uploadTask = storage.ref(`cocktails/${date + image.name}`).put(image);
    uploadTask.on(
      "state_changed",
      snapshot => {
        this.setState({
          progress: Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
        });
      },
      error => {
        console.log(error)
      },
      () => {
        storage
          .ref("cocktails")
          .child(date + image.name)
          .getDownloadURL()
          .then(async url => {
            await this.setState({data: {...this.state.data, image_path: url}, loading: false});
          })
      }
    )
  }

  handleChange = info => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, () =>
        this.setState({
          loading: false
        }),
      );
    }
  };

  render() {
    const {loading, visible, confirmLoading, progress, data} = this.state;
    const uploadButton = (
      <div>
        {loading ? <LoadingOutlined /> : <PlusOutlined />}
        <div style={{ marginTop: 8 }}>Upload Image</div>
      </div>
    );
    return (
      <div className="container-fluid py-4 d-flex justify-content-between" style={{background: "#303030"}}>
      <Link to='/'>
        <div className="d-flex justify-content-center align-items-center ml-2 ml-md-5">
          <img src={image} alt="logo" height={50} />
          <span className="font-weight-light" style={{color: "#fff", fontSize: "36px"}}>Cocktails</span>
        </div>
      </Link>
      <div className="d-none align-items-center d-lg-flex">
        <span className="mx-3" style={{color: "#fff", fontSize: "16px"}}>Գլխավոր</span>
        <span className="mx-3" style={{color: "#fff", fontSize: "16px"}}>Ծառայություններ</span>
        <span className="mx-3" style={{color: "#fff", fontSize: "16px"}}>Մեր մասին</span>
        <span className="mx-3" style={{color: "#fff", fontSize: "16px"}}>Կապ</span>
      </div>
      <div className="d-flex align-items-center mr-2 mr-md-5">
        <button className="d-flex align-items-center mx-2 py-2 px-3 add_btn font-weight-light" onClick={() => this.setState({visible: true})}>
          <ion-icon name="add-outline" style={{fontSize: "20px", marginRight: "5px"}}></ion-icon>
          Ավելացնել
        </button>
      </div>
      <Modal
        title="Ավելացնել կոկտեյլ"
        visible={visible}
        onOk={this.onSubmit}
        centered
        onCancel={this.handleCancel}
        confirmLoading={confirmLoading}
        okText="Պահպանել"
        cancelText="Չեղարկել"
      >
        <Progress percent={progress} style={{width: "187px"}} />
        <ImgCrop rotate grid={true} quality={1}>
          <Upload
            name="avatar"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            beforeUpload={this.beforeUpload}
            onChange={this.handleChange}
            customRequest={this.customUpload}
          >
            {data.image_path ? <img src={data.image_path} alt="avatar" width={104} height={104} /> : uploadButton}
          </Upload>
        </ImgCrop>
        <span className="px-1">Անվանում</span>
        <Input
          style={{height: "40px", borderRadius: "5px"}} 
          className="px-3 mt-2 mb-3"
          placeholder="Օր․՝ Մոհիտո"
          onChange={(event) => this.setState({data: {...data, title: event.target.value}})}
        />
        <span className="px-1">Գին</span>
        <Input
          type="number"
          style={{height: "40px", borderRadius: "5px"}} 
          className="px-3 mt-2 mb-3"
          placeholder="Օր․՝ 1200"
          onChange={(event) => this.setState({data: {...data, price: Number(event.target.value)}})}
        />
        <span className="px-1 mt-3">Բաղադրիչներ (Առանձնացրեք ստորակետներով)</span>
        <Input 
          style={{height: "40px", borderRadius: "5px"}} 
          className="px-3 mt-2 mb-3"
          placeholder="Օր․՝ Սպիտակ ռոմ, Շաքարավազ, Կիտրոնի հյութ, Հանքային ջուր, Դաղձ"
          onChange={(event) => this.selectIngredients(event)}
        />
        <span className="px-1">Նկարագրություն</span>
        <TextArea
          style={{borderRadius: "5px"}} 
          className="px-3 mt-2 mb-3"
          rows={6}
          placeholder="Օր․՝ Կուբայի մայրաքաղաք Հավանան մոհիտոյի ծննդավայրն է․․․"
          onChange={(event) => this.setState({data: {...data, description: event.target.value}})}
        />
      </Modal>
    </div>
    );
  }
}

export default withRouter(Navbar);