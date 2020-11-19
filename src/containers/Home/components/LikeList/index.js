import React, { Component } from "react";
import "./style.css";
import LikeItem from "../LikeItem";
import Loading from "../../../../components/Loading";

class LikeList extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef()
    this.removeListener = false;
  }
  render() {
    const { data, pageCount } = this.props;
    return (
      <div ref={this.myRef} className="likeList">
        <div className="likeList__header">猜你喜欢</div>
        <div className="likeList__list">
          {data.map((item, index) => {
            return <LikeItem key={index} data={item} />;
          })}
        </div>
        {pageCount < 3 ? (
          <Loading />
        ) : (
          <a className="likeList__viewAll">查看更多</a>
        )}
      </div>
    );
  }

  componentDidMount() {
    if(this.props.pageCount < 3) {
      document.addEventListener("scroll", this.handScroll);
    } else {
      this.removeListener = true;
    }
    
    if(this.props.pageCount === 0) {
      this.props.fetchData();
    }
  }

  componentDidUpdate() {
      if(this.props.pageCount >= 3 ){
        document.removeEventListener("scroll", this.handScroll);
        this.removeListener = true;
      }
  }

  componentWillUnmount() {
    !this.removeListener && document.removeEventListener("scroll", this.handScroll);
  }

  handScroll = () => {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTo;
    const screenHeight = document.documentElement.clientHeight;
    const likeListTop = this.myRef.current.offsetTop;
    const likeListHeight = this.myRef.current.offsetHeight;
    console.log(likeListHeight);
    if(scrollTop >= likeListHeight + likeListTop - screenHeight) {
        this.props.fetchData()
    }
  }
}

export default LikeList;
