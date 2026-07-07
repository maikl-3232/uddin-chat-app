import { useState, useEffect } from 'react';
import { Send, Smile, Paperclip } from 'lucide-react';
import { db } from './firebase';
import { collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import './App.css';

interface Message {
  id: string;
  text: string;
  sender: 'ikmal' | 'ais';
  createdAt: number;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');

  // Mendeteksi user aktif dari URL params, default-nya 'ikmal' jika tidak diisi
  const urlParams = new URLSearchParams(window.location.search);
  const currentUser = (urlParams.get('user') as 'ikmal' | 'ais') || 'ikmal';
  
  // Menentukan nama lawan bicara untuk ditaruh di Header
  const chatPartner = currentUser === 'ikmal' ? 'Ais' : 'Ikmal';

  // Ambil data dari Firestore secara Realtime
  useEffect(() => {
    const q = query(collection(db, "chats"), orderBy("createdAt", "asc"));
    
    // onSnapshot akan terpanggil otomatis setiap ada pesan baru di database
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesData: Message[] = [];
      snapshot.forEach((doc) => {
        messagesData.push({ id: doc.id, ...doc.data() } as Message);
      });
      setMessages(messagesData);
    });

    return () => unsubscribe();
  }, []);

  const handleSendMessage = async () => {
    if (inputValue.trim() === '') return;

    const textToSend = inputValue;
    setInputValue(''); // Kosongkan input langsung agar kerasa instant/cepat

    try {
      // Simpan langsung ke Firestore
      await addDoc(collection(db, "chats"), {
        text: textToSend,
        sender: currentUser,
        createdAt: Date.now()
      });
    } catch (error) {
      console.error("Gagal mengirim pesan: ", error);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 p-4">
      {/* Header */}
      <div className="bg-white p-4 shadow-sm rounded-t-lg flex items-center gap-3">
        <img
          src={`https://api.dicebear.com/7.x/initials/svg?seed=${chatPartner}`}
          alt="Avatar"
          className="w-10 h-10 rounded-full object-cover border border-gray-200"
        />
        <div className="flex flex-col">
          <span className="font-bold text-gray-800">{chatPartner}</span>
          <span className="text-xs text-green-500 font-normal">Online</span>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === currentUser ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[70%] p-3 rounded-lg ${msg.sender === currentUser
              ? 'bg-blue-500 text-white rounded-br-none'
              : 'bg-white text-gray-800 rounded-bl-none shadow-sm'
              }`}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="bg-white p-4 border-t flex items-center gap-3">
        <button className="text-gray-500 hover:text-blue-500">
          <Paperclip size={20} />
        </button>
        <button className="text-gray-500 hover:text-blue-500">
          <Smile size={20} />
        </button>
        <input
          type="text"
          placeholder="Ketik pesan..."
          className="flex-1 bg-gray-100 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <button 
          className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition shadow-lg"
          onClick={handleSendMessage}
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}

export default App;