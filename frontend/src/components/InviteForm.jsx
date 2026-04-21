import React, { useState } from 'react';
import API from '../api';
import Papa from 'papaparse';

export default function InviteForm({ eventId }) {
  const [emailsText, setEmailsText] = useState('');
  const [sending, setSending] = useState(false);
  const [msg, setMsg] = useState(null);

  const onUploadCSV = (file) => {
    if (!file) return;
    Papa.parse(file, {
      complete: (results) => {
        // flatten first column values
        const rows = results.data.flat().filter(Boolean);
        setEmailsText(prev => (prev ? prev + '\n' : '') + rows.join('\n'));
      }
    });
  };

  const submit = async () => {
    setMsg(null);
    const list = emailsText.split(/\s|,|\n/).map(s => s.trim()).filter(Boolean);
    if (list.length === 0) return setMsg({ type: 'error', text: 'Add at least one email' });

    setSending(true);
    try {
      const token = localStorage.getItem('token');
      const res = await API.post(`/events/${eventId}/invite`, { emails: list }, { headers: { Authorization: `Bearer ${token}` } });
      setMsg({ type: 'success', text: 'Invites sent successfully 🎉' });
      setEmailsText('');
      // show preview URLs if present (dev)
      console.log('invite results', res.data.results);
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Error sending invites' });
    } finally { setSending(false); }
  };

  return (
    <div className="bg-white/8 p-4 rounded-md text-white">
      <h4 className="font-semibold mb-2">Invite Guests</h4>

      {msg && <div className={`p-2 mb-2 rounded ${msg.type==='success' ? 'bg-green-500/20' : 'bg-red-500/20'}`}>{msg.text}</div>}

      <textarea value={emailsText} onChange={e=>setEmailsText(e.target.value)} placeholder="Paste emails, one per line or comma separated" className="w-full p-2 rounded bg-white/10 text-white placeholder-gray-300" rows={5} />

      <div className="flex items-center gap-2 mt-2">
        <input type="file" accept=".csv" onChange={e=>onUploadCSV(e.target.files[0])} />
        <button onClick={submit} disabled={sending} className="bg-primary px-4 py-2 rounded">{sending ? 'Sending...' : 'Send Invites'}</button>
      </div>
    </div>
  );
}
