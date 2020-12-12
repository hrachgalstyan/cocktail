import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import { Card, Result } from 'antd';

const { Meta } = Card;

export default function Products() {
  const [cocktails, setCocktails] = useState([]);

  useEffect(() => {
    async function fetchData() {
      await axios.get(`/api/cocktails`)
      .then(res => {
        console.log(res.data);
        let result = [...res.data];
        setCocktails(result);
      })
      .catch(err => console.log(err.message));
    }
    fetchData();
  }, []);

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
