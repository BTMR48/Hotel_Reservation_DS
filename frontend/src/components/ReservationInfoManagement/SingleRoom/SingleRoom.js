import React ,{useEffect, useState} from 'react'
import { useHistory } from 'react-router';
import '../Rooms/Rooms.css'
import '../SingleRoom/SingleRoom.css'
import axios from 'axios'
import {orange,blue,red } from '@material-ui/core/colors';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import EditIcon from '@material-ui/icons/Edit';
import OutlinedInput from "@material-ui/core/OutlinedInput";
import {AddBooking} from './../../../Utils/BookingUtils'
import {AddPay} from './../../../Utils/PayUtils'

function RoomDetails(props) {

    const [isAdmin,setIsAdmin]=useState(false)
    const[id,setId]=useState("");
    const[roomNum,setroomNum]=useState("");
    const[description,setDescription]=useState("");
    const[type,setType]=useState("");
    const[price,setPrice]=useState("");
    const[imgUrl,setImgUrl]=useState("");
    const [rooms, setRooms] = useState([])
    const history=useHistory()
    const [user, setUser] = useState("");
    const[date,setDate]=useState("");
    const [isTy,setIsTy]=useState(true)

    const config = {
        headers: {
            "content-Type": "application/json"
        }
    };

    useEffect(() => {
        if(localStorage.getItem("user")){
            setUser(JSON.parse(localStorage.getItem('user')))
        }
        
        if(localStorage.getItem("adminAuthToken")){
            setIsAdmin(true)
        }

        
        
        
        async function getRoomDetails() {
            axios.get(`http://localhost:8280/room/${props.match.params.id}`).then((res) => {
                setId(res.data.reservationInfo._id) 
                setroomNum(res.data.reservationInfo.roomNum)
                setDescription(res.data.reservationInfo.description)
                setType(res.data.reservationInfo.type)
                setPrice(res.data.reservationInfo.price)   
                setImgUrl(res.data.reservationInfo.imgUrl)
                
                //check Booking type
                if (res.data.reservationInfo.type === "postpaid") {
                    setIsTy(true)
                }
                else if(res.data.reservationInfo.type === "prepaid"){
                    setIsTy(false)
                }
                
            }).catch((err) => {
                alert("Failed to Fetch Rooms")
            })
        }
        getRoomDetails();
        
    }, [props])
    
    async function deleteRoom(id){        
        await axios.delete(`http://localhost:8280/room/delete/${id}`,config).then(() => {
            alert("Room deleted successfully")
            history.push('/hotel/rooms')
        }).catch((error) => {
            alert(`Failed to delete the Room\n${error.message}`)
        }) 
    } 
        
            
    function view(id){
        history.push(`/hotel/room/${id}`)
    }
    function update(uid){
        history.push(`/admin/room/update/${uid}`)
    }

    function Pay(){
        history.push(`/customer/payment/${id}/${roomNum}/${price}/${date}`)
    }



  return (
    <div className='container' align ="center">
        <div className='detailRoomCard'>
            <div className='detailRoom'>
                    <img src={`${imgUrl}`} alt="roomDetails" />
                <div className='box-detailRoom'>
                        <div className='row'>
                            <h2>{roomNum}</h2>
                        </div>
                        <h5>Rs.{price}.00</h5>
                        <h6>{type}</h6>
                        <p className='text-muted'>{description}</p>
                        <div >
                            <OutlinedInput 
                                type="date" id="date" placeholder="Booking Date" 
                                onChange={(e)=>setDate(e.target.value)}
                                inputProps={{style: {padding: 12}}}
                            />
                        </div>
                </div>
            </div>
            <table className='singleItemBtn'>
                        <div>
                            {isAdmin === true ?
                                <div>
                                    <button className="mx-2 roomBtn" style={{backgroundColor:blue[400]}} onClick={()=>update(id)}>
                                    Update <EditIcon/>
                                    </button>
                                    <button className="mx-2 roomBtn" style={{backgroundColor:red[500]}} onClick={()=>deleteRoom(id)} >
                                    Delete <DeleteForeverIcon/>
                                    </button>
                                </div>
                                :
                                <div>
                                    {/* <button className="mx-2 roomBtn" style={{backgroundColor:orange[500]}} 
                                    onClick={()=>AddBooking(id, user._id, type, price)}>
                                    Book <ShoppingCartIcon/>
                                    </button> 
                                    <button className="mx-2 roomBtn" style={{backgroundColor:red[500]}} 
                                        onClick={()=>Buy()}>
                                        Buy Now
                                    </button>  */}
                                     {isTy == true ? 
                                        <button className="mx-2 roomBtn" style={{backgroundColor:orange[500]}} 
                                        onClick={()=>AddBooking(id, user._id, price, date, type)}>
                                        Add to Book <ShoppingCartIcon/>
                                        </button>
                                    :
                                    <div>
                                        <button className="mx-2 roomBtn" style={{backgroundColor:red[500]}} 
                                        // onClick={()=>AddPay(id, user._id, price, date, type)}>
                                        onClick={()=>Pay()}>
                                            Pay <ShoppingCartIcon/>
                                        </button> 
                                    </div>    
                                    }
                            </div>   
                            }
                        </div>
            </table>
        </div>
        <br></br>
    </div>
  )
}

export default RoomDetails