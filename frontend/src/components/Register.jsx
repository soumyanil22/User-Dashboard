import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const [state, setState] = useState('');
  const [referral, setReferral] = useState({
    linkedin: false,
    friends: false,
    'job-portal': false,
    others: false,
  });
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [gender, setGender] = useState('');
  const [city, setCity] = useState('');
  const setToken = useAuthStore((state) => state.setToken);
  const navigate = useNavigate();

  const handleCheck = (checkedKey) => {
    const updatedReferral = {
      linkedin: false,
      friends: false,
      'job-portal': false,
      others: false,
    };

    setReferral({ ...updatedReferral, [checkedKey]: !referral[checkedKey] });
  };

  const handleStateChange = (e) => {
    const value = e.target.value.toLowerCase();
    setState(value);
  };

  const handleName = (e) => {
    setName(e.target.value);
  };

  const handleEmail = (e) => {
    setEmail(e.target.value);
  };

  const handleGender = (e) => {
    setGender(e.target.value);
  };

  const referralVal = Object.keys(referral).filter(
    (key) => referral[key] === true
  )[0];

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const payload = {
        name,
        email,
        gender,
        password,
        phone: phoneNumber,
        city,
        state,
        referralSource: referralVal,
      };

      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/auth/register`,
        payload
      );

      setToken(res.data['access_token']);
      localStorage.setItem('token', res.data['access_token']);
      navigate('/');
    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className={`w-[440px] h-[630px] border px-6 box-border border-stone-500 dark:border-[#6366f1] rounded-lg mx-auto mt-8 dark:bg-slate-800 dark:text-white}`}
      >
        <h4 className="text-xl text-center dark:text-white mb-5 mt-2 font-semibold">
          Register
        </h4>
        <input
          value={name}
          onChange={handleName}
          className="dark:text-white outline outline-stone-500 dark:bg-slate-800 w-full h-9 pl-2 dark:outline dark:outline-[#6366f1] rounded-sm"
          type="text"
          placeholder="Enter your name"
          required
        />
        <br />
        <input
          value={email}
          onChange={handleEmail}
          className="dark:text-white outline outline-stone-500 dark:bg-slate-800 mt-4 w-full h-9 pl-2 dark:outline dark:outline-[#6366f1] rounded-sm"
          type="email"
          placeholder="Enter your email"
          required
        />
        <br />
        <input
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="dark:text-white outline outline-stone-500 dark:bg-slate-800 mt-4 w-full h-9 pl-2 dark:outline dark:outline-[#6366f1] rounded-sm"
          type="text"
          placeholder="Enter your phone number"
          required
        />
        <br />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="dark:text-white outline outline-stone-500 dark:bg-slate-800 mt-4 w-full h-9 pl-2 dark:outline dark:outline-[#6366f1] rounded-sm"
          type="password"
          placeholder="Enter your password"
          required
        />
        <br />
        <fieldset className="mt-4">
          <legend className="mb-1">Select your gender:</legend>
          <input
            value={'male'}
            id="male"
            checked={gender === 'male'}
            name="gender"
            onChange={handleGender}
            className="dark:text-white dark:bg-slate-800 has-[:checked]:ring-indigo-200"
            type="radio"
          />
          <label htmlFor="male" className="ml-1">
            male
          </label>
          <br />
          <input
            value={'female'}
            checked={gender === 'female'}
            id="female"
            name="gender"
            onChange={handleGender}
            className="dark:text-white dark:bg-slate-800 has-[:checked]:ring-indigo-200"
            type="radio"
          />
          <label htmlFor="female" className="ml-1">
            female
          </label>
        </fieldset>
        <fieldset className="mt-4">
          <legend className="mb-1">Referral Source:</legend>
          <input
            id="linkedin"
            onChange={() => handleCheck('linkedin')}
            checked={referral['linkedin']}
            className="dark:text-white dark:bg-slate-800"
            type="checkbox"
            name="linkedin"
          />
          <label htmlFor="linkedin" className="ml-1">
            LinkedIn
          </label>
          <input
            id="friends"
            onChange={() => handleCheck('friends')}
            checked={referral['friends']}
            className="dark:text-white dark:bg-slate-800 ml-2"
            type="checkbox"
            name="friends"
          />
          <label htmlFor="friends" className="ml-1">
            Friends
          </label>
          <input
            id="jobPortal"
            onChange={() => handleCheck('job-portal')}
            checked={referral['job-portal']}
            className="dark:text-white dark:bg-slate-800 ml-2"
            type="checkbox"
            name="jobPortal"
          />
          <label htmlFor="jobPortal" className="ml-1">
            Job Portal
          </label>
          <input
            id="others"
            onChange={() => handleCheck('others')}
            checked={referral['others']}
            className="dark:text-white dark:bg-slate-800 ml-2"
            type="checkbox"
            name="others"
          />
          <label htmlFor="others" className="ml-1">
            Others
          </label>
        </fieldset>
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          name="city"
          id="city"
          className="dark:bg-slate-800 h-9 w-34 outline outline-stone-500 dark:text-white mt-4 dark:outline dark:outline-[#6366f1] rounded-sm"
        >
          <option value="">Select your city</option>
          <option value="mumbai">Mumbai</option>
          <option value="pune">Pune</option>
          <option value="ahmedabad">Ahmedabad</option>
          <option value="bengaluru">Bengaluru</option>
        </select>
        <br />
        <input
          list="states"
          onChange={handleStateChange}
          value={state}
          className="dark:text-white outline outline-stone-500 dark:bg-slate-800 w-full h-9 pl-2 mt-4 dark:outline dark:outline-[#6366f1] rounded-sm"
          type="Search"
          placeholder="Enter your State"
        />
        <datalist id="states">
          <option value="Maharashtra" name="maharashtra" />
          <option value="Karnataka" />
          <option value="Gujarat" />
        </datalist>
        <br />
        <button
          className=" w-full dark:border dark:border-[#6366f1] mt-6 h-10 rounded-md hover:bg-stone-500 border border-stone-500 hover:text-white dark:hover:bg-cyan-700"
          type="submit"
        >
          Submit
        </button>
        <p className="text-center mt-4">
          Already have an account?
          <Link to="/login" className="text-blue-600 ml-2">
            Login
          </Link>
        </p>
      </form>
    </>
  );
};

export default Register;
