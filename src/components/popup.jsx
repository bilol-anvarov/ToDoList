import React, { useState, useEffect } from 'react'

export default function Popup(props) {
  const oldText = JSON.parse(localStorage.getItem('textHistory'));
  let type = props.type;
  // имя
  const [name, setName] = useState('');
  function nameFunc (event){
    setName(event.target.value)
  }
  // описание
  const [description, setDescription] = useState('');
  function descriptionFunc(event){
    setDescription(event.target.value)
  }
  // дата 
  const [date, setDate] = useState('')
  function dateFunc(event){
    setDate(event.target.value)
  }

  const [nameChange, setNameChange] = useState('')
  const [descriptionChange, setDescriptionChange] = useState('')
  const [dateChange, setDateChange] = useState('')
  function nameFuncChange (event){
    setNameChange(event.target.value)
  }
  function descriptionFuncChange (event){
    setDescriptionChange(event.target.value)
  }
  function dateFuncChange (event){
    setDateChange(event.target.value)
  }
  if(type == 'change'){
    useEffect(() => {
      setNameChange(oldText[props.itemId - 1].name)
      setDescriptionChange(oldText[props.itemId - 1].paragraph)
      setDateChange(oldText[props.itemId - 1].diedline.replace(/^(\d+)\.(\d+)\.(\d+)$/, `$3-$2-$1`));
    }, [])
  }

  function send(){
    if(type == 'create'){
      if(name !== '' && description !== '' && date !== ''){
        let newTab = {
          id: (oldText.length + 1),
          name: name,
          paragraph: description,
          diedline: date.replace(/^(\d+)-(\d+)-(\d+)$/, `$3.$2.$1`),
          wordDecided: false,
          todoLists: []
        };
        oldText.push(newTab)
        localStorage.setItem('textHistory', JSON.stringify(oldText));
        window.location.reload();
      } else{
        alert('Заполните все текстовые поля правельно')
      }
    }
    if(type == 'change'){
      if(nameChange !== '' && descriptionChange !== '' && dateChange !== ''){
        oldText[props.itemId - 1].name = nameChange;
        oldText[props.itemId - 1].paragraph = descriptionChange;
        oldText[props.itemId - 1].diedline = dateChange.replace(/^(\d+)-(\d+)-(\d+)$/, `$3.$2.$1`);
        localStorage.setItem('textHistory', JSON.stringify(oldText))
        window.location.reload()
      } else{
        alert('Заполните все текстовые поля правельно')
      }

    }
  }
  return (
    <>
    <div className="popup">
      <div className="close">
        <span className="span-close">X</span>
      </div>
      <div className="popup_card card">
        <div className="name">
          <h2>{props.text}</h2>
          {type == 'create' && <input onChange={nameFunc} value={name} type="text" className='popup_input input_name popup_input_create'/>}
          {type == 'change' && <input onChange={nameFuncChange} value={nameChange} type="text" className='popup_input input_name popup_input_change'/>}
        </div>
        <div className="description">
          <h3>{props.description}</h3>
          {type == 'create' && <textarea onChange={descriptionFunc} value={description} type="text" className='popup_input input_description popup_input_create'/>}
          {type == 'change' && <textarea onChange={descriptionFuncChange} value={descriptionChange} type="text" className='popup_input input_description popup_input_change'/>}
        </div>
        <div className="date">
          <h3>Веберете дату</h3>
          {type == 'create' && <input onChange={dateFunc} value={date} type="date" className='popup_input input_date popup_input_create'/>}
          {type == 'change' && <input onChange={dateFuncChange} value={dateChange} type="date" className='popup_input input_date popup_input_change'/>}
        </div>
        <button onClick={send} className='popup_btn popup_send'>
          {type == 'create' && 'Добавить'}
          {type == 'change' && 'Изменить'}
        </button>
      </div>
    </div>
    </>
  )
}
