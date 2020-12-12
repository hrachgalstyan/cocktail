import React, { Component } from 'react';
import axios from 'axios';
import { Rate, Modal, Input, Result } from 'antd';
import { withRouter } from "react-router";
import {EditOutlined} from "@ant-design/icons";
import {Link} from 'react-router-dom';

const {TextArea} = Input;

class SingleCocktail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cocktail: {},
      ingredients: [],
      id: null,
      editVisible: false,
      confirmLoading: false,
      deleteVisible: false
    }
    this.componentDidMount = this.componentDidMount.bind(this);
    this.getData = this.getData.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.selectIngredients = this.selectIngredients.bind(this);
    this.deleteOk = this.deleteOk.bind(this);
    this.deleteCancel = this.deleteCancel.bind(this);
  }

  getData = async () => {
    const id = this.props.match.params.id;
    await axios.get(`/api/cocktails/${id}`)
      .then(res => {
        console.log(res.data);
        this.setState({
          cocktail: res.data[0],
          ingredients: res.data[0].ingredients
        })
      })
      .catch(err => console.log(err.message));
  }

  async componentDidMount(){
    this.getData();
  }

  onSubmit = async () => {
    this.setState({
      confirmLoading: true
    })
    const id = this.props.match.params.id;
    const data = this.state.cocktail;
    await axios.put(`/api/cocktails/${id}`, data)
      .then(res => {
        console.log(res.data[0]);
        const modal = Modal.success({
          content: 'Product Updated!',
        });
        setTimeout(() => {
          modal.destroy();
        }, 2000);
        this.getData();
      })
      .catch(err => console.log(err.message));
    this.getData();
    this.setState({
      editVisible: false,
      confirmLoading: false
    })
  }

  handleCancel = () => {
    this.setState({
      editVisible: false
    })
  }

  selectIngredients = (e) => {
    const {cocktail} = this.state;
    const re = /[ ]*,[ ]*/g;
    let arr = (e.target.value).split(re);
    this.setState({cocktail: {...cocktail, ingredients: arr}});
  }

  deleteOk = async () => {
    this.setState({
      confirmLoading: true
    });
    const id = this.props.match.params.id;
    await axios.delete(`/api/cocktails/${id}`)
      .then(res => {
        console.log(res.data);
        const modal = Modal.error({
          content: 'Product Deleted!',
        });
        setTimeout(() => {
          modal.destroy();
          window.location.href = "/";
        }, 2000);
      })
      .catch(err => console.log(err));
    this.setState({
      deleteVisible: false,
      confirmLoading: false
    });
  }

  deleteCancel = () => {
    this.setState({
      deleteVisible: false
    });
  }

  render() {
    const {cocktail, ingredients, editVisible, confirmLoading, deleteVisible} = this.state;
    if(Object.keys(cocktail).length === 0){
      return (
        <>
          <Result
            status="404"
            title="404"
            subTitle="Sorry, we will add to the range soon!"
            extra={<Link to='/' className="d-flex align-items-center justify-content-center add_btn py-2 px-3 font-weight-light mx-auto" style={{maxWidth: "150px"}}>Back Home</Link>}
          />
        </>
      )
    } else {
      return (
        <div className="container d-flex flex-wrap my-3 my-md-5 pt-5 mx-auto">
          <div className="col-lg-5 col-md-11 col-sm-11 col-11 mx-auto">
            <img src={cocktail.image_path} alt={cocktail.title} width="100%" />
          </div>
          <div className="d-flex flex-column align-items-start col-lg-7 col-md-11 col-sm-11 col-11 mx-auto">
            <h2 className="mt-4" style={{color: "#35C57A", fontSize: "50px", textTransform: 'uppercase', fontWeight: 900, letterSpacing: "0.1rem", lineHeight: "0.5"}}>{cocktail.title}</h2>
            <div className="d-flex align-items-end">
              <span className="font-weight-light" style={{fontSize: "40px", fontFamily: "Tahoma", color: "rgba(0, 0, 0, 0.5)"}}>{cocktail.price}/</span>
              <span style={{fontSize: "12px", marginBottom: "10px"}}>դրամ</span>
            </div>
            <Rate allowHalf defaultValue={4.5} />
            <span className="font-weight-light text-justify mb-3" style={{fontSize: "16px"}}>{cocktail.description}</span>
            <div className="d-flex flex-wrap align-items-center">
              <span>Բաղադրիչներ։ &nbsp;</span> {ingredients && ingredients.map((item, index) => {
                return (
                  <span style={{color: "#35C57A", fontSize: "18px"}} key={index}>
                    {item},&nbsp;
                  </span>
                )
              })}
            </div>
            <div className="d-flex mt-4">
              <button className="d-flex align-items-center mr-2 py-2 px-3 add_btn font-weight-light" onClick={() => {
                this.setState({
                  editVisible: true
                })
              }}>
                <EditOutlined style={{color: "#fff", padding: "8px"}} />
                Փոփոխել
              </button>
              <button className="d-flex align-items-center mx-2 py-2 px-3 add_btn font-weight-light" style={{background: "red"}} onClick={() => {
                this.setState({
                  deleteVisible: true
                })
              }}>
                <ion-icon name="trash-outline" style={{fontSize: "20px", marginRight: "5px"}}></ion-icon>
                Ջնջել
              </button>
            </div>
          </div>
          <Modal
            title="Փոփոխել կոկտեյլը"
            visible={editVisible}
            onOk={this.onSubmit}
            centered
            onCancel={this.handleCancel}
            confirmLoading={confirmLoading}
            okText="Պահպանել"
            cancelText="Չեղարկել"
          >
            <span className="px-1">Անվանում</span>
            <Input
              style={{height: "40px", borderRadius: "5px"}} 
              className="px-3 mt-2 mb-3"
              placeholder="Օր․՝ Մոհիտո"
              value={cocktail.title}
              onChange={(event) => {this.setState({cocktail: {...cocktail, title: event.target.value}})}}
            />
            <span className="px-1">Գին</span>
            <Input
              type="number"
              style={{height: "40px", borderRadius: "5px"}} 
              className="px-3 mt-2 mb-3"
              placeholder="Օր․՝ 1200"
              value={cocktail.price}
              onChange={(event) => {this.setState({cocktail: {...cocktail, price: Number(event.target.value)}})}}
            />
            <span className="px-1">Պատկերի հղում</span>
            <Input
              style={{height: "40px", borderRadius: "5px"}} 
              className="px-3 mt-2 mb-3"
              placeholder="Օր․՝ https://storage.googleapis.com/vfruits-293408.appspot.com/cocktails/cocktail.webp"
              value={cocktail.image_path}
              onChange={(event) => {this.setState({cocktail: {...cocktail, image_path: event.target.value}})}}
            />
            <span className="px-1 mt-3">Բաղադրիչներ (Առանձնացրեք ստորակետներով)</span>
            <Input 
              style={{height: "40px", borderRadius: "5px"}} 
              className="px-3 mt-2 mb-3"
              placeholder="Օր․՝ Սպիտակ ռոմ, Շաքարավազ, Կիտրոնի հյութ, Հանքային ջուր, Դաղձ"
              value={cocktail.ingredients}
              onChange={(e) => this.selectIngredients(e)}
            />
            <span className="px-1">Նկարագրություն</span>
            <TextArea
              style={{borderRadius: "5px"}} 
              className="px-3 mt-2 mb-3"
              rows={6}
              placeholder="Օր․՝ Կուբայի մայրաքաղաք Հավանան մոհիտոյի ծննդավայրն է․․․"
              value={cocktail.description}
              onChange={(event) => {this.setState({cocktail: {...cocktail, description: event.target.value}})}}
            />
          </Modal>
          <Modal
            title="Հեռացնել"
            centered
            visible={deleteVisible}
            confirmLoading={confirmLoading}
            onOk={this.deleteOk}
            onCancel={this.deleteCancel}
          >
            <p>Դուք իրո՞ք ցանկանում եք հեռացնել կոկտեյլը</p>
          </Modal>
        </div>
      );
    }
  }
}

export default withRouter(SingleCocktail);
