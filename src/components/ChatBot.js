import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles, ChevronDown } from 'lucide-react';
import './ChatBot.css';

const pick = arr => arr[Math.floor(Math.random() * arr.length)];

const RESPONSES = {
  greet: [
    "Hey there! I'm **Luxe** ✨ — your Asquare & Co. travel genie! Planning a trip? I'm here to help you explore India and beyond! 🌍",
    "Hi! I'm **Luxe** 🗺️ your personal travel assistant from Asquare & Co. Ask me about destinations, packages or visas!",
    "Namaste! 🙏 I'm **Luxe**, your travel companion at Asquare & Co. Where shall we take you next?"
  ],

  // ── INDIA DESTINATIONS ──
  goa: ["Goa — sun, sand & vibes! 🏖️ Our Goa packages include beach resort stay, transfers & sightseeing. Best time: October–March. Shall I connect you with our Goa expert?"],
  kerala: ["God's Own Country! 🌿 Kerala packages include a houseboat cruise on the backwaters, Munnar tea estates & Ayurvedic spa sessions. Absolutely magical! Want details?"],
  rajasthan: ["Royal Rajasthan! 🏰 Our Rajasthan Heritage Tour covers Jaipur, Jodhpur & Udaipur — palace hotels, camel safaris & desert camps. Fit for royalty! Interested?"],
  kashmir: ["Paradise on Earth! ❄️ Kashmir packages include Dal Lake houseboat, Gulmarg snow & Pahalgam valleys. Best time: April–October. Want to plan a trip?"],
  himachal: ["Mountains calling! 🏔️ Himachal Pradesh packages cover Manali, Shimla & Spiti Valley — snow peaks, river rafting & bonfires under the stars. Want to know more?"],
  andaman: ["Island life! 🏝️ Andaman packages include Radhanagar Beach, scuba diving & glass-bottom boat rides. A hidden gem! Want our expert to share details?"],
  manali: ["Adventure awaits! 🎿 Manali packages include Rohtang Pass, Solang Valley, river rafting & paragliding. Perfect for thrill seekers! Interested?"],
  ooty: ["The Queen of Hills! 🌸 Ooty & Kodaikanal packages include a toy train ride, Botanical Gardens & misty valleys. So refreshing! Want more info?"],
  varanasi: ["Spiritual India! 🪔 Varanasi packages include Ganga Aarti, a sunrise boat ride & ancient ghats. A soul-stirring experience! Want to plan a visit?"],
  leh: ["The ultimate adventure! 🛣️ Leh Ladakh packages cover Pangong Lake, Nubra Valley, monasteries & mountain passes. Bucket list destination! Want details?"],
  coorg: ["Coffee & mist! ☕ Coorg packages include coffee plantation walks, Abbey Falls & misty hill stays. Perfect weekend escape! Want to know more?"],
  mumbai: ["City of dreams! 🌆 Mumbai city packages include Gateway of India, Marine Drive, a Bollywood tour & street food trails. Want our expert to help plan?"],

  // ── INTERNATIONAL ──
  maldives: ["The Maldives! 🏝️ Our packages include overwater villas, snorkelling & spa retreats. Best time: November–April. Ideal for honeymoons! Want details?"],
  bali: ["Bali is magical! 🌺 Our Bali packages include rice terraces, temple visits, surf lessons & amazing food. A dream trip! Want our expert to share more?"],
  dubai: ["Dubai awaits! 🌆 Our packages include Burj Khalifa, desert safari, Dubai Mall & dhow cruise. Glamour meets adventure! Want details?"],
  singapore: ["Singapore is stunning! 🦁 Our packages include Gardens by the Bay, Universal Studios & Sentosa Island. Want our team to put together a custom quote?"],
  thailand: ["Thailand — Land of Smiles! 🙏 Our packages cover Bangkok temples, Phuket beaches & amazing street food. Want our expert to reach out?"],
  europe: ["Europe calling! 🗼 Our grand tour packages cover Paris, Switzerland, Rome & Amsterdam. Want our team to craft a custom itinerary for you?"],

  // ── PACKAGE TYPES ──
  honeymoon: ["Congratulations! 💍 We have beautiful honeymoon packages across Goa, Kashmir, Maldives & Bali — all with private dinners, couple spa & special room decor. Click **Plan My Trip** and our expert will share personalised options just for you!"],
  family: ["Family trip! 👨‍👩‍👧‍👦 We have family packages across Goa, Rajasthan, Andaman & Himachal — all with kid-friendly activities & guided tours. Click **Plan My Trip** and our team will suggest the best fit for your family!"],
  adventure: ["Thrill seeker! 🏔️ We have adventure packages across Leh Ladakh, Manali, Rishikesh & Andaman — rafting, trekking, diving & camping all covered! Click **Plan My Trip** for a custom quote."],
  solo: ["Solo traveler! 🎒 We have solo-friendly packages across Goa, Manali, Rajasthan & Thailand — safe, social & well-organised. Click **Plan My Trip** and let's plan your adventure!"],
  group: ["Group travel! 🎊 We specialise in group packages with great discounts — custom itineraries, a dedicated trip manager & group activities included. Click **Plan My Trip** and tell us your group size!"],
  weekend: ["Weekend getaway! 🌅 We have quick escape packages from major cities — Coorg, Lonavala, Pondicherry, Shimla & more. Click **Plan My Trip** and we'll suggest the best option for you!"],
  luxury: ["Luxury travel! ✨ We offer premium experiences — palace hotels in Rajasthan, overwater villas in Maldives, luxury houseboats in Kerala & private Himalayan retreats. Click **Plan My Trip** for a bespoke itinerary!"],
  pilgrimage: ["Spiritual journeys! 🙏 We offer pilgrimage packages covering Char Dham Yatra, Varanasi, Golden Temple & South India temple tours. Click **Plan My Trip** and our team will help you plan a meaningful journey."],
  corporate: ["Corporate travel! 💼 We handle team outings, offsites & MICE events — retreats, conferences & incentive trips across India and internationally. Click **Plan My Trip** and share your details — we'll respond within 2 hours!"],

  // ── GENERAL ──
  budget: ["We have affordable packages across many Indian destinations! Click **Plan My Trip**, share your budget and travel dates — our expert will suggest the best options for you."],
  visa: ["Visa help! 🛂 We assist with visa documentation for ALL international packages:\n\n✅ Thailand — Visa on Arrival\n✅ Maldives — Free Visa on Arrival\n✅ Dubai — UAE visa assistance\n✅ Singapore — Application guidance\n✅ Europe — Schengen visa help\n\nWe handle all paperwork — you just pack your bags!"],
  book: ["Ready to plan? 🎉 Click **Plan My Trip** at the top of the page! Fill in your preferences and our travel expert will call you within **2 hours** with a custom quote. Completely FREE consultation!"],
  cancel: ["Cancellation policy! ↩️\n\n✅ **Free cancellation** up to 30 days before departure\n⚠️ **50% refund** between 15–30 days\n❌ **Non-refundable** within 15 days\n\nTravel insurance available for full protection!"],
  insurance: ["Travel insurance! 🛡️ Included in all premium packages. Covers:\n\n✅ Medical emergencies\n✅ Trip cancellation\n✅ Lost baggage\n✅ Flight delays\n✅ Personal accidents"],
  contact: ["Reach us anytime! 📞\n\n📱 **Phone:** +91 XXXXX XXXXX\n📧 **Email:** info@asquareco.com\n🕐 **Hours:** Mon–Sat, 9am–7pm\n\nOr click **Plan My Trip** and we'll call YOU within 2 hours!"],
  besttime: ["Best time to travel! 🗓️\n\n🏖️ **Goa & Beaches** — Oct to March\n🏔️ **Manali & Himachal** — Mar–Jun & Sep–Nov\n❄️ **Kashmir** — April to October\n🌿 **Kerala** — Sep to March\n🏰 **Rajasthan** — Oct to February\n🏝️ **Andaman** — Oct to May\n\nWhen are you planning to travel?"],

  default: [
    "Great question! 😊 Ask me about any destination or package type — I'm here to help plan your perfect trip! Or click **Plan My Trip** for a free consultation.",
    "Hmm, let me help! ✨ Try asking about **Indian destinations**, **honeymoon trips**, **family packages**, **adventure tours**, **budget travel** or **visa help**!",
    "I'd love to help plan your trip! 🌍 Which destination are you dreaming of, or what kind of trip — honeymoon, family, adventure, solo, luxury or pilgrimage?"
  ]
};

