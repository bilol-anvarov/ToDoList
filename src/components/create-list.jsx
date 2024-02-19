import React, { useState } from 'react'
import Popup from './popup';
export default function CreateFunc() {
  const [canOpenPopup, setCanOpenPopup] = useState(false);
  
  const openPopup = ()=> {
    setCanOpenPopup(true);
  }
  const closePopup= ()=> {
    setCanOpenPopup(false);
  }

  document.addEventListener("keydown", (event)=>{
    if (event.key === "Escape" || event.key === "Back") {
        setCanOpenPopup(false);
    }
  });

  window.addEventListener('click',(event)=>{
    if(canOpenPopup){
      let eventKey = event.target; 
      let elemTwo = eventKey.classList.contains('btn-create-work'); 
      let elem = document.querySelector('.popup_card')
      if(elem){
          if(!elem.contains(eventKey) && !elemTwo){closePopup()}
      }
  }
  })
  return (
    <div>
        <button className='btn-create-work' onClick={openPopup}>+ Добавить</button>
        {/* popup окно */}
        {canOpenPopup && 
        <Popup 
          onClose={closePopup}
          type="create"
          text='Введите название для нового блока'
          description='Введите описание для нового блока'  
        />}
    </div>
  )
}
