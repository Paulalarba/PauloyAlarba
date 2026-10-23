import { useState } from 'react';

const email = 'paulnicoralarba@gmail.com';

export default function ContactForm() {
  const [notice, setNotice] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const subject = String(data.get('subject') || '').trim();
    const message = String(data.get('message') || '').trim();
    if (message.length < 10) {
      setNotice('Please write at least 10 characters in your message.');
      return;
    }
    const name = String(data.get('name') || '').trim();
    const replyEmail = String(data.get('email') || '').trim();
    const body = `${message}\n\nFrom: ${name}\nReply to: ${replyEmail}`;
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setNotice('Your email app will open with the message ready to send.');
  }

  return <>
    {notice && <div className="contact-status" role="status">{notice}</div>}
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="contact-fields">
        <div className="contact-field"><label htmlFor="contact-name">Name</label><input id="contact-name" name="name" autoComplete="name" maxLength="100" required /></div>
        <div className="contact-field"><label htmlFor="contact-email">Email</label><input id="contact-email" name="email" type="email" autoComplete="email" maxLength="256" required /></div>
      </div>
      <div className="contact-field"><label htmlFor="contact-subject">Subject</label><input id="contact-subject" name="subject" autoComplete="off" maxLength="120" required /></div>
      <div className="contact-field"><label htmlFor="contact-message">Message</label><textarea id="contact-message" name="message" rows="6" minLength="10" maxLength="2000" required /></div>
      <button type="submit" className="contact-submit"><i className="fa-solid fa-paper-plane" aria-hidden="true" /> Send Message</button>
    </form>
  </>;
}
