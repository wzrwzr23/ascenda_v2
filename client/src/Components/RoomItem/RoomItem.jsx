import React from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import '../../Components/RoomItem/RoomItem.css'
import {SearchContext} from "../../Context/SearchContext";

class RoomList extends React.Component {
    state = {
        list: [],
        current_page: 1,  //current number of page
        current_index: 10, //current index of hotel_list
        totalPage: 0,  //total number of page
        rooms:[],
        redirect: false,
    }

    static contextType = SearchContext

    getStartDate () {
        const dates = this.context.dates
        let start;
        try{
            start = JSON.stringify(dates[0].startDate).slice(1, 11)
        } catch(e){
            start = "2022-09-23"
        }
        return start
    }

    getEndDate () {
        const dates = this.context.dates
        let end;
        try{
            end = JSON.stringify(dates[0].endDate).slice(1, 11)
        } catch(e){
            end = "2022-09-24"
        }
        return end
    }

    getGuest () {
        const options = this.context.options
        let guest;
        try{
            guest = options.guest
            if (guest === undefined){
                guest = "1"
            }
        }catch (e) {
            guest = "1"
        }
        return guest
    }

    timeout = (delay: number) => {
        return new Promise( res => setTimeout(res, delay) );
    }
    initData = async (hotel_id, dest_id) => {
        console.log(this.context)
        const start = this.getStartDate()
        console.log(start)
        const end = this.getEndDate()
        console.log(end)
        const guest = this.getGuest()
        console.log(guest)
        let res = await axios.get(`https://hotelapi.loyalty.dev/api/hotels/${hotel_id}/price?destination_id=${dest_id}&&checkin=${start}&checkout=${end}&lang=en_US&currency=SGD&country_code=SG&guests=${guest}&partner_id=1`);
        await this.timeout(3000)
        res = await axios.get(`https://hotelapi.loyalty.dev/api/hotels/${hotel_id}/price?destination_id=${dest_id}&checkin=${start}&checkout=${end}&lang=en_US&currency=SGD&country_code=SG&guests=${guest}&partner_id=1`)
        this.setState({
            rooms:res.data.rooms.slice(0, this.state.pageSize),
            totalList: res.data.rooms,
            totalPage: Math.ceil(res.data.rooms.length / 10),
        })
    }

    loader = async () => {
        await this.timeout(6500)
        await this.setState({
            current_index: this.state.current_index+10,
            current_page: this.state.current_page + 1,
        })
        console.log("---------------------------------------------")
    }
    book = async (key) =>{
        try{
            const res = axios.post('/Kkeys', {
                "key": key
            });
            return res.data;
        }catch(err){}
    }

    componentDidMount () {
        const url = window.location.href.toString()
        const hotel_id = url.substring(url.lastIndexOf("/") + 1, url.length);
        const params = url.split("/")
        const dest_id = params[4]
        this.initData(hotel_id, dest_id);
    }
    render() {
        return (
            <div className="roomItems">
                <div className="riDes">
                {
                    this.state.rooms.map((item) => {
                        return (
                            <div className="roomItem">
                                <div className="riDesc">
                                    <h1 className="riTitle">{item.price_type} room</h1>
                                </div>
                                <div className="riSubtitle">
                                    {item.description}
                                </div>
                                <div className="riPrice">S${item.converted_price}</div>
                                {/* <button className="riCheckButton" onClick={this.handleClicked}>Book Now!</button> */}
                                <form action="/booking">
                                    <button className="riCheckButton" onClick={() => this.book(item.key)}>Book Now!</button>
                                </form>
                            </div>
                        )
                    })
                }
                </div>
{/*                {
                    this.state.redirect && <Navigate to='/some_route' replace={true} {this.state.}/>
                }*/}
            </div>

        );
    }
}

export default RoomList;



// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faStar, faStarHalf } from '@fortawesome/free-solid-svg-icons'
// import './RoomItem.css'
// import { useNavigate } from "react-router-dom";
// import React from 'react';

// const RoomItem = () => {
//   const navigate = useNavigate();
//   const room = 233;
//   const handleClicked = () => {
//     navigate(`/booking`, { state: { room } });
//   };
//   return (
//     <div className="roomItem">
//         <img src="https://pix10.agoda.net/hotelImages/18391689/0/2c6de0f77a916b78928c57f088f08fc6.jpg?ca=19&ce=1&s=1024x768" className="riImg" />
//         <div className="riDesc">
//             <h1 className="riTitle">Deluxe Room</h1>
//             <div className="riRating">
//               <span className="r1"><FontAwesomeIcon icon={faStar} /></span>
//               <span className="r2"><FontAwesomeIcon icon={faStar} /></span>
//               <span className="r3"><FontAwesomeIcon icon={faStar} /></span>
//               <span className="r4"><FontAwesomeIcon icon={faStar} /></span>
//               <span className="r5"><FontAwesomeIcon icon={faStarHalf} /></span>
//             </div>
//             <span className="riSubtitle">
//             Room with Air Contionining
//             </span>
//             <span className="riFeatures">
//             Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
//             </span>
//             <span className="riPrice">From S$50.6/night</span>
//             <button className="riCheckButton" onClick={handleClicked}>Book Now!</button>
//         </div>
//     </div>
//   )
// }

// export default RoomItem