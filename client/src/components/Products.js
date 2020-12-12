import React, { Component } from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import { Card, Result } from 'antd';

const { Meta } = Card;

class Products extends Component {
  constructor(props){
    super(props);
    this.state = {
      loading: false,
      cocktails: [],
    };
    this.componentWillMount = this.componentWillMount.bind(this);
    this.render = this.render.bind(this);
  }

  async componentWillMount(){
    this.setState({
      loading: true
    });
    await axios.get(`/api/cocktails`)
      .then(res => {
        console.log(res.data);
        this.setState({
          cocktails: res.data
        })
      })
      .catch(err => console.log(err.message));
    this.setState({
      loading: false
    });
  }

  render() {
    const {cocktails} = this.state;
    if(cocktails.length === 0){
      return (
        <>
          <Result
            status="404"
            title="404"
            subTitle="Sorry, we will add to the range soon!"
            extra={<button className="d-flex align-items-center add_btn py-2 px-3 font-weight-light mx-auto">Back Home</button>}
          />
        </>
      )
    } else {
        return (
          <div>
            <div className="container d-flex flex-wrap pb-5">
              {cocktails && cocktails.map(item => {
                return (
                  <div className="col-lg-3 col-md-4 col-sm-6 col-12 mt-3 mt-lg-4" key={item.id}>
                    <Link to={`/cocktails/${item.id}`}>
                      <Card
                        hoverable
                        cover={<img alt="example" src={item.image_path} width="100%" />}
                      >
                        <Meta title={item.title} description={`${item.description.slice(0, 40)}...`} />
                      </Card>
                    </Link>
                  </div>
                )
              })}
            </div>
          </div>
        )
    }
  }
}

export default Products;