const QUICK = [
  'Honeymoon trips 💍',
  'Family packages 👨‍👩‍👧‍👦',
  'Kashmir ❄️',
  'Goa 🏖️',
  'Budget travel 💰',
  'Visa help 🛂',
];

function getBotReply(msg) {
  const m = msg.toLowerCase();
  if (m.match(/^(hi|hello|hey|hola|namaste|good\s|sup|yo)/)) return pick(RESPONSES.greet);
  if (m.match(/goa|beach|calangute|panjim/))               return RESPONSES.goa[0];
  if (m.match(/kerala|munnar|alleppey|backwater|kochi/))   return RESPONSES.kerala[0];
  if (m.match(/rajasthan|jaipur|jodhpur|udaipur/))         return RESPONSES.rajasthan[0];
  if (m.match(/kashmir|srinagar|gulmarg|pahalgam/))        return RESPONSES.kashmir[0];
  if (m.match(/himachal|shimla|dharamshala|spiti|kullu/))  return RESPONSES.himachal[0];
  if (m.match(/andaman|port blair|havelock/))              return RESPONSES.andaman[0];
  if (m.match(/manali|rohtang|solang/))                    return RESPONSES.manali[0];
  if (m.match(/ooty|kodaikanal|nilgiri/))                  return RESPONSES.ooty[0];
  if (m.match(/varanasi|banaras|kashi|ganga/))             return RESPONSES.varanasi[0];
  if (m.match(/leh|ladakh|pangong|nubra/))                 return RESPONSES.leh[0];
  if (m.match(/coorg|kodagu|coffee|wayanad/))              return RESPONSES.coorg[0];
  if (m.match(/mumbai|bombay|marine drive/))               return RESPONSES.mumbai[0];
  if (m.match(/maldiv/))                                   return RESPONSES.maldives[0];
  if (m.match(/bali|indonesia/))                           return RESPONSES.bali[0];
  if (m.match(/dubai|uae/))                                return RESPONSES.dubai[0];
  if (m.match(/singapore/))                                return RESPONSES.singapore[0];
  if (m.match(/thailand|bangkok|phuket/))                  return RESPONSES.thailand[0];
  if (m.match(/europe|paris|rome|switzerland/))            return RESPONSES.europe[0];
  if (m.match(/honeymoon|couple|wedding|anniversary|romantic/)) return RESPONSES.honeymoon[0];
  if (m.match(/family|kids|children|parents/))             return RESPONSES.family[0];
  if (m.match(/adventure|trek|hike|rafting|thrill/))       return RESPONSES.adventure[0];
  if (m.match(/solo|alone|single|backpack/))               return RESPONSES.solo[0];
  if (m.match(/group|friends|gang|colleagues|office/))     return RESPONSES.group[0];
  if (m.match(/weekend|short trip|quick|2 day|3 day/))     return RESPONSES.weekend[0];
  if (m.match(/luxury|premium|5 star|palace|royal/))       return RESPONSES.luxury[0];
  if (m.match(/pilgrim|temple|spiritual|yatra|religious/)) return RESPONSES.pilgrimage[0];
  if (m.match(/corporate|offsite|team|incentive|mice/))    return RESPONSES.corporate[0];
  if (m.match(/budget|cheap|afford|price|cost|how much/))  return RESPONSES.budget[0];
  if (m.match(/visa|passport|document/))                   return RESPONSES.visa[0];
  if (m.match(/book|plan|enquir|reserve/))                 return RESPONSES.book[0];
  if (m.match(/cancel|refund/))                            return RESPONSES.cancel[0];
  if (m.match(/insurance|cover|protect/))                  return RESPONSES.insurance[0];
  if (m.match(/contact|call|phone|email|whatsapp/))        return RESPONSES.contact[0];
  if (m.match(/best time|when to|season|weather/))         return RESPONSES.besttime[0];
  return pick(RESPONSES.default);
}

