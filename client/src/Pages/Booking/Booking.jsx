import './Booking.css'
import React, {useContext, useState} from "react";
import axios from 'axios'
import Navbar from '../../Components/Navbar/Navbar'
import Header from '../../Components/Header/Header'
import Footer from '../../Components/Footer/Footer';
import key from '../../secretKey'
import useFetch from './../../hooks/useFetch'
import {SearchContext} from '../../Context/SearchContext';
import {useNavigate} from "react-router-dom";

var CryptoJS = require("crypto-js")



const Booking = () => {
    const { data, loading, error } = useFetch(`/Kkeys`);
    const [userFirstName, setUserFirstName] = useState('')
    const [userLastName, setUserLastName] = useState('')
    const [phoneNum, setPhoneNum] = useState('')
    const [emailAdd, setEmailAdd] = useState('')
    const [cardNum, setCardNum] = useState('')
    const [cardExpiry, setCardExpiry] = useState('')
    const [cardCvc, setCardCvc] = useState('')
    const [billingAdd, setBillingAdd] = useState('')
    const [msg, setMsg] = useState('')
    const {dates,options} = useContext(SearchContext);
    // console.log('dates',dates[0].startDate)
    console.log('options', options)
    const navigate = useNavigate();
    const alldates = getDatesInRange((dates[0] == undefined ? new Date() : dates[0].startDate),(dates[0] == undefined ? new Date() : dates[0].endDate));
    // console.log("starting",dates[0].startDate, dates[0].endDate,alldates);

    function maskData(cardNo) {
        var firstPart = cardNo.slice(0, 7)
        var lastPart = cardNo.slice(15)
        var maskedPart = ""
        for (var i = 7; i < 15; i++) {
            if (cardNo.charAt(i) === ' ') {
                maskedPart += ' '
            } else {
                maskedPart += 'X'
            }
        }
        return firstPart + maskedPart + lastPart
    }

    function encryption(data) {
        return CryptoJS.AES.encrypt(data, key).toString()
    }

    function getStartDate () {
        let start;
        try{
            // start = JSON.stringify(dates[0].startDate).slice(1, 11)
            start = JSON.stringify(dates[0].startDate)
        } catch(e){
            start = "2022-09-23"
        }
        return start
    }

    function getEndDate () {
        let end;
        try{
            // end = JSON.stringify(dates[0].endDate).slice(1, 11)
            end = JSON.stringify(dates[0].endDate)
        } catch(e){
            end = "2022-09-24"
        }
        return end
    }

    function getGuest () {
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

    function getDatesInRange(startDate, endDate){
        const start = new Date(startDate);
        const end = new Date(endDate);
        console.log("start = ", start);
        console.log("end = ", end);
    
        const date = new Date(start.getTime());
        console.log("date = ", date);
    
        const dates = [];
    
        while (date <= end) {
          dates.push(new Date(date).getTime());
          date.setDate(date.getDate() + 1);
          console.log("date = ", date);
        }
    
        return dates;
    };

    async function delete_key (id){
        try{
            const res = axios.delete(`/Kkeys/${id}`, {});
        }catch(err){}
    }

    async function book (key){
        try{
            const start = getStartDate();
            const end = getEndDate();
            const guest = getGuest();
            //const alldates = getDatesInRange(start,end);
            console.log("here",start, end, alldates);
            //let numberOfNights = dayDifference(dates[0].startDate, dates[0].endDate)
            const res = axios.post(`/keys/`, {
                key: key,
                firstname: userFirstName,
                lastname: userLastName,
                phoneNumber: phoneNum,
                emailAddress: emailAdd,
                billingAddress: billingAdd,
                numberOfNights: 1,
                startDate: start,
                endDate: end,
                unavailableDates: alldates,
                numberOfGuests: guest,
                message: msg,
                roomTypes: "single?"
            });
        }catch(err){}
    }



    function handleSubmit(e) {
        delete_key(data[0]._id)
        e.preventDefault()
        var dict = {}
        dict['Phone Number'] = encryption(phoneNum)
        dict['Email Address'] = encryption(emailAdd)
        dict['Billing Address'] = encryption(billingAdd)
        dict['Card Number'] = maskData(cardNum)
        alert(JSON.stringify(dict))
        book(data[0].key)
        setUserFirstName('')
        setUserLastName('')
        setPhoneNum('')
        setEmailAdd('')
        setCardNum('')
        setCardExpiry('')
        setCardCvc('')
        setBillingAdd('')
        navigate('/payment')
    }

    return (
        <>
            <Navbar/>
            <Header type="list"/>
            <div className="booking">
                <div className="bookingUserDetails">
                    <h1 className="detailsTitle">BOOKING</h1>
                    <h2 className="detailsSubTitle">User Details</h2>
                    <form className='user'>
                        <br/>
                        <br/>
                        <div className="userName">
                            <select name="salutation" id="salutation" className="salutation">
                                <option value="select">Select an option</option>
                                <option value="mr" id="mr">Mr</option>
                                <option value="mrs">Mrs</option>
                                <option value="miss">Miss</option>
                            </select>
                            <div className="firstName">
                                First Name<span className="require">*</span>
                                <input className='inputBox' id="firstName" type="text" value={userFirstName}
                                       onChange={(e) => setUserFirstName(e.target.value)} required/>
                            </div>
                            <div className="lastName">
                                Last Name<span className="require">*</span>
                                <input className='inputBox' id="lastName" type="text" value={userLastName}
                                       onChange={(e) => setUserLastName(e.target.value)} required/>
                            </div>
                        </div>
                        <div className="phoneNumber">
                            Phone Number<span className="require">*</span>
                            <input className='inputBox' id="phone" type="tel" value={phoneNum}
                                   onChange={(e) => setPhoneNum(e.target.value)} required/>
                        </div>
                        <div className="emailAddress">
                            Email Address<span className="require">*</span>
                            <input className='inputBox' id="email" type="email" value={emailAdd}
                                   onChange={(e) => setEmailAdd(e.target.value)} required/>
                        </div>
                        <div className="cardNumber">
                            Card Number<span className="require">*</span>
                            <input
                                className='inputBox'
                                id="card"
                                name='number'
                                placeholder='0000 0000 0000 0000'
                                type="tel"
                                pattern="^[0-9]{4} [0-9]{4} [0-9]{4} [0-9]{4}$"
                                value={cardNum}
                                onChange={(e) => setCardNum(e.target.value)}
                                // onChange={(event) => {
                                //   const {value} = event.target
                                //   event.target.value = normalizeCardNumber(value)
                                // }}
                                required
                            />
                        </div>
                        <div className="cardExpiry">
                            Card Expiry<span className="require">*</span>
                            <input
                                className='inputBox'
                                id="expiry"
                                name='expiry'
                                placeholder='MM/YY'
                                type="tel"
                                pattern="^[0-9]{2}/[0-9]{2}$"
                                value={cardExpiry}
                                onChange={e => setCardExpiry(e.target.value)}
                                // onChange={(event) => {
                                //   const {value} = event.target
                                //   event.target.value = normalizeCardExpiry(value)
                                // }}
                                required
                            />
                        </div>
                        <div className="cardCVC">
                            CVV/CVC<span className="require">*</span>
                            <input
                                className='inputBox'
                                id="cvc"
                                name='cvc'
                                placeholder='CVC/CVV'
                                type="tel"
                                pattern="^[0-9]{3}$"
                                value={cardCvc}
                                onChange={e => setCardCvc(e.target.value)}
                                // onFocus={e => setFocus(e.target.name)}
                                // onChange={(event) => {
                                //   const {value} = event.target
                                //   event.target.value = normalizeCardNumber(value)
                                // }}
                                required
                            />
                        </div>
                        <div className="specials">
                            Special Requests:
                            <div className="textBox">
                                <textarea className="Text1" id="special" cols="40" rows="5" value={msg}
                                            onChange={(e) => setMsg(e.target.value)}></textarea>
                            </div>
                        </div>
                        <div className="billingAddress">
                            Billing Address<span className="require">*</span>
                            <div className="textBox">
                                <textarea className="Text1" id="billing" cols="40" rows="5" value={billingAdd}
                                          onChange={(e) => setBillingAdd(e.target.value)}></textarea>
                            </div>
                        </div>
                        {/*<input className='submitBtn' type="submit"/>*/}
                        {/*<a href={`/booking`}>Submit</a>*/}
                        <input className='submitBtn' id="submit" type="submit" onClick={handleSubmit}/>
                    </form>
                </div>
            </div>
            <Footer/>
        </>
    );
}

export default Booking
