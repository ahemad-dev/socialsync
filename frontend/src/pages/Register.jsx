import React, { useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

export default function Register(){
  const [form, setForm] = useState({ name:'', email:'', password:'' });
  const [msg, setMsg] = useState(null);
  const navigate = useNavigate();

  const onChange = e => setForm({...form, [e.target.name]: e.target.value});

  const submit = async e => {
    e.preventDefault();
    setMsg(null);
    try {
      const res = await API.post('/auth/register', form);
      // save token
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setMsg({ type: 'success', text: 'Registered successfully ✅' });
      setTimeout(()=> navigate('/dashboard'), 900);
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Registration failed' });
    }
  };

  return (
    <div className="bg-white/8 backdrop-blur-md p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4 text-white">Register</h2>
      {msg && <div className={`p-3 mb-3 rounded ${msg.type==='success' ? 'bg-green-500/20 text-green-100' : 'bg-red-500/20 text-red-100'}`}>{msg.text}</div>}
      <form onSubmit={submit} className="space-y-3">
        <input name="name" value={form.name} onChange={onChange} placeholder="Your name" className="w-full p-3 rounded" />
        <input name="email" value={form.email} onChange={onChange} placeholder="Email" className="w-full p-3 rounded" />
        <input name="password" type="password" value={form.password} onChange={onChange} placeholder="Password" className="w-full p-3 rounded" />
        <button className="w-full bg-primary text-white py-2 rounded">Register</button>
      </form>
      <p className="mt-3 text-sm text-white/80">Already have account? <button onClick={()=>navigate('/login')} className="underline">Login</button></p>
    </div>
  );
}