function MessageBubble({ msg }) {
  const parts = msg.text.split(/\*\*(.+?)\*\*/g);
  return (
    <div className={`msg-wrap ${msg.from}`}>
      {msg.from === 'bot' && <div className="bot-avatar"><Sparkles size={12} /></div>}
      <div className={`msg-bubble ${msg.from}`}>
        {parts.map((part, i) =>
          i % 2 === 1
            ? <strong key={i}>{part}</strong>
            : part.split('\n').map((line, j, arr) =>
                j < arr.length - 1
                  ? <React.Fragment key={j}>{line}<br /></React.Fragment>
                  : <React.Fragment key={j}>{line}</React.Fragment>
              )
        )}
      </div>
    </div>
  );
}

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState([
    { from: 'bot', text: "Hey! I'm **Luxe** ✈️ — your Asquare & Co. travel genie. Ask me about Indian destinations, packages or visas. Let's plan your dream trip!" }
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [unread, setUnread] = useState(1);
  const [minimized, setMinimized] = useState(false);
  const bottomRef = useRef();

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs, typing, open]);

  const send = (text) => {
    const t = (text || input).trim();
    if (!t) return;
    setMsgs(p => [...p, { from: 'user', text: t }]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMsgs(p => [...p, { from: 'bot', text: getBotReply(t) }]);
    }, 900 + Math.random() * 500);
  };

  const handleOpen = () => { setOpen(true); setUnread(0); };

  return (
    <>
      {!open && (
        <button className="chat-trigger" onClick={handleOpen}>
          <MessageCircle size={22} />
          <span>Ask Luxe</span>
          {unread > 0 && <span className="chat-badge">{unread}</span>}
        </button>
      )}

      {open && (
        <div className={`chatbot-window ${minimized ? 'minimized' : ''}`}>
          <div className="chat-header">
            <div className="chat-agent">
              <div className="chat-agent-avatar"><Sparkles size={16} /></div>
              <div>
                <div className="chat-agent-name">Luxe ✨</div>
                <div className="chat-agent-status"><span className="online-dot" /> Online · Asquare &amp; Co.</div>
              </div>
            </div>
            <div className="chat-header-btns">
              <button className="chat-hbtn" onClick={() => setMinimized(m => !m)} title="Minimize">
                <ChevronDown size={16} style={{ transform: minimized ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
              </button>
              <button className="chat-hbtn" onClick={() => setOpen(false)} title="Close"><X size={16} /></button>
            </div>
          </div>

          {!minimized && (
            <>
              <div className="chat-messages">
                {msgs.map((m, i) => <MessageBubble key={i} msg={m} />)}
                {typing && (
                  <div className="msg-wrap bot">
                    <div className="bot-avatar"><Sparkles size={12} /></div>
                    <div className="msg-bubble bot typing-bubble">
                      <span /><span /><span />
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              <div className="quick-replies">
                {QUICK.map(q => (
                  <button key={q} className="quick-reply" onClick={() => send(q)}>{q}</button>
                ))}
              </div>

              <div className="chat-input-row">
                <input
                  className="chat-input"
                  placeholder="Ask about destinations, packages..."
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && send()}
                />
                <button className="chat-send" onClick={() => send()} disabled={!input.trim()}>
                  <Send size={15} />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}