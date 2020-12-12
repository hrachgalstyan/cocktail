import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import image from '../assets/cocktail.svg';
import axios from 'axios';
import {Modal, Input} from 'antd';

const {TextArea} = Input;

// {
//   title: "Մոհիտո",
//   description: "Կուբայի մայրաքաղաք Հավանան մոհիտոյի ծննդավայրն է, չնայած որ այս դասական կոկտեյլի ճշգրիտ ծագումը վիճաբանությունների առարկա է հանդիսանում: Մի պատմության մեջ Մոհիտոն նմանեցվում է 16-րդ դարի Ֆրենսիս Դրեյքի El Draque խմիչքին:",
//   price: 1200,
//   image_path: "https://storage.googleapis.com/vfruits-293408.appspot.com/cocktails/cocktail.webp",
//   ingredients: ["Սպիտակ ռոմ", "Շաքարավազ", "Կիտրոնի հյութ", "Հանքային ջուր", "Դաղձ"]
// }

export default function Navbar() {
  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [data, setData] = useState({});

  const onSubmit = async () => {
    setConfirmLoading(true);
    await axios.post(`/api/cocktails`, data)
    .then(res => {
      console.log(res);
      const modal = Modal.success({
        content: 'Product Created!',
      });
      setTimeout(() => {
        modal.destroy();
      }, 2000);
    })
    .catch(err => console.log(err.message));
    setConfirmLoading(false);
    setVisible(false);
  }

  const handleCancel = () => {
    setVisible(false);
  }

  const selectIngredients = (e) => {
    const re = /,[ ]*/g
    let arr = (e.target.value).split(re);
    setData({...data, ingredients: arr})
  }

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
        <button className="d-flex align-items-center mx-2 py-2 px-3 add_btn font-weight-light" onClick={() => setVisible(true)}>
          <ion-icon name="add-outline" style={{fontSize: "20px", marginRight: "5px"}}></ion-icon>
          Ավելացնել
        </button>
      </div>
      <Modal
        title="Ավելացնել կոկտեյլ"
        visible={visible}
        onOk={onSubmit}
        centered
        onCancel={handleCancel}
        confirmLoading={confirmLoading}
        okText="Պահպանել"
        cancelText="Չեղարկել"
      >
        <span className="px-1">Անվանում</span>
        <Input
          style={{height: "40px", borderRadius: "5px"}} 
          className="px-3 mt-2 mb-3"
          placeholder="Օր․՝ Մոհիտո"
          onChange={(event) => setData({...data, title: event.target.value})}
        />
        <span className="px-1">Գին</span>
        <Input
          type="number"
          style={{height: "40px", borderRadius: "5px"}} 
          className="px-3 mt-2 mb-3"
          placeholder="Օր․՝ 1200"
          onChange={(event) => setData({...data, price: Number(event.target.value)})}
        />
        <span className="px-1">Պատկերի հղում</span>
        <Input
          style={{height: "40px", borderRadius: "5px"}} 
          className="px-3 mt-2 mb-3"
          placeholder="Օր․՝ https://storage.googleapis.com/vfruits-293408.appspot.com/cocktails/cocktail.webp"
          onChange={(event) => setData({...data, image_path: event.target.value})}
        />
        <span className="px-1 mt-3">Բաղադրիչներ (Առանձնացրեք ստորակետներով)</span>
        <Input 
          style={{height: "40px", borderRadius: "5px"}} 
          className="px-3 mt-2 mb-3"
          placeholder="Օր․՝ Սպիտակ ռոմ, Շաքարավազ, Կիտրոնի հյութ, Հանքային ջուր, Դաղձ"
          onChange={(event) => selectIngredients(event)}
        />
        <span className="px-1">Նկարագրություն</span>
        <TextArea
          style={{borderRadius: "5px"}} 
          className="px-3 mt-2 mb-3"
          rows={6}
          placeholder="Օր․՝ Կուբայի մայրաքաղաք Հավանան մոհիտոյի ծննդավայրն է․․․"
          onChange={(event) => setData({...data, description: event.target.value})}
        />
      </Modal>
    </div>
  )
}
