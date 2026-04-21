import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api';

export default function RSVP(){
  const { token } = useParams();
  const [data, setData] = useState(null);
  const [status, setStatus] = useState('');
  const [comment, setComment] = useState('');
  const [msg, setMsg] = useState(null);

  useEffect(()=>{
    (async ()=>{
      try{
        const res = await API.get(`/rsvp/${token}`);
        setData(res.data);
      }catch(err){
        setMsg({ type:'error', text: err.response?.data?.message || 'Invite not found' });
      }
    })();
  }, [token]);

  const submit = async () => {
    if (!status) return setMsg({ type:'error', text:'Choose response' });
    try{
      const res = await API.post(`/rsvp/${token}`, { status, comment });
      setMsg({ type:'success', text:'Your response has been recorded ✅' });
    }catch(err){
      setMsg({ type:'error', text: err.response?.data?.message || 'Error saving response' });
    }
  };

  if (!data) return <div className="p-6">Loading...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-palette3 to-palette6 p-6">
      <div className="bg-white/10 p-6 rounded-lg text-white max-w-md w-full">
        <h2 className="text-2xl font-bold mb-2">{data.event.title}</h2>
        <p className="mb-2">{data.event.description}</p>
        <p className="mb-2">📅 {new Date(data.event.date).toLocaleString()}</p>
        <p className="mb-4">📍 {data.event.venue} — {data.event.city}, {data.event.state}</p>

        {msg && <div className={`p-2 mb-3 rounded ${msg.type==='success' ? 'bg-green-500/20' : 'bg-red-500/20'}`}>{msg.text}</div>}

        <div className="space-y-2">
          <div className="flex gap-2">
            <button onClick={()=>setStatus('yes')} className={`flex-1 py-2 rounded ${status==='yes' ? 'bg-green-500' : 'bg-white/8'}`}>Yes</button>
            <button onClick={()=>setStatus('no')} className={`flex-1 py-2 rounded ${status==='no' ? 'bg-red-500' : 'bg-white/8'}`}>No</button>
            <button onClick={()=>setStatus('maybe')} className={`flex-1 py-2 rounded ${status==='maybe' ? 'bg-yellow-500' : 'bg-white/8'}`}>Maybe</button>
          </div>

          <textarea placeholder="Comment (optional)" value={comment} onChange={e=>setComment(e.target.value)} className="w-full p-2 rounded bg-white/8 text-black" />

          <button onClick={submit} className="w-full bg-primary py-2 rounded text-white">Submit Response</button>
        </div>
      </div>
    </div>
  );
}
