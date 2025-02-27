import './Header.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faCalendarDays, faHouse, faPerson, faPersonBooth, faCartPlus, faBoxArchive,faPlusCircle, faPhone, faBed} from '@fortawesome/free-solid-svg-icons'
import { DateRange } from 'react-date-range'
import { useContext, useState } from 'react'
import { format } from "date-fns";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import { useNavigate } from "react-router-dom";
import { SearchContext } from '../../Context/SearchContext'
import React from 'react'

const Header = ({type}) => {
  const [destination, setDestination] = useState("");
  const [openDate, setOpenDate] = useState(false);
  const [dates, setDates] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [openOptions, setOpenOptions] = useState(false);
  const [options, setOptions] = useState({
    adult: 1,
    children: 0,
    room: 1,
  });
  const handleOption = (name, operation) => {
    setOptions((prev) => {
      return {
        ...prev,
        [name]: operation === "i" ? options[name] + 1 : options[name] - 1,
      };
    });
  };

  const {dispatch} = useContext(SearchContext)

  const navigate = useNavigate();
  const handleSearch = () => {
    dispatch({type:"NEW_SEARCH", payload:{destination, dates, options}})
    navigate("/hotels", { state: { destination, dates, options } });
  };
  return (
    <div className='header'>
        <div className={type === "list" ? "headerContainer listMode" : "headerContainer"}>
            <div className="headerList">
                <div className="headerListItem active">
                    <FontAwesomeIcon icon={faHouse} />
                    <span>Home</span>
                </div>
                <div className="headerListItem">
                    <FontAwesomeIcon icon={faPersonBooth} />
                    <span>Rooms</span>
                </div>
                <div className="headerListItem">
                    <FontAwesomeIcon icon={faPlusCircle} />
                    <span>Services</span>
                </div>
                <div className="headerListItem">
                    <FontAwesomeIcon icon={faCartPlus} />
                    <span>Shop</span>
                </div>
                <div className="headerListItem">
                    <FontAwesomeIcon icon={faBoxArchive} />
                    <span>Gallery</span>
                </div>
                <div className="headerListItem">
                    <FontAwesomeIcon icon={faPhone} />
                    <span>Contact</span>
                </div>
            </div>
            { type !=="list" && 
              <>
            <h1 className="headerTitle">Ascenda Hotel Booking</h1>
            <p className="headerDesc">The place you come to explore all options</p>
            </>
            }
        </div>
    </div>
  );
}

export default Header