import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMovieDataContext } from '../provider/MovieDataContext';
import { useUserDataContext } from '../provider/userOrderContext';
import { usePathNameContext } from '../provider/PathNameContext';
import { useLoggedInContext } from '../provider/LoggedInContext';
import timeData from '../assets/TimeData.json';
import weekData from '../assets/WeekData.json';
import styles from '../UI/timeList.module.css';
import img from '../img/no-image.jpg';

const TimeSchedule = () => {
  const ticketArr = new Array(10).fill(0);
  const [enteredInput, setEnteredInputs] = useState({
    name: '',
    phone: '',
    email: '',
  });
  const [validInputs, setValidInputs] = useState({
    name: '',
    phone: '',
    email: '',
  });
  const [isValid, setIsValid] = useState({
    nameEmpty: true,
    nameValid: false,
    emailEmpty: true,
    emailValid: false,
    phoneEmpty: true,
    phoneValid: false,
  });

  const [selectedTime, setSelectedTime] = useState({ time: '' });
  const [selectedOption, setSelectedOption] = useState({ day: '', ticket: '' });
  const [selectedTimeID, setselectedTimeID] = useState([]);
  const { movieData } = useMovieDataContext();
  const { userData, setUserData } = useUserDataContext();
  const { pathName, setPathName } = usePathNameContext();
  const { isLoggedIn } = useLoggedInContext();
  const navigate = useNavigate();

  //==========0. Set Pathname for Navbar Active Page Color=======
  const getPathName = () => {
    const path = window.location.pathname;

    setPathName({ ...pathName, home: '', time: path, seat: '', login: '' });
  };

  useEffect(() => {
    getPathName();
  }, []);

  //========================Name check====================================
  const checkName = () => {
    if (enteredInput.name.length > 3) {
      setIsValid({ ...isValid, nameEmpty: false, nameValid: true });
      setValidInputs({ ...validInputs, name: enteredInput.name });
      return true;
    } else {
      // alert('???? ?????????? ?????? ?????????????? ?????????????? ?????????????? 3 ?????????????? ?????????????? ????!');
      setIsValid({ ...isValid, nameEmpty: false, nameValid: false });
      return false;
    }
  };
  //=========================Phone Check===============================
  const checkPhone = () => {
    let phoneRegex = /^[0-9]{8}$/;

    if (
      enteredInput.phone.length === 8 &&
      phoneRegex.test(enteredInput.phone.trim())
    ) {
      setIsValid({
        ...isValid,
        phoneEmpty: false,
        phoneValid: true,
      });
      setValidInputs({ ...validInputs, phone: enteredInput.phone });
      return true;
    } else {
      setIsValid({
        ...isValid,
        phoneEmpty: false,
        phoneValid: false,
      });
      return false;
    }
  };
  //========================Email Check==================================

  const checkEmail = () => {
    let emailRegex = /^[^ ]+@[^ ]+.[a-z]{2,3}$/;

    if (emailRegex.test(enteredInput.email.trim())) {
      setIsValid({ ...isValid, emailEmpty: false, emailValid: true });
      setValidInputs({ ...validInputs, email: enteredInput.email });
      return true;
    } else {
      setIsValid({
        ...isValid,
        emailEmpty: false,
        emailValid: false,
      });
      return false;
    }
  };

  //=================1. Name,Email,Pass hadgaldag eventHandler====================
  const eventHandler = (event) => {
    const { name, value } = event.target;
    if (name === 'name')
      setEnteredInputs({ ...enteredInput, [name]: value.trim() });
    if (name === 'phone')
      setEnteredInputs({ ...enteredInput, [name]: value.trim() });
    if (name === 'email')
      setEnteredInputs({ ...enteredInput, [name]: value.trim() });
  };

  //===================2. Tsag songoj hadgaldag eventHandler===================
  const timeClickHandler = (event) => {
    const timeValue = event.currentTarget.textContent;
    const id = +event.currentTarget.id;

    setSelectedTime({ time: timeValue });
    setselectedTimeID([id]);
  };

  //=================3. Odor, tasalbar songoj hadgaldag eventHandler================
  const selectOptionHandler = (event) => {
    const value = event.target.value;
    const name = event.target.selectedOptions[0].getAttribute('name');
    setSelectedOption({ ...selectedOption, [name]: value });
  };

  //===============4. Buh data-g hadgaldag heseg============================
  const saveAllData = () => {
    const validInputs = Object.values(enteredInput).every(
      (value) => value !== ''
    );
    const validOptions = Object.values(selectedOption).every(
      (value) => value !== ''
    );
    const validTime = selectedTime.time !== '';
    if (validInputs && validOptions && validTime) {
      setUserData({
        ...enteredInput,
        ...selectedTime,
        ...selectedOption,
        movie: movieData.Title,
      });
      alert('?????? ???????????????? ?????? ??????????!');
      return true;
    } else {
      alert('???????? ?????????? ???????????????? ?????????? ??????????. ???? ?????????? ?????? ?????????????? ????!');
      return false;
    }
  };

  //===============5. Omnoh Page-ruu JUMP hiine.=================================
  const prevPageHandler = () => {
    navigate('/movie');
  };
  //===============5. Next Page-ruu JUMP hiine.=================================
  const nextPageHandler = () => {
    if (isLoggedIn) {
      if (movieData === '') alert('???? ?????????? ???????????? ?????? ?????? ?????????????? ?????????????? ????');
      else if (saveAllData()) navigate('/seat');
    } else alert('???? ???????????? ?????????????? ???????? ????!');
  };

  return (
    <div className={styles.timeWrapper}>
      <div className={styles.leftImg}>
        {movieData.Poster ? <img src={movieData.Poster} /> : <img src={img} />}
      </div>
      <div className={styles.timeRightContainer}>
        <h2>?????????????????? ??????????</h2>
        <div className={styles.timeSelectContainer}>
          <p>?????????????????? ?????????????? ????:</p>
          <div className={styles.inputArea}>
            <label>??????*</label>
            <input
              type='text'
              name='name'
              value={enteredInput.name}
              onChange={eventHandler}
              onBlur={checkName}
              className={
                isValid.nameEmpty
                  ? styles.inputFormArea
                  : isValid.nameValid
                  ? styles.inputFormArea + ' ' + styles.success
                  : styles.inputFormArea + ' ' + styles.error
              }
              disabled={isLoggedIn ? false : true}
            />
            {enteredInput.name.length <= 3 && enteredInput.name.length >= 1 ? (
              <small>???? 3-?????? ???????? ???????? ?????????????? ????.</small>
            ) : (
              ''
            )}
            <label>????????*</label>
            <input
              type='phone'
              name='phone'
              value={enteredInput.phone}
              onChange={eventHandler}
              onBlur={checkPhone}
              className={
                isValid.phoneEmpty
                  ? styles.inputFormArea
                  : isValid.phoneValid
                  ? styles.inputFormArea + ' ' + styles.success
                  : styles.inputFormArea + ' ' + styles.error
              }
              disabled={isLoggedIn ? false : true}
            />
            {enteredInput.phone.length < 8 && enteredInput.phone.length >= 1 ? (
              <small>???? ???? 8?? ?? ?????? ?????????????? ????.</small>
            ) : (
              ''
            )}
            <label>??????????*</label>
            <input
              type='email'
              name='email'
              value={enteredInput.email}
              onChange={eventHandler}
              onBlur={checkEmail}
              className={
                isValid.emailEmpty
                  ? styles.inputFormArea
                  : isValid.emailValid
                  ? styles.inputFormArea + ' ' + styles.success
                  : styles.inputFormArea + ' ' + styles.error
              }
              disabled={isLoggedIn ? false : true}
            />
            {!enteredInput.email.includes('@') &&
            enteredInput.email.length < 8 &&
            enteredInput.email.length >= 1 ? (
              <small>???? ?????????????? ?????? ?????????????? ????.</small>
            ) : (
              ''
            )}
          </div>

          <p>?????????? ?????????????? ????:</p>
          <div className={styles.timeListContainer}>
            {timeData.map((time, idx) => {
              const isSelected = selectedTimeID.includes(idx);
              return (
                <span
                  id={idx}
                  className={
                    isLoggedIn
                      ? isSelected
                        ? styles.times + ' ' + styles.active
                        : styles.times
                      : styles.times + ' ' + styles.invalid
                  }
                  key={idx}
                  name='time'
                  onClick={timeClickHandler}
                >
                  {time}
                </span>
              );
            })}
          </div>
          <p>?????????? ?????????????? ????:</p>
          <div>
            <label>????????????: </label>
            <select
              className={styles.selectDay}
              onChange={selectOptionHandler}
              disabled={isLoggedIn ? false : true}
            >
              {weekData.map((day, idx) => {
                return (
                  <option key={idx} name='day' value={day}>
                    {day}
                  </option>
                );
              })}
            </select>
          </div>
          <p>???????????????????? ???????? ?????????????? ????:</p>
          <div>
            <label>????????????????: </label>
            <select
              className={styles.selectDay}
              onChange={selectOptionHandler}
              disabled={isLoggedIn ? false : true}
            >
              {ticketArr.map((el, idx) => {
                return (
                  <option key={idx} name='ticket' value={idx + 1}>
                    {idx + 1} ??
                  </option>
                );
              })}
            </select>
          </div>
        </div>
        <div className={styles.buttonContainer}>
          <button onClick={nextPageHandler} disabled={null}>
            ????????????????????????
          </button>
          <button onClick={prevPageHandler}>??????????</button>
        </div>
      </div>
    </div>
  );
};

export default TimeSchedule;
