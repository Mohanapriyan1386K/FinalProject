import {disributedmilkgivenstaus} from "../../../Services/ApiService"
import {useUserid,useUserdata} from "../../../Hooks/UserHook"
import { useState } from "react"

function CoustomerSlotcards({data}) {
 console.log(data)
 const token=useUserdata()
 const distrbutedid=useUserid()
  const Fetchusers=()=>{
    const payload=new FormData()
    payload.append("token",token)
    payload.append("distributor_id",distrbutedid)
    {slotid&& payload.append("slot_id",slotid)}

  }
  return (
    <div>MOHAN</div>
  )
}

export default CoustomerSlotcards